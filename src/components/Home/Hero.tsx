/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import { ShoppingCart, X } from "lucide-react";

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

const formatPrice = (price: any) => {
  if (price === undefined || price === null || price === "") return "";
  const n = Number(price);
  if (Number.isNaN(n)) return String(price);
  return `$${n.toFixed(2)}`;
};

const renderStars = (rating = 0) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <svg
        key={i}
        className={`w-4 h-4 sm:w-5 sm:h-5 ${i <= rating ? "text-yellow-400" : "text-gray-300"}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
      </svg>
    );
  }
  return <div className="flex items-center space-x-1">{stars}</div>;
};

export default function Hero(): JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // slider
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);

  // modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // refs for timers
  const autoRef = useRef<number | null>(null);
  const resumeTimeoutRef = useRef<number | null>(null);

  // container ref (for drag offset calculations)
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Replace with your real API call - kept same mapping as earlier code
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/get-products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();

        const heroProducts = (data.products || [])
          .filter((p: any) => p.featured)
          .map((p: any) => ({
            id: p.id,
            discount: p.discount || "",
            title: p.title || p.name || "",
            description: p.description || "",
            image: p.image || p.imageSrc || "/Classic_T-shirt.webp",
            buttonText: p.buttonText || "Shop Now",
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
        setError(err?.message || "Error loading products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // autoplay: starts/stops depending on isAutoPlaying and isDragging
  useEffect(() => {
    // clear previous
    if (autoRef.current) {
      window.clearInterval(autoRef.current);
      autoRef.current = null;
    }

    if (!isAutoPlaying || isDragging) return;

    if (products.length > 1) {
      autoRef.current = window.setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % products.length);
      }, 5000); // 5s
    }

    return () => {
      if (autoRef.current) {
        window.clearInterval(autoRef.current);
        autoRef.current = null;
      }
    };
  }, [isAutoPlaying, isDragging, products.length]);

  useEffect(() => {
    // cleanup on unmount
    return () => {
      if (autoRef.current) window.clearInterval(autoRef.current);
      if (resumeTimeoutRef.current) window.clearTimeout(resumeTimeoutRef.current);
    };
  }, []);

  // drag/swipe handlers (left big card)
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setIsAutoPlayingFalseTemporarily();
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
      if (dragOffset < 0) {
        setCurrentSlide((prev) => (prev + 1) % products.length);
      } else {
        setCurrentSlide((prev) => (prev - 1 + products.length) % products.length);
      }
    }
    setDragOffset(0);
    scheduleResumeAutoPlay();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setIsAutoPlayingFalseTemporarily();
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
    // pause autoplay and resume after 8s
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
    // pause autoplay while modal open
    setIsAutoPlaying(false);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
    // resume autoplay
    setIsAutoPlaying(true);
  };

  const addToCart = (p: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`Added ${p.title} to cart!`);
  };

  // helper that temporarily sets isAutoPlaying false when user starts interacting (drag)
  const setIsAutoPlayingFalseTemporarily = () => {
    setIsAutoPlaying(false);
    if (resumeTimeoutRef.current) {
      window.clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }
  };

  const scheduleResumeAutoPlay = () => {
    if (resumeTimeoutRef.current) window.clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = window.setTimeout(() => {
      setIsAutoPlaying(true);
      resumeTimeoutRef.current = null;
    }, 6000); // resume after 6s
  };

  // UI states
  if (loading) {
    return (
      <div className="relative px-[5%] sm:px-[10%] md:px-[8%] pt-5 w-full">
        <div className="grid lg:grid-cols-3 gap-6 h-auto lg:h-[500px] w-full">
          <div className="bg-white rounded-3xl p-8 shadow-lg h-full min-h-[300px]" />
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-2xl p-4 h-[240px]" />
            <div className="bg-white rounded-2xl p-4 h-[240px]" />
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

  // compute right small cards indices (wrap safely)
  const nextIndex = (offset: number) => (currentSlide + offset) % products.length;
  const right1 = products[nextIndex(1)];
  const right2 = products.length > 2 ? products[nextIndex(2)] : undefined;

  const currentProduct = products[currentSlide];

  return (
    <div className="relative px-[5%] sm:px-[10%] md:px-[8%] pt-7 bg-transparent">
      <div className="grid lg:grid-cols-3 gap-6 h-auto lg:h-[500px]">
        {/* Left: Big featured (spans 2 columns on large screens) */}
        <div
          ref={containerRef}
          className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-lg flex flex-col lg:flex-row items-center gap-8 overflow-hidden cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => {
            if (isDragging) handleMouseUp();
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseEnter={() => setIsAutoPlaying(false)}
        >
          {/* Info area (left column inside the card) */}
          <div
            className="flex-1 space-y-4"
            style={{
              transform: isDragging ? `translateX(${dragOffset * 0.1}px)` : undefined,
              transition: isDragging ? "none" : "transform 300ms ease-out",
            }}
          >
            {currentProduct.category && (
              <span className="inline-block bg-pink-100 text-pink-800 text-xs font-medium px-2 py-1 rounded-full mb-1">
                {currentProduct.category}
              </span>
            )}

            <h2 className="text-3xl font-bold text-gray-900">{currentProduct.title}</h2>

            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-gray-900">{formatPrice(currentProduct.price)}</span>
              {currentProduct.oldPrice && (
                <span className="text-sm line-through text-gray-400">{formatPrice(currentProduct.oldPrice)}</span>
              )}
            </div>

            <p className="text-gray-500 text-sm">{currentProduct.description}</p>

            <div className="flex items-center justify-between pt-6">
              <button
                onClick={() => handleOpenModal(currentProduct)}
                onMouseDown={(e) => e.stopPropagation()}
                className="bg-pink-800 text-white py-3 px-8 rounded-xl font-medium hover:bg-pink-600 transition"
              >
                {currentProduct.buttonText || "Shop Now"}
              </button>

              <div className="flex space-x-2">
                {products.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handleDotClick(i)}
                    className={`w-3 h-3 rounded-full ${i === currentSlide ? "bg-pink-800" : "bg-gray-300"}`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="text-xs text-gray-400 mt-2">💡 Drag to browse or click dots</div>
          </div>

          {/* Image area (right side inside the big card) */}
          <div
            className="flex-1 flex justify-center items-center w-full"
            style={{
              transform: isDragging ? `translateX(${dragOffset * -0.12}px) scale(0.98)` : undefined,
              transition: isDragging ? "none" : "transform 300ms ease-out",
            }}
            aria-hidden
          >
            <img
              src={currentProduct.image}
              alt={currentProduct.title}
              className="w-full max-w-[360px] h-auto object-contain select-none"
              draggable={false}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/Classic_T-shirt.webp";
              }}
            />
          </div>
        </div>

        {/* Right column: two stacked small cards */}
        <div className="flex flex-col gap-6">
          {[right1, right2].map((p, idx) =>
            p ? (
              <div
                key={`side-${idx}`}
                className="bg-white rounded-3xl p-6 shadow-lg flex items-center gap-4 cursor-pointer hover:shadow-xl transition"
                onClick={() => handleOpenModal(p)}
              >
                <div className="w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/Classic_T-shirt.webp";
                    }}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900">{p.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2">{p.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="text-pink-800 font-bold">{formatPrice(p.price)}</div>
                    {p.rating ? (
                      <div className="flex items-center space-x-1">
                        {renderStars(p.rating)}
                        <span className="text-xs text-gray-500">({p.reviewCount || 0})</span>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : (
              <div key={`side-empty-${idx}`} className="bg-white rounded-3xl p-6 shadow-lg h-[120px]" />
            )
          )}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && selectedProduct && (
        <div
          id="modal-backdrop"
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-xl w-full max-w-3xl shadow-2xl p-4 sm:p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-pink-800 bg-pink-100 p-2 rounded-full"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="sm:w-1/2 rounded overflow-hidden bg-gray-100">
                <img
                  src={
                    selectedProduct.image && selectedProduct.image.includes("cloudinary.com")
                      ? selectedProduct.image
                      : selectedProduct.image || "/Classic_T-shirt.webp"
                  }
                  alt={selectedProduct.title}
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/Classic_T-shirt.webp";
                  }}
                />
              </div>

              <div className="sm:w-1/2 flex flex-col">
                <h2 className="text-xl font-bold">{selectedProduct.title}</h2>
                <p className="text-gray-600 mt-2">{selectedProduct.description}</p>

                <div className="mt-4 flex items-center gap-3">
                  <div className="text-2xl font-bold">{formatPrice(selectedProduct.price)}</div>
                  {selectedProduct.oldPrice && (
                    <div className="text-sm line-through text-gray-400">{formatPrice(selectedProduct.oldPrice)}</div>
                  )}
                </div>

                <div className="mt-auto pt-4">
                  <button
                    onClick={(e) => {
                      addToCart(selectedProduct, e);
                      handleCloseModal();
                    }}
                    className="w-full bg-pink-800 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
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
}
