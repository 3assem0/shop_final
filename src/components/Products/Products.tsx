import React, { useState, useMemo, useEffect } from 'react';
import { getCart, setCart } from '../../lib/cart';
import { Star, ShoppingCart, Eye, X, Filter, ChevronDown } from 'lucide-react';
import ProductGrid from '../Skiliton/ProductGrid';

interface Product {
  name: string;
  description: string;
  price: string;
  id?: number;
  image?: string;
  imageAlt?: string;
  color?: string;
  colorHex?: string;
  rating?: number;
  reviewCount?: number;
  category?: string;
}

type CartItem = Product & { quantity: number };

interface Filters {
  category: string;
  priceRange: [number, number];
  minRating: number;
  colors: string[];
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [filters, setFilters] = useState<Filters>({
    category: '',
    priceRange: [0, 1000],
    minRating: 0,
    colors: []
  });

  React.useEffect(() => {
    setLoading(true);
    fetch('/api/get-products')
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.products)) {
          setProducts(data.products);
          // Auto-adjust price range based on actual product prices
          const prices = data.products.map((p: Product) => parseFloat(p.price));
          const maxPrice = Math.max(...prices);
          setFilters(prev => ({ ...prev, priceRange: [0, Math.ceil(maxPrice)] }));
        } else {
          setError('Failed to load products.');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load products.');
        setLoading(false);
      });
  }, []);
// Add this useEffect to your component to prevent body scroll when modal is open

useEffect(() => {
  if (modalOpen) {
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    // For iOS Safari
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
  } else {
    // Restore body scroll
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
  }

  // Cleanup function
  return () => {
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
  };
}, [modalOpen]);
  // Get unique values for filter options
  const filterOptions = useMemo(() => {
    const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
    const colors = [...new Set(products.map(p => p.color).filter(Boolean))];
    return { categories, colors };
  }, [products]);

  // Filter products based on current filters
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Category filter
      if (filters.category && product.category !== filters.category) {
        return false;
      }

      // Price filter
      const price = parseFloat(product.price);
      if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
        return false;
      }

      // Rating filter
      if (product.rating && product.rating < filters.minRating) {
        return false;
      }

      // Color filter
      if (filters.colors.length > 0 && product.color && !filters.colors.includes(product.color)) {
        return false;
      }

      return true;
    });
  }, [products, filters]);

  const addToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    let cart = getCart();
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      cart = cart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      cart.push({ ...product, id: product.id ?? Date.now(), quantity: 1 });
    }
    setCart(cart);
    const badge = document.getElementById('cart-badge');
    if (badge) {
      badge.textContent = cart.reduce((sum, item) => sum + (item.quantity || 1), 0).toString();
    }
  };

  const quickView = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const formatPrice = (price: string) => {
    return parseFloat(price).toLocaleString('en-EG', {
      style: 'currency',
      currency: 'EGP',
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'fill-yellow-400 text-yellow-400'
            : i < rating
            ? 'fill-yellow-400/50 text-yellow-400'
            : 'fill-gray-200 text-gray-200'
        }`}
      />
    ));
  };
  
  const handleModalClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).id === "modal-backdrop") {
      setModalOpen(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      priceRange: [0, Math.max(...products.map(p => parseFloat(p.price))) || 1000],
      minRating: 0,
      colors: []
    });
  };

  const handleColorFilter = (color: string) => {
    setFilters(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color]
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <ProductGrid />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600">{error}</h2>
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#a23891] mb-4">
            Our Products
          </h1>
          <p className="text-lg text-[#fb6f92] max-w-2xl mx-auto">
            Curated collection of premium products that our customers love
          </p>
        </div>

        {/* Filter Toggle Button - Mobile */}
        <div className="mb-6 flex justify-between text-[#fb6f92] items-center sticky top-4 bg-white/90 backdrop-blur-sm py-4 z-30 -mx-4 px-4 border-b border-gray-100 rounded-lg shadow-sm">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm border hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span className='text-[#fb6f92]'>Filters</span>
            <ChevronDown className={`w-4 h-4 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          
          <div className="text-sm text-[#fb6f92] font-medium">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-[#a23891]">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-[#fb6f92] font-medium transition-colors"
                >
                  Clear All
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-[#fb6f92] mb-3">Category</h4>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-3 border border-gray-200 rounded-lg text-[#831670] focus:ring-2 focus:ring-[#831670] focus:border-transparent transition-all"
                >
                  <option value="">All Categories</option>
                  {filterOptions.categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-[#fb6f92] mb-3">Price Range</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.priceRange[0]}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        priceRange: [parseInt(e.target.value) || 0, prev.priceRange[1]]
                      }))}
                      className="w-full p-3 border border-gray-200 rounded-lg text-[#831670] focus:ring-2 focus:ring-[#831670] focus:border-transparent transition-all"
                    />
                    <span className="text-[#fb6f92] font-medium">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.priceRange[1]}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        priceRange: [prev.priceRange[0], parseInt(e.target.value) || 1000]
                      }))}
                      className="w-full p-3 border border-gray-200 rounded-lg text-[#831670] focus:ring-2 focus:ring-[#831670] focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="text-sm text-[#831670] bg-gray-50 p-2 rounded-lg">
                    {formatPrice(filters.priceRange[0].toString())} - {formatPrice(filters.priceRange[1].toString())}
                  </div>
                </div>
              </div>

              {/* Rating Filter */}
              {/* <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Minimum Rating</h4>
                <div className="space-y-2">
                  {[4, 3, 2, 1, 0].map(rating => (
                    <label key={rating} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                      <input
                        type="radio"
                        name="rating"
                        value={rating}
                        checked={filters.minRating === rating}
                        onChange={(e) => setFilters(prev => ({ ...prev, minRating: parseInt(e.target.value) }))}
                        className="text-[#831670] focus:ring-[#831670]"
                      />
                      <div className="flex items-center space-x-1">
                        <div className="flex">
                          {renderStars(rating || 0.1)}
                        </div>
                        <span className="text-sm text-gray-600">
                          {rating === 0 ? 'All ratings' : `${rating}+ stars`}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div> */}

              {/* Color Filter */}
              {filterOptions.colors.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium text-[#fb6f92] mb-3">Colors</h4>
                  <div className="space-y-2">
                    {filterOptions.colors.map(color => (
                      <label key={color} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                        <input
                          type="checkbox"
                          checked={filters.colors.includes(color)}
                          onChange={() => handleColorFilter(color)}
                          className="text-[#831670] focus:ring-[#831670] rounded"
                        />
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-4 h-4 rounded-full border border-[#831670] shadow-sm"
                            style={{ 
                              backgroundColor: products.find(p => p.color === color)?.colorHex || '#ccc'
                            }}
                          />
                          <span className="text-sm text-gray-700">{color}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <Filter className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters to see more products.</p>
                <button
                  onClick={clearFilters}
                  className="bg-[#831670] text-white px-6 py-2 rounded-lg hover:bg-[#a23891] transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 
                               overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 
                               cursor-pointer flex flex-col"
                    onClick={() => quickView(product, {} as React.MouseEvent)}
                  >
                    {/* Image Container */}
                    <div className="relative aspect-square overflow-hidden bg-transparent">
                      <img
                        src={
                          product.image && product.image.includes('cloudinary.com')
                            ? product.image
                            : '/public/logo.png'
                        }
                        alt={product.imageAlt || product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/public/logo.png'
                        }}
                      />

                      {/* Category Badge */}
                      <div className="absolute top-3 right-3">
                        <div className="bg-[#fee0f9] backdrop-blur-sm text-[#831670] text-xs font-medium px-2 py-1 rounded-full">
                          {product.category}
                        </div>
                      </div>

                      {/* Quick View Button */}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <button
                          onClick={(e) => quickView(product, e)}
                          className="bg-white text-gray-900 p-3 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                          title="Quick View"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-4 flex-1">
                      <div className="mb-2">
                        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {product.name}
                        </h3>
                      </div>

                      {/* Color */}
                      {product.color && (
                        <div className="flex items-center space-x-2 mb-3">
                          <div
                            className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: product.colorHex }}
                          />
                          <span className="text-xs text-gray-500">{product.color}</span>
                        </div>
                      )}

                      {/* Rating */}
                      <div className="flex items-center space-x-1 mb-3">
                        <div className="flex">{renderStars(product.rating || 4)}</div>
                        <span className="text-xs text-gray-500">({product.reviewCount})</span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-baseline space-x-2">
                          <span className="text-lg font-bold text-gray-900">
                            {formatPrice(product.price)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <div className="p-3 mt-auto">
                      <button
                        onClick={(e) => addToCart(product, e)}
                        className="w-full bg-[#fee0f9] text-[#831670] py-2 px-4 rounded-lg hover:bg-[#f4b8ea] active:scale-[0.98] transform transition-all duration-200 flex items-center justify-center space-x-2 font-medium"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick View Modal */}
{modalOpen && selectedProduct && (
  <div 
    id="modal-backdrop"
    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-8 overflow-scroll"
    onClick={handleModalClick}
  >
    <div className="bg-white rounded-xl sm:rounded-2xl w-full max-w-sm sm:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-scroll shadow-2xl flex flex-col ">
      {/* Mobile: Stack vertically with scrollable content */}
      <div className="flex flex-col sm:flex-row h-full">
        {/* Product Image */}
        <div className="sm:w-1/2 flex-shrink-0">
          <div className="relative aspect-square sm:h-full">
            <img
              src={selectedProduct.image && selectedProduct.image.includes('cloudinary.com') ? selectedProduct.image : '/public/logo.png'}
              alt={selectedProduct.name}
              className="w-full h-full object-cover"
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/public/logo.png'; }}
            />
          </div>
        </div>

        {/* Product Details - Scrollable on mobile */}
        <div className="sm:w-1/2 flex flex-col relative min-h-0">
          <button
            onClick={() => setModalOpen(false)}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 text-[#fee0f9] bg-[#831670] backdrop-blur-sm p-1.5 sm:p-2 rounded-full hover:bg-[#bb32a4] transition-colors z-10"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-[#fee0f9]" />
          </button>
          
          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8">
            <div className="mb-4">
              <span className="inline-block bg-[#fee0f9] text-[#831670] text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 rounded-full mb-3">
                {selectedProduct.category}
              </span>
              <h2 className="text-xl sm:text-3xl font-bold text-gray-900 mb-2">
                {selectedProduct.name}
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mb-4">{selectedProduct.description}</p>
            </div>

            {/* Color */}
            {selectedProduct.color && (
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-xs sm:text-sm font-medium text-gray-700">Color:</span>
                <div className="flex items-center space-x-2">
                  <div
                    className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-white shadow-lg"
                    style={{ backgroundColor: selectedProduct.colorHex }}
                  />
                  <span className="text-xs sm:text-sm text-gray-600">{selectedProduct.color}</span>
                </div>
              </div>
            )}

            {/* Rating */}
            <div className="flex items-center space-x-2 mb-6">
              <div className="flex">
                {renderStars(selectedProduct.rating || 4)}
              </div>
              <span className="text-xs sm:text-sm text-gray-500">
                ({selectedProduct.reviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline space-x-3 mb-6">
              <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                {formatPrice(selectedProduct.price)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex-shrink-0 p-4 sm:p-6 sm:border-t-0">
            <button
              onClick={(e) => {
                addToCart(selectedProduct, e);
                setModalOpen(false);
              }}
              className="w-full bg-[#fee0f9] text-[#831670] py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-[#f4b8ea] active:scale-[0.98] transform transition-all duration-200 flex items-center justify-center space-x-2 font-medium text-sm sm:text-base"
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
      </div>
    </div>
  );
};

export default Products;