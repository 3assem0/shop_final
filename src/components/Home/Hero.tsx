/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, X } from 'lucide-react';
// import CurvedLoop from '../CurvedLoop'; // Uncomment if needed

interface Product {
  id?: string | number;
  discount?: string;
  title: string;
  description?: string;
  image?: string;
  buttonText?: string;
  price?: string | number;
  oldPrice?: string | number;
  featured?: boolean;
  category?: string;
  rating?: number;
  reviewCount?: number;
  color?: string;
  colorHex?: string;
}

// Helper: format price
const formatPrice = (price: any) => {
  if (!price) return '';
  return `$${parseFloat(price).toFixed(2)}`;
};

// Helper: render stars
const renderStars = (rating = 0) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <svg
        key={i}
        className={`w-4 h-4 sm:w-5 sm:h-5 ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
      </svg>
    );
  }
  return stars;
};

export default function Hero() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Slider states
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Fetch featured products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/api/get-products');
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();

        const heroProducts = (data.products || [])
          .filter((p: any) => p.featured)
          .map((p: any) => ({
            id: p.id,
            discount: p.discount || '',
            title: p.title || p.name || '',
            description: p.description || '',
            image: p.image || p.imageSrc || '/Classic_T-shirt.webp',
            buttonText: p.buttonText || 'Shop Now',
            price: p.price,
            oldPrice: p.oldPrice,
            featured: !!p.featured,
            category: p.category,
            rating: p.rating,
            reviewCount: p.reviewCount,
            color: p.color,
            colorHex: p.colorHex,
          }));

        setProducts(heroProducts);
      } catch (err: any) {
        setError(err.message || 'Error loading products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Swipe handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (containerRef.current?.offsetLeft || 0));
    setDragOffset(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const x = e.pageX - (containerRef.current?.offsetLeft || 0);
    setDragOffset(x - startX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (Math.abs(dragOffset) > 50) {
      if (dragOffset < 0) {
        setCurrentSlide((prev) => (prev + 1) % products.length);
      } else {
        setCurrentSlide((prev) => (prev - 1 + products.length) % products.length);
      }
    }
    setDragOffset(0);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setDragOffset(e.touches[0].clientX - startX);
  };

  const handleTouchEnd = () => {
    handleMouseUp();
  };

  const handleDotClick = (i: number) => setCurrentSlide(i);

  const handleOpenModal = (p: Product) => {
    setSelectedProduct(p);
    setModalOpen(true);
  };

  const addToCart = (p: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`Added ${p.title} to cart!`);
  };

  // State UI
  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!products.length) return <div className="text-center py-10">No featured products</div>;

  const currentProduct = products[currentSlide];

  return (
    <div className="relative px-[5%] sm:px-[10%] md:px-[8%] pt-7 bg-transparent">
      <div className="grid lg:grid-cols-2 gap-6 h-auto lg:h-[500px]">
        {/* Left - Featured Product */}
        <div
          ref={containerRef}
          className="bg-white rounded-3xl p-8 shadow-lg flex flex-col lg:flex-row items-center gap-8 overflow-hidden cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Info */}
          <div className="flex-1 space-y-4">
            {currentProduct.category && (
              <span className="inline-block bg-pink-100 text-pink-800 text-xs font-medium px-2 py-1 rounded-full mb-1">
                {currentProduct.category}
              </span>
            )}
            <h2 className="text-3xl font-bold text-gray-900">{currentProduct.title}</h2>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-gray-900">{formatPrice(currentProduct.price)}</span>
            </div>
            <p className="text-gray-500 text-sm">{currentProduct.description}</p>
            <div className="flex items-center justify-between pt-6">
              <button
                onClick={() => handleOpenModal(currentProduct)}
                className="bg-pink-800 text-white py-3 px-8 rounded-xl font-medium hover:bg-pink-600 transition"
              >
                Shop Now
              </button>
              <div className="flex space-x-2">
                {products.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handleDotClick(i)}
                    className={`w-3 h-3 rounded-full ${i === currentSlide ? 'bg-pink-800' : 'bg-gray-300'}`}
                  />
                ))}
              </div>
            </div>
          </div>
          {/* Image */}
          <div className="flex-1 flex justify-center">
            <img src={currentProduct.image} alt={currentProduct.title} className="w-full max-w-[300px]" />
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && selectedProduct && (
        <div
          id="modal-backdrop"
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-8"
          onClick={() => setModalOpen(false)}
        >
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-pink-800 bg-pink-100 p-2 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
            <img src={selectedProduct.image} alt={selectedProduct.title} className="w-full h-64 object-contain" />
            <h2 className="text-xl font-bold mt-4">{selectedProduct.title}</h2>
            <p className="text-gray-600">{selectedProduct.description}</p>
            <div className="flex items-center gap-2 mt-2">{renderStars(selectedProduct.rating)}</div>
            <div className="flex items-center justify-between mt-4">
              <span className="text-2xl font-bold">{formatPrice(selectedProduct.price)}</span>
              <button
                onClick={(e) => addToCart(selectedProduct, e)}
                className="bg-pink-800 text-white py-2 px-4 rounded-lg flex items-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" /> Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
