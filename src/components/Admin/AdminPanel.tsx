/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styles from './AdminPanel.module.css';

interface Product {
  name: string;
  description: string;
  price: string;
  featured?: boolean;
  image?: string; // image URL
}

interface ProductData {
  products: Product[];
  lastUpdated: string;
}

interface Message {
  text: string;
  type: 'success' | 'error' | 'info';
}

interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
}

const AdminPanel: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [editingIndex, setEditingIndex] = useState<number>(-1);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<Message | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  
  // Form state
  const [formData, setFormData] = useState<Product>({
    name: '',
    description: '',
    price: '',
    featured: false,
    image: ''
  });
  // Single correct loadProducts definition
  const loadProducts = React.useCallback(async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch('/api/get-products');
      if (response.ok) {
        const data: ProductData = await response.json();
        setProducts(data.products || []);
        showMessage('Products loaded successfully!', 'success');
      } else {
        setProducts([]);
        showMessage('No products file found. Starting with empty list.', 'info');
      }
    } catch (error) {
      console.error('Error loading products:', error);
      showMessage('Error loading products. Starting with empty list.', 'error');
      setProducts([]);
    } finally {
      setIsRefreshing(false);
    }
  }, []);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Authentication check
  const checkAuth = React.useCallback(async () => {
    const password = searchParams.get('password');
    
    if (!password) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/verify-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const result: ApiResponse = await response.json();

      if (response.ok && result.success) {
        setIsAuthenticated(true);
        await loadProducts();
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, [searchParams, loadProducts]);


  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim() || !formData.price.trim()) {
      showMessage('Please fill in all required fields.', 'error');
      return;
    }
    // Enforce max 3 featured products
    const featuredCount = products.filter(p => p.featured).length;
    if (formData.featured && (!products[editingIndex]?.featured)) {
      if (featuredCount >= 3) {
        showMessage('You can only feature up to 3 products in the Hero section.', 'error');
        return;
      }
    }

    setIsSubmitting(true);

    let imageUrl = formData.image || '';
    // Handle image upload (local preview for now)
    if (imageFile) {
      imageUrl = URL.createObjectURL(imageFile);
    }

    try {
      let updatedProducts: Product[];
      if (editingIndex >= 0) {
        // Update existing product
        updatedProducts = [...products];
        updatedProducts[editingIndex] = {
          name: formData.name.trim(),
          description: formData.description.trim(),
          price: formData.price.trim(),
          featured: formData.featured,
          image: imageUrl
        };
      } else {
        // Add new product
        updatedProducts = [...products, {
          name: formData.name.trim(),
          description: formData.description.trim(),
          price: formData.price.trim(),
          featured: formData.featured,
          image: imageUrl
        }];
      }

      const newData: ProductData = {
        products: updatedProducts,
        lastUpdated: new Date().toISOString()
      };

      const response = await fetch('/api/update-json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newData }),
      });

      const result: ApiResponse = await response.json();

      if (response.ok) {
        showMessage(
          editingIndex >= 0 ? 'Product updated successfully!' : 'Product added successfully!',
          'success'
        );
        setProducts(updatedProducts);
        clearForm();
      } else {
        throw new Error(result.error || 'Failed to update products');
      }
    } catch (error: any) {
      console.error('Error:', error);
      showMessage(`Error: ${error.message}`, 'error');
    } finally {
      setIsSubmitting(false);
      setImageFile(null);
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Edit product
  const editProduct = (index: number) => {
    const product = products[index];
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      featured: !!product.featured,
      image: product.image || ''
    });
    setEditingIndex(index);
    setImageFile(null);
    showMessage('Editing product. Make your changes and click Update.', 'info');
  };

  // Delete product
  const deleteProduct = async (index: number) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const updatedProducts = products.filter((_, i) => i !== index);
      setProducts(updatedProducts);
      showMessage('Deleting product...', 'info');

      const newData: ProductData = {
        products: updatedProducts,
        lastUpdated: new Date().toISOString()
      };

      const response = await fetch('/api/update-json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newData }),
      });

      const result: ApiResponse = await response.json();

      if (response.ok) {
        showMessage('Product deleted successfully!', 'success');
        
        if (editingIndex === index) {
          clearForm();
        } else if (editingIndex > index) {
          setEditingIndex(prev => prev - 1);
        }
      } else {
        // Revert changes if server update failed
        setProducts(products);
        throw new Error(result.error || 'Failed to delete product');
      }
    } catch (error: any) {
      console.error('Error:', error);
      showMessage(`Error deleting product: ${error.message}`, 'error');
    }
  };

  // Clear form
  const clearForm = () => {
  setFormData({ name: '', description: '', price: '', featured: false, image: '' });
  setEditingIndex(-1);
  setImageFile(null);
  setMessage(null);
  };

  // Show message
  const showMessage = (text: string, type: 'success' | 'error' | 'info') => {
    setMessage({ text, type });
    
    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
      setTimeout(() => setMessage(null), 5000);
    }
  };

  // Navigate back to home
  const goToHome = () => {
    navigate('/');
  };

  // Check authentication when component mounts or search params change
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Loading state
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Loading...</h1>
        </div>
      </div>
    );
  }

  // Access denied state
  if (!isAuthenticated) {
    return (
      <div className= "flex items-center justify-center bg-white/95 h-screen w-full">
       
        
        <div className={styles.accessDenied}>
          <h2>🚫 Access denied.</h2>
          <p>You are not authorized</p>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white/95 min-h-screen w-full p-10'>
      <div className='flex items-center justify-center'>
        <h1>Admin Panel</h1>
        <p>Manage your products inventory</p>
      </div>

  <button onClick={goToHome} className={styles.backLink}>
        ← Back to Store
      </button>

      <div className={styles.adminPanel}>
        <div className={styles.formSection}>
          <h2>Add New Product</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Product Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter product name"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter product description"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="price">Price *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                placeholder="e.g., 29.99"
                step="0.01"
                min="0"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="image">Product Image</label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={e => {
                  const file = e.target.files?.[0] || null;
                  setImageFile(file);
                  if (file) {
                    setFormData(prev => ({ ...prev, image: URL.createObjectURL(file) }));
                  }
                }}
              />
              {formData.image && (
                <img src={formData.image} alt="Preview" style={{ maxWidth: '100px', marginTop: '8px' }} />
              )}
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="featured">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={!!formData.featured}
                  onChange={e => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                  style={{ marginRight: '8px' }}
                />
                Show in Hero section (Featured, max 3)
              </label>
            </div>
            <button
              type="submit"
              className={styles.btn + ' ' + styles.btnPrimary}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className={styles.loading}></span>
                  {editingIndex >= 0 ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                editingIndex >= 0 ? 'Update Product' : 'Add Product'
              )}
            </button>
            <button
              type="button"
              className={styles.btn + ' ' + styles.btnSecondary}
              onClick={clearForm}
              disabled={isSubmitting}
            >
              Clear Form
            </button>
          </form>
        </div>

        {message && (
          <div className={styles.message + ' ' + styles[message.type]}>
            {message.text}
          </div>
        )}

        <div className={styles.formSection}>
          <h2>📦 Current Products</h2>
          <button
            className={styles.btn + ' ' + styles.btnSecondary}
            onClick={loadProducts}
            disabled={isRefreshing}
          >
            {isRefreshing ? '🔄 Loading...' : '🔄 Refresh Products'}
          </button>
          
          <div className={styles.productsList}>
            {products.length === 0 ? (
              <p className={styles.emptyMessage}>No products added yet.</p>
            ) : (
              products.map((product, index) => (
                <div key={index} className={styles.productItem}>
                  <div className={styles.productHeader}>
                    <span className={styles.productName}>{product.name}</span>
                    <span className={styles.productPrice}>${product.price}</span>
                    {product.featured && (
                      <span style={{ marginLeft: '10px', color: '#3498db', fontWeight: 600, fontSize: '0.95em' }}>
                        ⭐ Featured in Hero
                      </span>
                    )}
                  </div>
                  {product.image && (
                    <img src={product.image} alt={product.name} style={{ maxWidth: '100px', margin: '8px 0' }} />
                  )}
                  {product.description && (
                    <div className={styles.productDescription}>
                      {product.description}
                    </div>
                  )}
                  <div className={styles.productActions}>
                    <button
                      className={styles.btn + ' ' + styles.btnSecondary}
                      onClick={() => editProduct(index)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className={styles.btn + ' ' + styles.btnDanger}
                      onClick={() => deleteProduct(index)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;