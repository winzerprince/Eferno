import { Star, ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import type { Product } from "./ChatMessage";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden bg-white">
      <div className="flex gap-3 p-3">
        <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="mb-1 line-clamp-2">{product.name}</h3>
          
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-gray-600">{product.rating}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-blue-600">${product.price}</span>
            <Button size="sm" className="h-7 px-3">
              <ShoppingCart className="w-3 h-3 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
