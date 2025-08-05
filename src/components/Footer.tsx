import { Instagram, Mail, Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold text-primary mb-4">Mohair Handmade</h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              Creating beautiful, unique handmade products with love and attention to detail. 
              Each piece is crafted to bring joy and warmth to your life.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com/mohair_handmadecrochet?igsh=NXl5M2dvbDVpaXV5" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a 
                href="mailto:mohair.handmade11@gmail.com"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Home</a></li>
              <li><a href="#products" className="text-muted-foreground hover:text-primary transition-colors">Products</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://ig.me/m/mohair_handmadecrochet" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Instagram Messages
                </a>
              </li>
              <li>
                <a 
                  href="mailto:mohair.handmade11@gmail.com"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Email
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground flex items-center justify-center gap-2">
            Made with <Heart className="h-4 w-4 text-red-500 fill-current" /> by Mohair Handmade © 2024
          </p>
        </div>
      </div>
    </footer>
  );
};