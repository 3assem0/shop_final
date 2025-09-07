import React, { useState } from 'react';
import { Star, ShoppingCart, Eye, Heart, Zap } from 'lucide-react';

interface Product {
  name: string;
  description: string;
  price: string;
  id?: number;
  imageSrc?: string;
  imageAlt?: string;
  color?: string;
  colorHex?: string;
  rating?: number;
  reviewCount?: number;
  category?: string;
  oldPrice?: string;
}

const ProductLoadingSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {[...Array(8)].map((_, i) => (
      <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="aspect-square bg-gray-200 animate-pulse"></div>
        <div className="p-4 space-y-3">
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
          <div className="flex justify-between items-center">
            <div className="h-5 bg-gray-200 rounded w-16 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-8 animate-pulse"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  React.useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('/api/get-products')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load products');
        return res.json();
      })
      .then(data => {
        setProducts(data.products || []);
      })
      .catch(err => {
        setError(err.message || 'Failed to load products');
      })
      .finally(() => setLoading(false));
  }, []);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const addToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    // Add to cart logic here
    console.log('Added to cart:', product);
  };

  const quickView = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const formatPrice = (price: string) => {
    return parseFloat(price).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <ProductLoadingSkeleton />
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Amazing Products
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Curated collection of premium products that our customers love
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              onClick={() => quickView(product, {} as React.MouseEvent)}
            >
              {/* Image Container */}
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <img
                  src={product.imageSrc}
                  alt={product.imageAlt || product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Category Badge */}
                <div className="absolute top-3 right-3">
                  <div className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
                    {product.category}
                  </div>
                </div>

                {/* Hover Actions */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => quickView(product, e)}
                      className="bg-white text-gray-900 p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                      title="Quick View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => addToCart(product, e)}
                      className="bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                      title="Add to Cart"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
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
                  <div className="flex">
                    {renderStars(product.rating || 4)}
                  </div>
                  <span className="text-xs text-gray-500">
                    ({product.reviewCount})
                  </span>
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

              {/* Bottom Action Bar */}
              <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <button
                  onClick={(e) => addToCart(product, e)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 active:scale-[0.98] transform transition-all duration-200 flex items-center justify-center space-x-2 font-medium"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="bg-white text-gray-900 px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-shadow border border-gray-200 font-medium">
            Load More Products
          </button>
        </div>
      </div>

      {/* Quick View Modal */}
      {modalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="flex flex-col md:flex-row">
              {/* Product Image */}
              <div className="md:w-1/2">
                <div className="relative aspect-square">
                  <img
                    src={selectedProduct.imageSrc}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setModalOpen(false)}
                    className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Product Details */}
              <div className="md:w-1/2 p-8 flex flex-col justify-center">
                <div className="mb-4">
                  <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full mb-3">
                    {selectedProduct.category}
                  </span>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {selectedProduct.name}
                  </h2>
                  <p className="text-gray-600 mb-4">{selectedProduct.description}</p>
                </div>

                {/* Color */}
                {selectedProduct.color && (
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="text-sm font-medium text-gray-700">Color:</span>
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-6 h-6 rounded-full border-2 border-white shadow-lg"
                        style={{ backgroundColor: selectedProduct.colorHex }}
                      />
                      <span className="text-sm text-gray-600">{selectedProduct.color}</span>
                    </div>
                  </div>
                )}

                {/* Rating */}
                <div className="flex items-center space-x-2 mb-6">
                  <div className="flex">
                    {renderStars(selectedProduct.rating || 4)}
                  </div>
                  <span className="text-sm text-gray-500">
                    ({selectedProduct.reviewCount} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-baseline space-x-3 mb-6">
                  <span className="text-3xl font-bold text-gray-900">
                    {formatPrice(selectedProduct.price)}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <button
                    onClick={(e) => {
                      addToCart(selectedProduct, e);
                      setModalOpen(false);
                    }}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 active:scale-[0.98] transform transition-all duration-200 flex items-center justify-center space-x-2 font-medium"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;