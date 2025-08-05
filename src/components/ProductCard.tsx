import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Heart } from "lucide-react";
import { Product } from "@/types/product";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleInstagramOrder = () => {
    const message = `Hi! I'm interested in ordering "${product.name}" for $${product.price}. Can you provide more details?`;
    window.open('https://ig.me/m/mohair_handmadecrochet', '_blank');
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 animate-scale-in craft-shadow">
      <CardContent className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          {product.image_urls && product.image_urls.length > 0 ? (
            <div className="relative">
              <img
                src={product.image_urls[currentImageIndex]}
                alt={product.name}
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {product.image_urls.length > 1 && (
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  {product.image_urls.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex ? 'bg-primary' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-64 bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No image available</span>
            </div>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-white/80 hover:bg-white"
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
          
          {!product.in_stock && (
            <Badge variant="destructive" className="absolute top-2 left-2">
              Out of Stock
            </Badge>
          )}
        </div>
        
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>
            <Badge variant="secondary" className="ml-2 shrink-0">
              {product.category}
            </Badge>
          </div>
          
          {product.description && (
            <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
              {product.description}
            </p>
          )}
          
          {product.color && (
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm text-muted-foreground">Color:</span>
              <div 
                className="w-6 h-6 rounded-full border-2 border-border" 
                style={{ backgroundColor: product.color }}
                title={product.color}
              />
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary">
              ${product.price.toFixed(2)}
            </span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full group" 
          onClick={handleInstagramOrder}
          disabled={!product.in_stock}
        >
          <MessageCircle className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
          Order on Instagram
        </Button>
      </CardFooter>
    </Card>
  );
};