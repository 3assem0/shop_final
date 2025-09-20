import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  Menu,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import Banner from "../banner/Banner";
import { useEffect, useState } from "react";
import { getCart, setCart, addToCart as addToCartLib } from "../../lib/cart";
import { ShoppingCartDrawer } from "./ShoppingCartDrawer";



// Updated Header component with cart functionality
export const Header = () => {
  // Remove all local cart logic and use shared functions
  // Cart state
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setCartItems(getCart());
    const handleCartUpdated = () => setCartItems(getCart());
    window.addEventListener("cart-updated", handleCartUpdated);
    return () => window.removeEventListener("cart-updated", handleCartUpdated);
  }, []);

  const handleAddToCart = (product) => {
    addToCartLib(product);
    setCartItems(getCart());
  };

  const handleRemoveItem = (productId) => {
    const cart = getCart().filter((item) => item.id !== productId);
    setCart(cart);
    setCartItems(cart);
  };

  const handleQuantityChange = (productId, newQuantity) => {
    let cart = getCart();
    if (newQuantity <= 0) {
      cart = cart.filter((item) => item.id !== productId);
    } else {
      cart = cart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
    }
    setCart(cart);
    setCartItems(cart);
  };

  // Calculate cart count
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

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
    goHomeThen(() =>
      document
        .getElementById("products")
        ?.scrollIntoView({ behavior: "smooth" })
    );
  };

  const dispatchCategory = (value) => {
    window.dispatchEvent(new CustomEvent("global-category", { detail: value }));
    goHomeThen(() =>
      document
        .getElementById("products")
        ?.scrollIntoView({ behavior: "smooth" })
    );
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[55] w-full flex flex-col items-center ">
        <div className="w-full mx-auto ">
          <div className="rounded-lg border-b backdrop-blur-sm shadow-sm border-gray-200  text-[#831670] bg-[#fee0f9]">
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
                        className="text-[#831670] font-medium text-sm tracking-wide transition-all duration-200 relative group py-2"
                        onClick={() => {
                          const el = document.getElementById("products");
                          el?.scrollIntoView({ behavior: "smooth" });
                        }}
                      >
                        Products
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#fb6f92] transition-all duration-200 group-hover:w-full"></span>
                      </button>
                    </li>
                    <li>
                      <button
                        className="text-[#831670] font-medium text-sm tracking-wide transition-all duration-200 relative group py-2"
                        onClick={() => {
                          const el = document.getElementById("contact");
                          el?.scrollIntoView({ behavior: "smooth" });
                        }}
                      >
                        Contact
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#fb6f92] transition-all duration-200 group-hover:w-full"></span>
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>

              {/* Right Section - Actions */}
              <div className="flex items-center space-x-3">
                {/* Mobile Menu */}
                <div className="block md:hidden ">
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
                    <SheetContent
                      side="right"
                      className="w-[280px] sm:w-[320px] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 mt-16 pt-1"
                    >
                      <div className="flex flex-col space-y-6 mt-8">
                        <nav className="flex flex-col space-y-2">
                          <button
                            className="text-[#831670] font-medium text-sm tracking-wide transition-all duration-200 relative group py-2"
                            onClick={() => {
                              const el = document.getElementById("products");
                              el?.scrollIntoView({ behavior: "smooth" });
                            }}
                          >
                            Products
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#fb6f92] transition-all duration-200 group-hover:w-full"></span>
                          </button>
                          <button
                            className="text-[#831670] font-medium text-sm tracking-wide transition-all duration-200 relative group py-2"
                            onClick={() => {
                              const el = document.getElementById("contact");
                              el?.scrollIntoView({ behavior: "smooth" });
                            }}
                          >
                            Contact
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#fb6f92] transition-all duration-200 group-hover:w-full"></span>
                          </button>
                        </nav>

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
                      {cartCount > 99 ? "99+" : cartCount}
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
        handleQuantityChange={handleQuantityChange}
        handleRemoveItem={handleRemoveItem}
      />
    </>
  );
};
