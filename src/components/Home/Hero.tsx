/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Product } from '../../types/product';
import { normalizeProduct, formatPrice, productToCartItem, getProductDisplayName, isFeaturedProduct } from '../../lib/product-utils';
import { addToCart as addToCartLib, getCart } from '../../lib/cart';

export default function HeroCarousel(): JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Drag / swipe
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);

  // Modal (optional)
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const intervalRef = useRef<number | null>(null);
  const resumeTimeoutRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Fetch featured products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/get-products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        
        // Normalize all products and filter for featured ones
        const allProducts = (data.products || []).map(normalizeProduct);
        const featuredProducts = allProducts.filter(isFeaturedProduct);
        
        setProducts(featuredProducts);
      } catch (err: any) {
        setError(err?.message || "Error loading products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Auto-play effect
  useEffect(() => {
    // clear previous interval
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!isAutoPlaying || isDragging) return;

    if (products.length > 1) {
      intervalRef.current = window.setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % products.length);
      }, 2000); // 2s
    }

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isAutoPlaying, isDragging, products.length]);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      if (resumeTimeoutRef.current) window.clearTimeout(resumeTimeoutRef.current);
    };
  }, []);

  // Pause helpers
  const pauseAutoPlayTemporarily = () => {
    setIsAutoPlaying(false);
    if (resumeTimeoutRef.current) {
      window.clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }
  };
  const scheduleResumeAutoPlay = (delay = 6000) => {
    if (resumeTimeoutRef.current) window.clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = window.setTimeout(() => {
      setIsAutoPlaying(true);
      resumeTimeoutRef.current = null;
    }, delay);
  };

  // Swipe handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    pauseAutoPlayTemporarily();
    setStartX(e.pageX - (containerRef.current?.offsetLeft || 0));
    setDragOffset(0);
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const x = e.pageX - (containerRef.current?.offsetLeft || 0);
    setDragOffset(x - startX);
  };
  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (Math.abs(dragOffset) > 80) {
      if (dragOffset < 0) setCurrentSlide((prev) => (prev + 1) % products.length);
      else setCurrentSlide((prev) => (prev - 1 + products.length) % products.length);
    }
    setDragOffset(0);
    scheduleResumeAutoPlay();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    pauseAutoPlayTemporarily();
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

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    if (resumeTimeoutRef.current) window.clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = window.setTimeout(() => {
      setIsAutoPlaying(true);
      resumeTimeoutRef.current = null;
    }, 8000);
  };

  const handleOpenModal = (p: Product) => {
    setSelectedProduct(p);
    setModalOpen(true);
    setIsAutoPlaying(false);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
    setIsAutoPlaying(true);
  };

  if (loading) {
    return (
      <div className=" bg-gradient-to-br from-slate-50 to-blue-50 py-10 relative w-full px-[5%] sm:px-[8%] md:px-[10%]  pt-32">
              <div className="max-w-7xl mx-auto">
                 <div className="animate-fade-in"
            >
              <div className="bg-white  rounded-2xl shadow-lg border border-slate-100  overflow-hidden">
                <div className="h-80 skeleton rounded-t-2xl"></div>
                <div className="p-6 space-y-4">
                  <div className="h-6 skeleton rounded"></div>
                  <div className="h-4 skeleton rounded "></div>
                  <div className="h-4 skeleton rounded "></div>
                  <div className="h-8 skeleton rounded "></div>
                </div>
              </div>
            </div>
              </div>
            </div>
    );
  }

  if (error) {
    return <div className="w-full px-4 py-10 text-center text-red-500">{error}</div>;
  }

  if (!products.length) {
    return <div className="w-full px-4 py-10 text-center">No featured products found.</div>;
  }

  const current = products[currentSlide];

  return (
    <section className="relative w-full px-[5%] sm:px-[8%] md:px-[10%] py-10 ">
      <div
        ref={containerRef}
        className="mx-auto max-w-6xl bg-white rounded-2xl shadow-lg overflow-hidden select-none min-h-screen sm:h-auto"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={() => { handleMouseUp(); }}
        onMouseLeave={() => {
          if (isDragging) handleMouseUp();
          else setIsAutoPlaying(true);
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={() => setIsAutoPlaying(false)}
        style={{ touchAction: "pan-y" }}
      >
        {/* Big centered single card */}
        <div className="relative flex flex-col md:flex-row items-stretch md:items-center gap-6 p-8 md:p-12">
          <div
            className="flex-1"
            style={{
              transform: isDragging ? `translateX(${dragOffset * 0.08}px)` : undefined,
              transition: isDragging ? "none" : "transform 300ms ease",
            }}
          >
            {current.category && (
              <div className="inline-block bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs font-medium mb-3">
                {current.category}
              </div>
            )}

            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
              {getProductDisplayName(current)}
            </h1>

            <p className="mt-4 text-gray-600 max-w-xl">{current.description}</p>

            <div className="mt-6 flex items-center gap-4">
              <div className="text-3xl font-bold text-gray-900">{formatPrice(current.price)}</div>

              <button
                onClick={() => handleOpenModal(current)}
                className="inline-flex items-center gap-2 bg-pink-700 text-white px-5 py-3 rounded-lg font-medium shadow-sm hover:bg-pink-600 transition"
              >
                <ShoppingCart className="w-4 h-4" />
                {current.buttonText || "Shop Now"}
              </button>
            </div>
          </div>

          <div
            className="flex-1 flex justify-center items-center"
            style={{
              transform: isDragging ? `translateX(${dragOffset * -0.10}px) scale(0.99)` : undefined,
              transition: isDragging ? "none" : "transform 300ms ease",
            }}
            aria-hidden
          >
            <img
              src={current.image}
              alt={getProductDisplayName(current)}
              className="max-h-[380px] w-full object-contain"
              draggable={false}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/logo.png";
              }}
            />
          </div>
        </div>

        {/* dots */}
        <div className="flex justify-center items-center gap-2 py-4 bg-white">
          {products.map((_, i) => (
            <button
              key={i}
              onClick={() => handleDotClick(i)}
              className={`w-3 h-3 rounded-full transition-transform ${i === currentSlide ? "bg-pink-700 scale-110" : "bg-gray-300"}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* simple modal */}
      {modalOpen && selectedProduct && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-6" onClick={handleCloseModal}>
          <div className="bg-white rounded-xl max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col md:flex-row gap-4 p-6">
              <div className="md:w-1/2">
                <img
                  src={selectedProduct.image}
                  alt={getProductDisplayName(selectedProduct)}
                  className="w-full h-64 object-cover rounded-md"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/logo.png"; }}
                />
              </div>
              <div className="md:w-1/2">
                <h3 className="text-xl text-[#831670] font-bold">{getProductDisplayName(selectedProduct)}</h3>
                <p className="mt-2 text-[#fb6f92]">{selectedProduct.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-2xl text-[#09c103] font-bold">{formatPrice(selectedProduct.price)}</div>
                  <button 
                    onClick={() => {
                      const cartItem = productToCartItem(selectedProduct, 1);
                      addToCartLib(cartItem);
                      
                      // Update cart badge
                      const updatedCart = getCart();
                      const badge = document.getElementById('cart-badge');
                      if (badge) {
                        badge.textContent = updatedCart.reduce((sum, item) => sum + item.quantity, 0).toString();
                      }
                    }} 
                    className="bg-pink-700 text-white px-4 py-2 rounded-md hover:bg-pink-600 transition-colors"
                  >
                    Add to cart
                  </button>
                </div>
                <div className="p-4  text-right">
              <button onClick={handleCloseModal} className="text-sm text-gray-600 hover:underline">Close</button>
            </div>
              </div>
            </div>
            
          </div>
        </div>
      )}
    </section>
  );
}
