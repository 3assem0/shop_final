import { Button } from "@/components/ui/button";
import { ShoppingBag, User, Menu } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const Header = () => {
  const [cartCount] = useState(0);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex flex-wrap items-center justify-between gap-y-4 py-2 md:py-4">
        {/* Left: Logo & Title (on small screens logo comes first) */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <img
            src="/assets/logo.png"
            alt="Mohair Logo"
            className="w-12 h-12 object-contain"
          />
          <h1 className="text-xl sm:text-2xl font-bold text-primary font-handmade whitespace-nowrap">
            Mohair Handmade
          </h1>
        </div>

        {/* Center: Navigation (hidden on small screens) */}
        <nav className="hidden md:flex items-center space-x-6 flex-grow justify-center">
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

        {/* Right: Actions */}
        <div className="flex items-center gap-3 ml-auto">
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

          {/* Always visible menu icon */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[260px] sm:w-[300px]">
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
