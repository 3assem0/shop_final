import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
export const Hero = () => {
  return <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-secondary" />
      
      <div className="container mx-auto px-4 relative z-10 py-16 md:py-12"> {/* Added vertical padding for overall spacing */}
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          {/* Added the logo image here */}
          <img src="/assets/logo.png" // Ensure this path is correct relative to your public folder
        alt="Mohair Handmade Logo" className="mx-auto mb-8 w-32 md:w-40 h-auto object-contain" // Centered, added bottom margin, and set size
        />

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Handcrafted with
            <span className="block text-primary bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Love & Care
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover unique, handmade products crafted with traditional techniques and modern design. 
            Each piece tells a story of artisan dedication.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="craft-shadow group" onClick={() => document.getElementById('products')?.scrollIntoView({
            behavior: 'smooth'
          })}>
              Shop Collection
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button variant="outline" size="lg" asChild>
              
            </Button>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent/10 rounded-full blur-xl animate-pulse delay-1000" />
    </section>;
};