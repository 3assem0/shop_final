/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from 'react'

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
}
export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const containerRef = useRef(null);
  const autoPlayRef = useRef(null);
  // Add missing state for products, loading, error
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/get-products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        // Map to Hero format and filter featured
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

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && !isDragging) {
      autoPlayRef.current = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % products.length);
      }, 4000); // Change slide every 4 seconds
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, isDragging, products.length]);

  const handleDotClick = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false); // Pause auto-play when user manually selects
    
    // Resume auto-play after 8 seconds of inactivity
    setTimeout(() => {
      setIsAutoPlaying(true);
    }, 8000);
  };

  // Mouse drag handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart(e.clientX);
    setIsAutoPlaying(false);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const currentX = e.clientX;
    const offset = currentX - dragStart;
    setDragOffset(offset);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;

    const threshold = 100; // Minimum drag distance to trigger slide change
    
    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset > 0) {
        // Dragged right - go to previous slide
        setCurrentSlide(prev => prev === 0 ? products.length - 1 : prev - 1);
      } else {
        // Dragged left - go to next slide
        setCurrentSlide(prev => (prev + 1) % products.length);
      }
    }

    setIsDragging(false);
    setDragOffset(0);
    
    // Resume auto-play after 6 seconds
    setTimeout(() => {
      setIsAutoPlaying(true);
    }, 6000);
  };

  // Touch drag handlers for mobile
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setDragStart(e.touches[0].clientX);
    setIsAutoPlaying(false);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    
    const currentX = e.touches[0].clientX;
    const offset = currentX - dragStart;
    setDragOffset(offset);
  };

  const handleTouchEnd = () => {
    handleMouseUp(); // Reuse mouse up logic
  };

  // Pause auto-play on hover
  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
  };

  const handleMouseLeave = () => {
    if (!isDragging) {
      setIsAutoPlaying(true);
    }
  };

  const currentProduct = products.length > 0 ? products[currentSlide % products.length] : null;
  // Only use up to 3 featured products
  const featured = products.slice(0, 3);

  if (loading) {
    // Skeleton loader for hero grid
    return (
    <div className="relative px-[5%] sm:px-[10%] md:px-[8%] pt-7 bg-transparent dark:bg-black w-full">
        <div className="grid lg:grid-cols-2 gap-6 h-auto lg:h-[500px] w-full">
          {/* Left Column - Large Skeleton */}
          <div className="bg-white rounded-3xl animate-fade-in p-8 shadow-lg flex flex-col lg:flex-row items-center gap-8  overflow-hidden select-none w-full h-full min-h-[300px]">
            <div className="flex-1 space-y-6 w-full">
              <div className="inline-block w-full">
                <div className="h-10 w-24 bg-gray-200 rounded mb-2" />
                <div className="text-gray-400 flex gap-2">
                  <div className="h-4 w-10 bg-gray-200 rounded" />
                  <div className="h-4 w-10 bg-gray-200 rounded" />
                </div>
              </div>
              <div className="w-full">
                <div className="h-8 w-40 bg-gray-200 rounded mb-3" />
                <div className="h-4 w-64 bg-gray-200 rounded mb-2" />
                <div className="h-4 w-48 bg-gray-200 rounded" />
              </div>
              <div className="h-10 w-32 bg-gray-300 rounded-xl mt-4" />
              <div className="flex items-center justify-between pt-4 w-full">
                <div className="flex space-x-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-3 h-3 rounded-full bg-gray-300" />
                  ))}
                </div>
                <div className="h-4 w-16 bg-gray-200 rounded" />
              </div>
              <div className="h-4 w-32 bg-gray-100 rounded mt-2" />
            </div>
            <div className="flex-1 flex justify-center items-center w-full">
              <div className="w-full max-w-[300px] h-[180px] bg-gray-200 rounded" />
            </div>
          </div>
          {/* Right Column - Two Skeleton Cards */}
          <div className="flex flex-col gap-6 w-full h-full">
            {[...Array(2)].map((_, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-6 shadow-lg flex items-center gap-6 flex-1 animate-fade-in w-full h-full min-h-[120px]">
                <div className="flex-1 w-full">
                  <div className="h-6 w-32 bg-gray-200 rounded mb-2" />
                  <div className="h-4 w-40 bg-gray-200 rounded mb-4" />
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-16 bg-gray-200 rounded" />
                    <div className="h-5 w-12 bg-gray-100 rounded" />
                  </div>
                </div>
                <div className="w-24 h-24 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }
  if (!products.length) {
    return <div className="text-center text-black py-12">No featured products available.</div>;
  }
  if (!currentProduct) {
    return <div className="text-center text-black py-12">No products available.</div>;
  }

  return (
    <div className='relative'>
      <div className="relative px-[5%] sm:px-[10%] md:px-[8%] pt-7 bg-transparent dark:bg-black">
        <div className="grid lg:grid-cols-2 gap-6 h-auto lg:h-[500px]">
          {/* Left Column - Large Featured Product with Swap */}
          <div 
            ref={containerRef}
            className="bg-white rounded-3xl p-8 shadow-lg flex flex-col lg:flex-row items-center gap-8 overflow-hidden cursor-grab active:cursor-grabbing select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              transform: isDragging ? `translateX(${dragOffset * 0.3}px)` : 'none',
              transition: isDragging ? 'none' : 'transform 0.3s ease-out'
            }}
          >
            <div className="flex-1 space-y-6 pointer-events-auto">
              {/* Sale Badge & Discount */}
              <div className="inline-block mb-2">
                {currentProduct.discount && (
                  <span className="text-5xl font-bold text-blue-600 transition-all duration-500 mr-2">
                    {currentProduct.discount}
                  </span>
                )}
                <div className="text-gray-600">
                  <div className="text-sm">Sale</div>
                  <div className="text-sm">Off</div>
                </div>
              </div>
              {/* Product Info */}
              <div className="mb-2">
                <h2 className="text-3xl font-bold text-gray-900 mb-3 transition-all duration-500">
                  {currentProduct.title}
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed transition-all duration-500 mb-2">
                  {currentProduct.description}
                </p>
                {/* Price & Old Price */}
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl font-bold text-red-500">{currentProduct.price}</span>
                  {currentProduct.oldPrice && (
                    <span className="text-lg text-gray-400 line-through">{currentProduct.oldPrice}</span>
                  )}
                </div>
              </div>
              {/* Shop Button */}
              <button 
                className="bg-gray-900 text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 pointer-events-auto mb-2"
                onMouseDown={(e) => e.stopPropagation()}
              >
                {currentProduct.buttonText}
              </button>
              {/* Product ID */}
              {currentProduct.id && (
                <div className="text-xs text-gray-400 mb-2">ID: {currentProduct.id}</div>
              )}
              {/* Auto-play indicator and Controls */}
              <div className="flex items-center justify-between pt-4">
                <div className="flex space-x-2">
                  {products.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleDotClick(index)}
                      onMouseDown={(e) => e.stopPropagation()}
                      className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-110 pointer-events-auto ${
                        index === currentSlide 
                          ? 'bg-blue-500 scale-110' 
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
                {/* Auto-play control */}
                <button
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="text-xs text-gray-500 hover:text-gray-700 transition-colors pointer-events-auto flex items-center gap-1"
                >
                  {isAutoPlaying ? (
                    <></>
                  ) : (
                    <></>
                  )}
                </button>
              </div>
              {/* Drag hint */}
              <div className="text-xs text-gray-400 opacity-70">
                💡 Drag to browse or click dots
              </div>
            </div>
            {/* Product Image */}
            <div className="flex-1 flex justify-center">
              <img 
                src={currentProduct.image}
                alt={currentProduct.title}
                className="w-full max-w-[300px] h-auto object-contain transition-all duration-500 transform hover:scale-105 pointer-events-none"
                draggable={false}
              />
            </div>
          </div>

          {/* Right Column - Two Product Cards */}
          {/* Right Column - Two Featured Product Cards */}
          <div className="flex flex-col gap-6">
            {featured.slice(1).map((product, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-6 shadow-lg flex items-center gap-6 flex-1 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {product.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4">{product.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-red-500">{product.price}</span>
                    {product.oldPrice && (
                      <span className="text-lg text-gray-400 line-through">{product.oldPrice}</span>
                    )}
                  </div>
                </div>
                <div className="w-24 h-24">
                  <img 
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-contain transition-transform duration-300 hover:scale-110"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
     
  );
};