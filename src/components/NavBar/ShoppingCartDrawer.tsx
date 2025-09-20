import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

// Shopping Cart Component
export const ShoppingCartDrawer = ({
  isOpen,
  onOpenChange,
  cartItems,
  onUpdateCart,
  handleQuantityChange,
  handleRemoveItem,
}) => {
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = subtotal;

  // 👇 Replace this with your WhatsApp number (no +, no spaces)
  const WA_NUMBER = "201092753813";

  // Build WhatsApp message with cart data
  const handleProceedToWhatsApp = () => {
    if (!cartItems || cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    const lines = cartItems
      .map(
        (item, i) =>
          `${i + 1}) ${item.name} x${item.quantity} = EGP${(
            item.price * item.quantity
          ).toFixed(2)}\nImage: ${item.image || "N/A"}`
      )
      .join("\n\n");

    const message = `🛒 New Order\n\n${lines}\n\nTotal: EGP${total.toFixed(2)}`;

    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank"); // ✅ يفتح واتساب
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[350px] sm:w-[400px] bg-white  border-gray-200 flex flex-col z-[56]"
      >
        <SheetHeader className="border-b border-gray-200  pb-4">
          <SheetTitle className="flex items-center gap-2 text-xl font-bold text-[#fb6f92]">
            <ShoppingCart className="h-5 w-5 text-purple-600" />
            Shopping Cart ({cartItems.length})
          </SheetTitle>
        </SheetHeader>

        {cartItems.length === 0 ? (
          // Empty Cart State
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12 px-4">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="h-12 w-12 text-[#fb6f92]" />
            </div>
            <h3 className="text-lg font-semibold text-[#831670] mb-2">
              Your cart is empty
            </h3>
            <p className="text-[#bd37a7] mb-6 max-w-sm">
              Looks like you haven't added anything to your cart yet. Start
              shopping to fill it up!
            </p>
            <Button
              className="bg-[#831670] hover:bg-[#9c2388] text-white px-6 py-2"
              onClick={() => onOpenChange(false)}
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto py-2 space-y-4 px-1">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                >
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
                      EGP{item.price.toFixed(2)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity - 1)
                        }
                        className="w-7 h-7 rounded-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                      >
                        <Minus className="h-3 w-3 text-gray-600 dark:text-gray-300" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium text-gray-900 dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity + 1)
                        }
                        className="w-7 h-7 rounded-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                      >
                        <Plus className="h-3 w-3 text-gray-600 dark:text-gray-300" />
                      </button>
                    </div>
                  </div>

                  {/* Price and Remove */}
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">
                      EGP{(item.price * item.quantity).toFixed(2)}
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
            <div className="gap-3 ">
              {/* Total */}
              <div className="flex justify-between text-base font-bold border-t border-gray-200 dark:border-gray-700 pt-3">
                <span className="text-[#831670] ">Total</span>
                <span className="text-gray-900 dark:text-white">
                  EGP{total.toFixed(2)}
                </span>
              </div>

              {/* Checkout Button */}
              <Button
                onClick={handleProceedToWhatsApp}
                className="w-full bg-[#eeecee] hover:bg-[#dedcdd] text-green-600 py-3 my-2 text-base font-semibold mt-4"
              >
                Proceed to Checkout (WhatsApp)
              </Button>

              {/* Continue Shopping */}
              <Button
                variant="outline"
                className="w-full border-gray-300 text-[#831670]  bg-[#fee0f9] hover:bg-[#f4c6ec] "
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
