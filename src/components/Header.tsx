import { Button } from "@/components/ui/button";
import { ShoppingBag, User, Menu } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const Header = () => {
  const [cartCount] = useState(0);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Changed h-20 to h-16 for a slightly more compact header, and added justify-between to space out items */}
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        {/* Desktop Navigation - Left */}
        {/* Added flex-1 to allow it to take up available space */}
        <nav className="hidden md:flex items-center space-x-8 flex-1">
          <a href="#" className="text-foreground hover:text-primary transition-colors">
            Home
          </a>
          <a href="#products" className="text-foreground hover:text-primary transition-colors">
            Products
          </a>
          <a href="#contact" className="text-foreground hover:text-primary transition-colors">
            Contact
          </a>
        </nav>

        {/* Logo and Title - Center */}
        {/* Removed py-2 and gap-6 from this div. 
            Added flex-1 to push it to the center when combined with other flex-1 elements.
            Using 'items-center' on this div will vertically center its content. */}
        <div className="flex items-center justify-center flex-shrink-0 flex-1"> 
          <img
            src="/assets/logo.png" // Ensure this path is correct relative to your public folder
            alt="Mohair Logo"
            className="w-14 h-14 object-contain" // Adjusted size for better visibility and proportion
          />
          {/* Added ml-3 for consistent spacing */}
          <h1 className="text-2xl font-bold text-primary font-handmade ml-3 whitespace-nowrap">Mohair Handmade</h1>
        </div>

        {/* Actions - Right */}
        {/* Added flex-1 and justify-end to push actions to the right */}
        <div className="flex items-center space-x-4 flex-1 justify-end">
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Button>
          
          <Button variant="ghost" size="icon" asChild>
            <a href="/admin">
              <User className="h-5 w-5" />
            </a>
          </Button>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <nav className="flex flex-col space-y-4 mt-8">
                <a href="#" className="text-foreground hover:text-primary transition-colors">
                  Home
                </a>
                <a href="#products" className="text-foreground hover:text-primary transition-colors">
                  Products
                </a>
                <a href="#contact" className="text-foreground hover:text-primary transition-colors">
                  Contact
                </a>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
