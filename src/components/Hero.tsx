import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative min-h-[70vh] sm:min-h-[80vh] lg:min-h-[85vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-secondary" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-8 sm:py-12 md:py-16"> 
        <div className="max-w-5xl mx-auto text-center animate-fade-in">
          {/* Logo with responsive sizing */}
          <img
            src="/assets/logo.png"
            alt="Mohair Handmade Logo"
            className="mx-auto mb-6 sm:mb-8 w-20 sm:w-28 md:w-32 lg:w-40 h-auto object-contain"
          />

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
            Handcrafted with
            <span className="block text-primary bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Love & Care
            </span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground mb-6 sm:mb-8 max-w-xs sm:max-w-lg md:max-w-2xl mx-auto px-2">
            Discover unique, handmade products crafted with traditional techniques and modern design. 
            Each piece tells a story of artisan dedication.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
            <Button size="default" className="craft-shadow group w-full sm:w-auto" onClick={() => document.getElementById('products')?.scrollIntoView({
              behavior: 'smooth'
            })}>
              Shop Collection
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button variant="outline" size="default" className="w-full sm:w-auto" asChild>
              <a href="#contact">Learn More</a>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Decorative elements - responsive positioning */}
      <div className="absolute top-10 sm:top-20 left-4 sm:left-10 w-12 h-12 sm:w-20 sm:h-20 bg-primary/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-10 sm:bottom-20 right-4 sm:right-10 w-16 h-16 sm:w-32 sm:h-32 bg-accent/10 rounded-full blur-xl animate-pulse delay-1000" />
    </section>
  );
};
