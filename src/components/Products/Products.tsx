/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/20/solid';
import { addToCart } from '@/lib/cart';
import styles from './Products.module.css';
import ProductGrid from '../Skiliton/ProductGrid';

interface Product {
  name: string;
  description: string;
  price: string;
  // Extended properties for the modal
  id?: number;
  image?: string;
  imageSrc?: string;
  imageAlt?: string;
  color?: string;
  colorHex?: string;
  rating?: number;
  reviewCount?: number;
  category?: string;
  oldPrice?: string;
}

interface ProductData {
  products: Product[];
  lastUpdated: string;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  // Load products from API
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/get-products');
      if (!response.ok) {
        throw new Error(`Failed to load products: ${response.status} ${response.statusText}`);
      }

      const data: ProductData = await response.json();
      if (!data.products || data.products.length === 0) {
        setProducts([]);
      } else {
        // Use admin data only, no defaults/randoms
        const transformedProducts = data.products.map((product, index) => {
          // Prefer Cloudinary image, fallback to local, then placeholder
          const imageUrl = product.image || product.imageSrc || product.imageAlt || 'https://via.placeholder.com/400x400?text=No+Image';
          return {
            ...product,
            id: index + 1,
            imageSrc: imageUrl,
            imageAlt: product.imageAlt || `Image of ${product.name}`,
            color: product.color || '',
            colorHex: product.colorHex || '#6366f1',
            rating: typeof product.rating === 'number' ? product.rating : 4,
            reviewCount: typeof product.reviewCount === 'number' ? product.reviewCount : 1,
            category: product.category || '',
            oldPrice: product.oldPrice || '',
          };
        });
        setProducts(transformedProducts);
      }
    } catch (err: any) {
      console.error('Error loading products:', err);
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const buyProduct = (product: Product) => {
    // Add product to cart with all relevant fields
    addToCart({
      id: product.id || product.name,
      name: product.name,
      price: product.price,
      imageSrc: product.imageSrc,
      imageAlt: product.imageAlt,
      color: product.color,
      colorHex: product.colorHex,
      category: product.category,
    });
    alert(`Added "${product.name}" to cart!`);
  };

  const viewDetails = (product: Product) => {
    handleProductClick(product);
  };

  return (
    <div className="bg-transparent">
      {/* Product grid */}
      {loading ? (
        <ProductGrid />
      ) : (
        <>
          <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Customers also purchased
            </h2>

            <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="group relative cursor-pointer"
                  onClick={() => {
                    setSelectedProduct(product);
                    setModalOpen(true);
                  }}
                >
                  <img
                    alt={product.imageAlt || product.name}
                    src={product.imageSrc}
                    className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
                  />
                  <div className="mt-4 flex justify-between">
                    <div>
                      <h3 className="text-sm text-gray-700">{product.name}</h3>
                      <p className="mt-1 text-sm text-gray-500">{product.color}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">{product.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Product Modal */}
      <Dialog open={modalOpen} onClose={setModalOpen} className="relative z-[57]">
        <DialogBackdrop className="fixed inset-0 bg-black/30" />

        <div className="fixed inset-0 z-10 flex items-center justify-center p-4 overflow-y-auto">
          <DialogPanel className="relative w-full max-w-sm sm:max-w-2xl transform rounded-lg sm:rounded-2xl bg-white shadow-xl transition-all overflow-visible">
            {selectedProduct && (
              <>
                {/* Close button */}
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="absolute top-3 right-3 z-50 text-gray-400 hover:text-gray-600"
                  aria-label="Close product modal"
                >
                  <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
                </button>

                {/* Scrollable area */}
                <div className="max-h-[90vh] overflow-auto">
                  <div className="relative flex flex-col sm:flex-row items-start">
                    {/* Image */}
                    <div className="w-full h-auto sm:w-1/2 flex-shrink-0">
                      <img
                        src={selectedProduct.imageSrc}
                        alt={selectedProduct.imageAlt}
                        className="block w-full max-h-[70vh] object-contain rounded-t-lg sm:rounded-l-lg"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 p-4 sm:p-6 flex items-center justify-center min-h-full">
                      <div className="w-full max-w-md text-center sm:text-left lg:text-center">
                        <div className="flex items-start justify-between gap-3 lg:justify-center lg:flex-col lg:items-center">
                          <h2 className="text-lg sm:text-2xl font-semibold text-gray-900 leading-tight lg:text-center">
                            {selectedProduct.name}
                          </h2>
                          <span className="hidden sm:inline-block lg:inline-block bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full lg:mt-2">
                            {selectedProduct.category}
                          </span>
                        </div>

                        <div className="mt-2 sm:hidden">
                          <span className="inline-block bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full">
                            {selectedProduct.category}
                          </span>
                        </div>

                        <div className="mt-3 flex items-center gap-3 text-sm sm:text-base lg:justify-center">
                          <span className="text-sm text-gray-500 min-w-[56px]">Color</span>
                          <div
                            className="h-5 w-5 rounded-full border border-gray-300 shadow-sm flex-shrink-0"
                            style={{ backgroundColor: selectedProduct.colorHex }}
                            role="img"
                            aria-label={`Color ${selectedProduct.color}`}
                          />
                          <span className="text-sm font-medium text-gray-700">{selectedProduct.color}</span>
                        </div>

                        <div className="mt-3 flex items-baseline gap-3 lg:justify-center">
                          <p className="text-xl sm:text-2xl font-bold text-indigo-600">${selectedProduct.price}</p>
                          {selectedProduct.oldPrice && (
                            <p className="text-xs sm:text-sm line-through text-gray-400">${selectedProduct.oldPrice}</p>
                          )}
                        </div>

                        <div className="mt-3 flex items-center gap-2 lg:justify-center">
                          <div className="flex items-center">
                            {[0, 1, 2, 3, 4].map((rating) => (
                              <StarIcon
                                key={rating}
                                className={classNames(
                                  (selectedProduct.rating || 4) > rating ? 'text-yellow-500' : 'text-gray-200',
                                  'h-4 w-4 sm:h-5 sm:w-5'
                                )}
                                aria-hidden="true"
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">
                            {selectedProduct.reviewCount} review{selectedProduct.reviewCount !== 1 ? 's' : ''}
                          </span>
                        </div>

                        <div className="my-3 h-px bg-gray-100" />

                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 lg:justify-center">
                          <button
                            type="button"
                            onClick={() => {
                              addToCart({
                                id: selectedProduct?.id || selectedProduct?.name || '',
                                name: selectedProduct?.name || '',
                                price: selectedProduct?.price || '',
                                imageSrc: selectedProduct?.imageSrc || '',
                                imageAlt: selectedProduct?.imageAlt || '',
                                color: selectedProduct?.color || '',
                                colorHex: selectedProduct?.colorHex || '',
                                category: selectedProduct?.category || '',
                              });
                              setModalOpen(false);
                            }}
                            className="w-full sm:flex-1 lg:w-auto lg:px-8 rounded-md bg-indigo-600 px-4 py-2 text-sm sm:text-base font-medium text-white shadow hover:bg-indigo-700 transition"
                          >
                            Add to cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
};

export default Products;