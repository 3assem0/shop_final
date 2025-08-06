import { Button } from "@/components/ui/button";
import { ShoppingBag, User, Menu } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const Header = () => {
  const [cartCount] = useState(0);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 items-center">
        {/* Desktop Navigation - Left */}
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
        <div className="flex items-center justify-center flex-shrink-0 mx-8"> 
          <img
            src="assets/logo.png"
            alt="Mohair Logo"
            className="w-12 h-12 object-contain" 
          />
          <h1 className="text-2xl font-bold text-primary font-handmade ml-6 whitespace-nowrap">Mohair Handmade</h1>
        </div>

        {/* Actions - Right */}
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
              <Button variant="ghost" size="icon" className="md:hidden">
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
