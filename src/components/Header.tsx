import { Button } from "@/components/ui/button";
import { ShoppingBag, User, Menu } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const Header = () => {
  const [cartCount] = useState(0);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-2 sm:px-4 flex h-16 sm:h-18 md:h-20 items-center">
        {/* Desktop Navigation - Left */}
        <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 flex-1">
          <a href="#" className="text-sm xl:text-base text-foreground hover:text-primary transition-colors">
            Home
          </a>
          <a href="#products" className="text-sm xl:text-base text-foreground hover:text-primary transition-colors">
            Products
          </a>
          <a href="#contact" className="text-sm xl:text-base text-foreground hover:text-primary transition-colors">
            Contact
          </a>
        </nav>

        {/* Logo and Title - Center/Left on mobile */}
        <div className="flex items-center justify-start lg:justify-center flex-1 lg:flex-shrink-0"> 
          <img
            src="/assets/logo.png"
            alt="Mohair Logo"
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 object-contain"
          />
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-primary font-handmade ml-2 md:ml-3 truncate sm:whitespace-nowrap">
            <span className="hidden sm:inline">Mohair Handmade</span>
            <span className="sm:hidden">Mohair</span>
          </h1>
        </div>

        {/* Actions - Right */}
        <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4 flex-shrink-0">
          <Button variant="ghost" size="sm" className="relative p-2">
            <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Button>
          
          <Button variant="ghost" size="sm" className="p-2" asChild>
            <a href="/admin">
              <User className="h-4 w-4 sm:h-5 sm:w-5" />
            </a>
          </Button>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="lg:hidden p-2">
                <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[300px]">
              <nav className="flex flex-col space-y-6 mt-8">
                <a href="#" className="text-lg text-foreground hover:text-primary transition-colors">
                  Home
                </a>
                <a href="#products" className="text-lg text-foreground hover:text-primary transition-colors">
                  Products
                </a>
                <a href="#contact" className="text-lg text-foreground hover:text-primary transition-colors">
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
