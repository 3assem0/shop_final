interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
}import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, Plus, Edit3, Trash2, Star, RefreshCw, Upload, Save, X, Package, DollarSign, Tag, Palette, Star as StarIcon, Users } from 'lucide-react';
import LoginForm from './LoginForm';


interface Product {
  name: string;
  description: string;
  price: number;
  featured?: boolean;
  image?: string;
  color?: string;
  colorHex?: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
  oldPrice?: string;
}

interface ProductData {
  products: Product[];
  lastUpdated: string;
}

interface Message {
  text: string;
  type: 'success' | 'error' | 'info';
}

const AdminPanel: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingIndex, setEditingIndex] = useState<number>(-1);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<Message | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  
  const [formData, setFormData] = useState<Product>({
    name: '',
    description: '',
    price: 0,
    featured: false,
    image: '',
    color: '',
    colorHex: '#6366f1',
    category: '',
    rating: 4,
    reviewCount: 1,
    oldPrice: ''
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
  const [authToken, setAuthToken] = useState<string | null>(null);

  // Upload image to Cloudinary
  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Data = reader.result as string;
          const response = await fetch('/api/upload-image', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              imageData: base64Data,
              folder: 'mohair-products'
            })
          });

          const result = await response.json();
          
          if (result.success) {
            resolve(result.url);
          } else {
            reject(new Error(result.error || 'Failed to upload image'));
          }
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  // Load products from backend
  const loadProducts = useCallback(async () => {
    setIsRefreshing(true);
    setIsLoading(true);
    try {
      const response = await fetch('/api/get-products');
      if (!response.ok) throw new Error('Failed to load products');
      const data: ProductData = await response.json();
      setProducts(data.products || []);
      showMessage('Products loaded successfully!', 'success');
    } catch (err: unknown) {
      if (err instanceof Error) {
        showMessage(err.message || 'Failed to load products', 'error');
      } else {
        showMessage('Failed to load products', 'error');
      }
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  }, []);

  // Check for existing session on mount
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      verifySession(token);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  // Verify session token
  const verifySession = async (token: string) => {
    try {
      const response = await fetch('/api/auth-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      
      const result = await response.json();
      
      if (result.success && result.authenticated) {
        setAuthToken(token);
        setIsAuthenticated(true);
        loadProducts();
      } else {
        localStorage.removeItem('admin_token');
        setIsAuthenticated(false);
      }
    } catch (error) {
      localStorage.removeItem('admin_token');
      setIsAuthenticated(false);
    }
  };

  // Handle successful login
  const handleLogin = (token: string) => {
    setAuthToken(token);
    setIsAuthenticated(true);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setAuthToken(null);
    setIsAuthenticated(false);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.price) {
      showMessage('Please fill in all required fields.', 'error');
      return;
    }

    const featuredCount = products.filter(p => p.featured).length;
    if (formData.featured && (!products[editingIndex]?.featured)) {
      if (featuredCount >= 3) {
        showMessage('You can only feature up to 3 products in the Hero section.', 'error');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      let imageUrl = formData.image;
      
      // Upload image to Cloudinary if a new file was selected
      if (imageFile) {
        setIsUploadingImage(true);
        try {
          imageUrl = await uploadImageToCloudinary(imageFile);
          showMessage('Image uploaded successfully!', 'success');
        } catch (uploadError) {
          showMessage(`Failed to upload image: ${uploadError instanceof Error ? uploadError.message : 'Unknown error'}`, 'error');
          return;
        } finally {
          setIsUploadingImage(false);
        }
      }

      let updatedProducts: Product[];
      if (editingIndex >= 0) {
        updatedProducts = [...products];
        updatedProducts[editingIndex] = {
          ...formData,
          name: formData.name.trim(),
          description: formData.description.trim(),
          price: Number(formData.price),
          image: imageUrl,
          rating: Number(formData.rating),
          reviewCount: Number(formData.reviewCount),
        };
        showMessage('Product updated successfully!', 'success');
      } else {
        updatedProducts = [...products, {
          ...formData,
          name: formData.name.trim(),
          description: formData.description.trim(),
          price: Number(formData.price),
          image: imageUrl,
          rating: Number(formData.rating),
          reviewCount: Number(formData.reviewCount),
        }];
        showMessage('Product added successfully!', 'success');
      }
      const response = await fetch('/api/update-json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newData: { products: updatedProducts, lastUpdated: new Date().toISOString() } })
      });
      const result: ApiResponse = await response.json();
      if (!result.success) throw new Error(result.error || 'Failed to save product');
      await loadProducts();
      clearForm();
    } catch (err: unknown) {
      if (err instanceof Error) {
        showMessage(err.message || 'Failed to save product', 'error');
      } else {
        showMessage('Failed to save product', 'error');
      }
    } finally {
      setIsSubmitting(false);
      setShowAddForm(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const editProduct = (index: number) => {
    const product = products[index];
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      featured: !!product.featured,
      image: product.image || '',
      color: product.color || '',
      colorHex: product.colorHex || '#6366f1',
      category: product.category || '',
      rating: product.rating || 4,
      reviewCount: product.reviewCount || 1,
      oldPrice: product.oldPrice || ''
    });
    setEditingIndex(index);
    setShowAddForm(true);
    setImageFile(null);
  };

  const deleteProduct = async (index: number) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const updatedProducts = products.filter((_, i) => i !== index);
      const response = await fetch('/api/update-json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newData: { products: updatedProducts, lastUpdated: new Date().toISOString() } })
      });
      const result: ApiResponse = await response.json();
      if (!result.success) throw new Error(result.error || 'Failed to delete product');
      showMessage('Product deleted successfully!', 'success');
      await loadProducts();
      if (editingIndex === index) clearForm();
    } catch (err: unknown) {
      if (err instanceof Error) {
        showMessage(err.message || 'Failed to delete product', 'error');
      } else {
        showMessage('Failed to delete product', 'error');
      }
    }
  };

  const clearForm = () => {
    setFormData({ 
      name: '', 
      description: '', 
      price: 0, 
      featured: false, 
      image: '', 
      color: '', 
      colorHex: '#6366f1', 
      category: '', 
      rating: 4, 
      reviewCount: 1, 
      oldPrice: '' 
    });
    setEditingIndex(-1);
    setImageFile(null);
    setShowAddForm(false);
  };

  const showMessage = (text: string, type: 'success' | 'error' | 'info') => {
    setMessage({ text, type });
    if (type === 'success') {
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const toggleFeatured = async (index: number) => {
    const product = products[index];
    const featuredCount = products.filter(p => p.featured).length;
    
    if (!product.featured && featuredCount >= 3) {
      showMessage('You can only feature up to 3 products in the Hero section.', 'error');
      return;
    }
    
    try {
      const featuredCount = products.filter(p => p.featured).length;
      if (!product.featured && featuredCount >= 3) {
        showMessage('You can only feature up to 3 products in the Hero section.', 'error');
        return;
      }
      // Only toggle featured for the selected product
      const updatedProducts = products.map((p, i) =>
        i === index ? { ...p, featured: !p.featured } : p
      );
      // Safeguard: never send an empty array
      if (updatedProducts.length === 0) {
        showMessage('Error: Products array is empty. Aborting update.', 'error');
        return;
      }
      const response = await fetch('/api/update-json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newData: { products: updatedProducts, lastUpdated: new Date().toISOString() } })
      });
      const result: ApiResponse = await response.json();
      if (!result.success) throw new Error(result.error || 'Failed to update featured status');
      showMessage(!product.featured ? 'Product added to featured' : 'Product removed from featured', 'success');
      await loadProducts();
    } catch (err: unknown) {
      if (err instanceof Error) {
        showMessage(err.message || 'Failed to update featured status', 'error');
      } else {
        showMessage('Failed to update featured status', 'error');
      }
    }
  };

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  function goToHome(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    event.preventDefault();
    window.location.href = '/';
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={goToHome}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="font-medium">Back to Store</span>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
                <p className="text-sm text-gray-500">Manage your product inventory</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Logout"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Message Alert */}
      {message && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className={`p-4 rounded-lg shadow-sm ${
            message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
            message.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
            'bg-blue-50 text-blue-800 border border-blue-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className="font-medium">{message.text}</span>
              <button
                onClick={() => setMessage(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stats Cards */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Package className="w-8 h-8 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Products</p>
                  <p className="text-2xl font-semibold text-gray-900">{products.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Star className="w-8 h-8 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Featured</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {products.filter(p => p.featured).length}/3
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Avg Price</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    ${products.length > 0 ? (products.reduce((sum, p) => sum + parseFloat(String(p.price ?? '0')), 0) / products.length).toFixed(2) : '0.00'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Tag className="w-8 h-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Categories</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {new Set(products.map(p => p.category).filter(Boolean)).size}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Add/Edit Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {editingIndex >= 0 ? 'Edit Product' : 'Add New Product'}
                  </h2>
                  {!showAddForm && editingIndex === -1 && (
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Product
                    </button>
                  )}
                </div>
              </div>

              {(showAddForm || editingIndex >= 0) && (
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="Enter product name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="Enter product description"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price *
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        placeholder="29.99"
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Old Price
                      </label>
                      <input
                        type="number"
                        name="oldPrice"
                        value={formData.oldPrice}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        placeholder="39.99"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="e.g., Electronics"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Color Name
                      </label>
                      <input
                        type="text"
                        name="color"
                        value={formData.color}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        placeholder="Blue"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Color
                      </label>
                      <input
                        type="color"
                        name="colorHex"
                        value={formData.colorHex}
                        onChange={handleInputChange}
                        className="w-full h-10 rounded-lg border border-gray-300 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rating
                      </label>
                      <input
                        type="number"
                        name="rating"
                        value={formData.rating}
                        onChange={handleInputChange}
                        min={1}
                        max={5}
                        step={1}
                        className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Reviews
                      </label>
                      <input
                        type="number"
                        name="reviewCount"
                        value={formData.reviewCount}
                        onChange={handleInputChange}
                        min={0}
                        step={1}
                        className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Image
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => {
                          const file = e.target.files?.[0] || null;
                          setImageFile(file);
                          if (file) {
                            // Show preview with local URL, but don't save it as the final image
                            const previewUrl = URL.createObjectURL(file);
                            setFormData(prev => ({ ...prev, image: previewUrl }));
                          }
                        }}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Choose File
                      </label>
                    </div>
                    {formData.image && (
                      <div className="mt-3">
                        <img
                          src={formData.image}
                          alt="Preview"
                          className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={!!formData.featured}
                      onChange={e => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Show in Hero section (Featured, max 3)
                    </label>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting || isUploadingImage}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isUploadingImage ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Uploading Image...
                        </>
                      ) : isSubmitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          {editingIndex >= 0 ? 'Updating...' : 'Adding...'}
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          {editingIndex >= 0 ? 'Update' : 'Add Product'}
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={clearForm}
                      disabled={isSubmitting}
                      className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Products List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Products</h2>
                  <button
                    onClick={loadProducts}
                    disabled={isRefreshing}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <RefreshCw className={`w-4 h-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {products.length === 0 ? (
                  <div className="p-8 text-center">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No products added yet.</p>
                  </div>
                ) : (
                  products.map((product, index) => (
                    <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start space-x-4">
                        {product.image && (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <h3 className="text-lg font-medium text-gray-900 truncate">
                                  {product.name}
                                </h3>
                                {product.featured && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    <StarIcon className="w-3 h-3 mr-1" />
                                    Featured
                                  </span>
                                )}
                              </div>
                              {product.description && (
                                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                  {product.description}
                                </p>
                              )}
                              <div className="flex items-center space-x-4 mt-2">
                                <span className="text-lg font-semibold text-gray-900">
                                  ${product.price}
                                </span>
                                {product.oldPrice && (
                                  <span className="text-sm text-gray-500 line-through">
                                    ${product.oldPrice}
                                  </span>
                                )}
                                {product.category && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    {product.category}
                                  </span>
                                )}
                                {product.color && (
                                  <div className="flex items-center space-x-1">
                                    <div
                                      className="w-4 h-4 rounded-full border border-gray-200"
                                      style={{ backgroundColor: product.colorHex }}
                                    />
                                    <span className="text-xs text-gray-500">{product.color}</span>
                                  </div>
                                )}
                              </div>
                              {product.rating && (
                                <div className="flex items-center space-x-1 mt-2">
                                  {[...Array(5)].map((_, i) => (
                                    <StarIcon
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < product.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                  <span className="text-sm text-gray-500 ml-2">
                                    ({product.reviewCount} reviews)
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleFeatured(index)}
                            className={`p-2 rounded-lg transition-colors ${
                              product.featured
                                ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                            }`}
                            title={product.featured ? 'Remove from featured' : 'Add to featured'}
                          >
                            <Star className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => editProduct(index)}
                            className="p-2 rounded-lg bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteProduct(index)}
                            className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;