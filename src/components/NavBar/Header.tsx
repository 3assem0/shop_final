import { Button } from "@/components/ui/button";
import { ShoppingBag, Menu, X, Plus, Minus, Trash2, ShoppingCart } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import Banner from "../banner/Banner";
import { useEffect, useState } from "react";

// Mock cart functions - replace with your actual cart implementation
const getCart = () => {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
};

const saveCart = (cartItems) => {
  localStorage.setItem('cart', JSON.stringify(cartItems));
};

const addToCart = (product) => {
  const cart = getCart();
  const existingItem = cart.find(item => item.id === product.id);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  
  saveCart(cart);
  return cart;
};

const removeFromCart = (productId) => {
  const cart = getCart();
  const updatedCart = cart.filter(item => item.id !== productId);
  saveCart(updatedCart);
  return updatedCart;
};

const updateQuantity = (productId, quantity) => {
  const cart = getCart();
  const item = cart.find(item => item.id === productId);
  
  if (item) {
    if (quantity <= 0) {
      return removeFromCart(productId);
    } else {
      item.quantity = quantity;
      saveCart(cart);
      return cart;
    }
  }
  return cart;
};

// Shopping Cart Component
const ShoppingCartDrawer = ({ isOpen, onOpenChange, cartItems, onUpdateCart }) => {
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  const handleQuantityChange = (productId, newQuantity) => {
    const updatedCart = updateQuantity(productId, newQuantity);
    onUpdateCart(updatedCart);
  };

  const handleRemoveItem = (productId) => {
    const updatedCart = removeFromCart(productId);
    onUpdateCart(updatedCart);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[400px] sm:w-[450px] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 flex flex-col z-[56]">
        <SheetHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <SheetTitle className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
            <ShoppingCart className="h-5 w-5 text-purple-600" />
            Shopping Cart ({cartItems.length})
          </SheetTitle>
        </SheetHeader>

        {cartItems.length === 0 ? (
          // Empty Cart State
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Your cart is empty
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
              Looks like you haven't added anything to your cart yet. Start shopping to fill it up!
            </p>
            <Button 
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2"
              onClick={() => onOpenChange(false)}
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  {/* Product Image */}
                  <div className="w-16 h-16 bg-white rounded-lg flex-shrink-0 overflow-hidden border border-gray-200 dark:border-gray-700">
                    <img 
                      src={item.image || "/Classic_T-shirt.webp"} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">
                      {item.name}
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">
                      ${item.price.toFixed(2)}
                    </p>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                      >
                        <Minus className="h-3 w-3 text-gray-600 dark:text-gray-300" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium text-gray-900 dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                      >
                        <Plus className="h-3 w-3 text-gray-600 dark:text-gray-300" />
                      </button>
                    </div>
                  </div>

                  {/* Price and Remove */}
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="mt-2 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
              {/* Subtotal */}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="font-medium text-gray-900 dark:text-white">${subtotal.toFixed(2)}</span>
              </div>

              {/* Shipping */}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                <span className={`font-medium ${shipping === 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </span>
              </div>

              {/* Tax */}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Tax</span>
                <span className="font-medium text-gray-900 dark:text-white">${tax.toFixed(2)}</span>
              </div>

              {/* Free shipping notice */}
              {subtotal < 50 && (
                <div className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-2 rounded">
                  💡 Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                </div>
              )}

              {/* Total */}
              <div className="flex justify-between text-base font-bold border-t border-gray-200 dark:border-gray-700 pt-3">
                <span className="text-gray-900 dark:text-white">Total</span>
                <span className="text-gray-900 dark:text-white">${total.toFixed(2)}</span>
              </div>

              {/* Checkout Button */}
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-base font-semibold mt-4">
                Proceed to Checkout
              </Button>

              {/* Continue Shopping */}
              <Button 
                variant="outline" 
                className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => onOpenChange(false)}
              >
                Continue Shopping
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

// Updated Header component with cart functionality
export const Header = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [query, setQuery] = useState("");

  // Load cart on component mount
  useEffect(() => {
    const loadedCart = getCart();
    setCartItems(loadedCart);
  }, []);

  // Calculate cart count
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Demo function to add items to cart (you can call this from your product components)
  const handleAddToCart = (product) => {
    const updatedCart = addToCart(product);
    setCartItems(updatedCart);
  };

  const navigate = (path) => {
    console.log(`Navigate to: ${path}`);
  };

  const location = { pathname: "/" };

  const goHomeThen = (cb) => {
    if (location.pathname !== "/") navigate("/");
    setTimeout(() => cb?.(), 0);
  };

  const dispatchSearch = (value) => {
    window.dispatchEvent(new CustomEvent("global-search", { detail: value }));
    goHomeThen(() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" }));
  };

  const dispatchCategory = (value) => {
    window.dispatchEvent(new CustomEvent("global-category", { detail: value }));
    goHomeThen(() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" }));
  };

  // Demo products for testing (remove in production)
  const demoProducts = [
    { id: 1, name: "MacBook Pro M4", price: 1999, image: "/Classic_T-shirt.webp" },
    { id: 2, name: "iPhone 16 Pro", price: 999, image: "/Classic_T-shirt.webp" },
    { id: 3, name: "iPad Pro", price: 799, image: "/Classic_T-shirt.webp" }
  ];

  return (
    <>
      <header className="fixed top-5 left-0 right-0 z-[55] w-full flex flex-col items-center ">
        <div className="w-full max-w-4xl mx-auto px-6 lg:px-8">
          <div className="rounded-lg border-b backdrop-blur-sm shadow-sm border-gray-200 dark:border-gray-700 dark:bg-gray-900/95 dark:text-white text-gray-900 bg-white/95">
            <div className="flex items-center justify-between h-16 px-6 lg:px-8">
              
              {/* Left Section - Logo & Navigation */}
              <div className="flex items-center space-x-8 flex-1">
                {/* Logo */}
                <div 
                  className="flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity duration-200" 
                  onClick={() => navigate("/")}
                >
                  <img 
                    src="/logo.png" 
                    alt="Mohair" 
                    className="h-10 w-auto object-contain"
                  />
                </div>
                
                {/* Desktop Navigation */}
                <nav className="hidden md:flex">
                  <ul className="flex items-center space-x-8">
                    <li>
                      <button 
                        className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium text-sm tracking-wide transition-all duration-200 relative group py-2"
                        onClick={() => dispatchCategory("all")}
                      >
                        Products
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 dark:bg-purple-400 transition-all duration-200 group-hover:w-full"></span>
                      </button>
                    </li>
                    <li>
                      <button 
                        className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium text-sm tracking-wide transition-all duration-200 relative group py-2"
                        onClick={() => dispatchCategory("Shirts")}
                      >
                        About
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 dark:bg-purple-400 transition-all duration-200 group-hover:w-full"></span>
                      </button>
                    </li>
                    <li>
                      <button 
                        className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium text-sm tracking-wide transition-all duration-200 relative group py-2"
                        onClick={() => dispatchCategory("Stickers")}
                      >
                        Contact
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 dark:bg-purple-400 transition-all duration-200 group-hover:w-full"></span>
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>

              {/* Right Section - Actions */}
              <div className="flex items-center space-x-3">
                
                {/* Demo Add to Cart Buttons (remove in production) */}
                {/* <div className="hidden lg:flex items-center space-x-2">
                  {demoProducts.slice(0, 1).map(product => (
                    <Button
                      key={product.id}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => handleAddToCart(product)}
                    >
                      Add {product.name.split(' ')[0]}
                    </Button>
                  ))}
                </div> */}

                {/* Mobile Menu */}
                <div className="block md:hidden">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-800 h-9 w-9 transition-all duration-200"
                      >
                        <Menu className="h-5 w-5" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[280px] sm:w-[320px] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                      <div className="flex flex-col space-y-6 mt-8">
                        <nav className="flex flex-col space-y-2">
                          <button 
                            className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium text-base transition-all duration-200"
                            onClick={() => dispatchCategory("Products")}
                          >
                            Products
                          </button>
                          <button 
                            className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium text-base transition-all duration-200"
                            onClick={() => dispatchCategory("About")}
                          >
                            About
                          </button>
                          <button 
                            className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium text-base transition-all duration-200"
                            onClick={() => dispatchCategory("Contact")}
                          >
                            Contact
                          </button>
                        </nav>

                        {/* Demo buttons in mobile menu */}
                        {/* <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Demo Cart:</p>
                          {demoProducts.map(product => (
                            <Button
                              key={product.id}
                              variant="outline"
                              size="sm"
                              className="w-full mb-2"
                              onClick={() => handleAddToCart(product)}
                            >
                              Add {product.name}
                            </Button>
                          ))}
                        </div> */}
                        
                        {/* Mobile Menu Footer */}
                        <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700">
                          <p className="text-sm text-gray-500 dark:text-gray-400 text-center font-light">
                            © 2024 Mohair
                          </p>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>

                {/* Shopping Cart */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-800 h-9 w-9 transition-all duration-200" 
                  onClick={() => setIsCartOpen(true)}
                >
                  <ShoppingBag className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-purple-600 dark:bg-purple-500 text-white text-xs flex items-center justify-center font-semibold shadow-lg ">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Banner /> 
      </header>

      {/* Shopping Cart Drawer */}
      <ShoppingCartDrawer 
        isOpen={isCartOpen}
        onOpenChange={setIsCartOpen}
        cartItems={cartItems}
        onUpdateCart={setCartItems}
      />
    </>
  );
};