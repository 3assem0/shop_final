/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, ShoppingCart, Star } from 'lucide-react';

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
  rating?: number;
}

export default function Hero() {
  // State management
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Data management
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch products from API
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
            rating: p.rating || 4.5, // Default rating if not provided
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

  const currentProduct = products.length > 0 ? products[currentSlide % products.length] : null;
  const featured = products.slice(0, 3);

  // Auto-play functionality
  const startAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    if (products.length > 1) {
      autoPlayRef.current = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % products.length);
      }, 4000);
    }
  }, [products.length]);

  const stopAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isAutoPlaying && !isDragging && products.length > 1) {
      startAutoPlay();
    } else {
      stopAutoPlay();
    }
    return () => stopAutoPlay();
  }, [isAutoPlaying, isDragging, products.length, startAutoPlay, stopAutoPlay]);

  // Navigation functions
  const goToSlide = useCallback((index: number) => {
    if (isTransitioning || products.length === 0) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 300);
  }, [isTransitioning, products.length]);

  const goToNext = useCallback(() => {
    if (products.length === 0) return;
    goToSlide((currentSlide + 1) % products.length);
  }, [currentSlide, products.length, goToSlide]);

  const goToPrev = useCallback(() => {
    if (products.length === 0) return;
    goToSlide((currentSlide - 1 + products.length) % products.length);
  }, [currentSlide, products.length, goToSlide]);

  // Dot click handler
  const handleDotClick = useCallback((index: number) => {
    goToSlide(index);
    setIsAutoPlaying(false);
    
    // Resume auto-play after 8 seconds of inactivity
    setTimeout(() => {
      setIsAutoPlaying(true);
    }, 8000);
  }, [goToSlide]);

  // Enhanced drag handling
  const handleStart = useCallback((clientX: number) => {
    setIsDragging(true);
    setDragStart(clientX);
    setDragOffset(0);
    setIsAutoPlaying(false);
  }, []);

  const handleMove = useCallback((clientX: number) => {
    if (!isDragging) return;
    const offset = clientX - dragStart;
    setDragOffset(offset);
  }, [isDragging, dragStart]);

  const handleEnd = useCallback(() => {
    if (!isDragging) return;
    
    const threshold = 100;
    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset > 0) {
        goToPrev();
      } else {
        goToNext();
      }
    }
    
    setIsDragging(false);
    setDragOffset(0);
    
    // Resume auto-play after 6 seconds
    setTimeout(() => {
      setIsAutoPlaying(true);
    }, 6000);
  }, [isDragging, dragOffset, goToPrev, goToNext]);

  // Mouse events
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX);
  }, [handleStart]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    handleMove(e.clientX);
  }, [handleMove]);

  const handleMouseUp = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  const handleMouseEnter = useCallback(() => {
    if (!isDragging) {
      setIsAutoPlaying(false);
    }
  }, [isDragging]);

  const handleMouseLeave = useCallback(() => {
    if (!isDragging) {
      setIsAutoPlaying(true);
    }
  }, [isDragging]);

  // Touch events
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX);
  }, [handleStart]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    handleMove(e.touches[0].clientX);
  }, [handleMove]);

  const handleTouchEnd = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrev();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsAutoPlaying(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [goToPrev, goToNext]);

  const StarRating = ({ rating }: { rating?: number }) => {
    if (!rating) return null;
    
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={`${
              i < Math.floor(rating) 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">({rating})</span>
      </div>
    );
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="relative px-[5%] sm:px-[10%] md:px-[8%] pt-7 bg-transparent dark:bg-black w-full">
        <div className="grid lg:grid-cols-2 gap-6 h-auto lg:h-[500px] w-full">
          {/* Left Column - Large Skeleton */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl animate-pulse p-8 shadow-lg flex flex-col lg:flex-row items-center gap-8 overflow-hidden select-none w-full h-full min-h-[300px]">
            <div className="flex-1 space-y-6 w-full">
              <div className="inline-block w-full">
                <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                <div className="text-gray-400 flex gap-2">
                  <div className="h-4 w-10 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-4 w-10 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              </div>
              <div className="w-full">
                <div className="h-8 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
                <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
              <div className="h-10 w-32 bg-gray-300 dark:bg-gray-600 rounded-xl mt-4" />
              <div className="flex items-center justify-between pt-4 w-full">
                <div className="flex space-x-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600" />
                  ))}
                </div>
                <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
              <div className="h-4 w-32 bg-gray-100 dark:bg-gray-700 rounded mt-2" />
            </div>
            <div className="flex-1 flex justify-center items-center w-full">
              <div className="w-full max-w-[300px] h-[180px] bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </div>
          
          {/* Right Column - Two Skeleton Cards */}
          <div className="flex flex-col gap-6 w-full h-full">
            {[...Array(2)].map((_, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg flex items-center gap-6 flex-1 animate-pulse w-full h-full min-h-[120px]">
                <div className="flex-1 w-full">
                  <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                  <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-5 w-12 bg-gray-100 dark:bg-gray-600 rounded" />
                  </div>
                </div>
                <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500 dark:text-red-400">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="text-center text-gray-900 dark:text-gray-100 py-12">
        No featured products available.
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="text-center text-gray-900 dark:text-gray-100 py-12">
        No products available.
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="relative px-[5%] sm:px-[10%] md:px-[8%] pt-7 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black min-h-screen">
        <div className="grid lg:grid-cols-2 gap-6 h-auto lg:h-[500px]">
          {/* Left Column - Enhanced Featured Product */}
          <div 
            ref={containerRef}
            className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col lg:flex-row items-center gap-8 overflow-hidden cursor-grab active:cursor-grabbing select-none border border-gray-100 dark:border-gray-700"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              transform: isDragging ? `translateX(${dragOffset * 0.3}px) scale(0.98)` : 'none',
              transition: isDragging ? 'none' : 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            role="region"
            aria-label="Featured product carousel"
          >
            <div className="flex-1 space-y-6 pointer-events-auto">
              {/* Sale Badge & Discount */}
              <div className="flex items-start gap-4 mb-4">
                {currentProduct.discount && (
                  <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full">
                    <span className="text-2xl font-bold">{currentProduct.discount}</span>
                    <span className="text-sm ml-1">OFF</span>
                  </div>
                )}
                <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Sale
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white transition-all duration-500">
                  {currentProduct.title}
                </h2>
                
                <StarRating rating={currentProduct.rating} />
                
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed transition-all duration-500">
                  {currentProduct.description}
                </p>
                
                {/* Price & Old Price */}
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-red-500">{currentProduct.price}</span>
                  {currentProduct.oldPrice && (
                    <span className="text-lg text-gray-400 line-through">{currentProduct.oldPrice}</span>
                  )}
                </div>
              </div>

              {/* Enhanced Shop Button */}
              <button 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg pointer-events-auto flex items-center gap-2 group"
                onMouseDown={(e) => e.stopPropagation()}
                aria-label={`${currentProduct.buttonText} - ${currentProduct.title}`}
              >
                <ShoppingCart size={20} className="group-hover:animate-bounce" />
                {currentProduct.buttonText}
              </button>

              {/* Product ID */}
              {currentProduct.id && (
                <div className="text-xs text-gray-400">ID: {currentProduct.id}</div>
              )}

              {/* Enhanced Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
                {/* Navigation arrows */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={goToPrev}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors pointer-events-auto"
                    aria-label="Previous product"
                    disabled={products.length <= 1}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  
                  <div className="flex space-x-2 mx-4">
                    {products.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handleDotClick(index)}
                        onMouseDown={(e) => e.stopPropagation()}
                        className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-110 pointer-events-auto ${
                          index === currentSlide 
                            ? 'bg-blue-500 scale-110 shadow-lg' 
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                  
                  <button
                    onClick={goToNext}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors pointer-events-auto"
                    aria-label="Next product"
                    disabled={products.length <= 1}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>

                {/* Auto-play control */}
                {products.length > 1 && (
                  <button
                    onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors pointer-events-auto p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    aria-label={isAutoPlaying ? 'Pause slideshow' : 'Play slideshow'}
                  >
                    {isAutoPlaying ? <Pause size={14} /> : <Play size={14} />}
                    <span>{isAutoPlaying ? 'Pause' : 'Play'}</span>
                  </button>
                )}
              </div>

              {/* Enhanced Drag hint */}
              <div className="text-xs text-gray-400 opacity-70 flex items-center gap-1">
                <span>💡</span>
                <span>Drag, use arrows, or press space to control</span>
              </div>
            </div>

            {/* Enhanced Product Image */}
            <div className="flex-1 flex justify-center relative">
              <div className="relative group">
                <img 
                  src={currentProduct.image}
                  alt={currentProduct.title}
                  className="w-full max-w-[300px] h-auto object-contain transition-all duration-500 transform hover:scale-105 pointer-events-none rounded-xl"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              </div>
            </div>
          </div>

          {/* Right Column - Enhanced Product Cards */}
          <div className="flex flex-col gap-6">
            {featured.slice(1).map((product, idx) => (
              <div 
                key={product.id || idx} 
                className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-6 flex-1 border border-gray-100 dark:border-gray-700 group cursor-pointer"
              >
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
                    {product.title}
                  </h3>
                  <StarRating rating={product.rating} />
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 mt-2">{product.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-red-500">{product.price}</span>
                    {product.oldPrice && (
                      <span className="text-sm text-gray-400 line-through">{product.oldPrice}</span>
                    )}
                  </div>
                </div>
                <div className="w-24 h-24 relative">
                  <img 
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110 rounded-lg"
                  />
                  <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}