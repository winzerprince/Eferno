import { useState } from "react";
import { X, Maximize2, Star, ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import type { Product } from "./ChatMessage";

interface ProductFloatingWindowProps {
  product: Product;
  onClose: () => void;
}

export function ProductFloatingWindow({ product, onClose }: ProductFloatingWindowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (isExpanded) {
    return (
      <div className="fixed inset-0 z-50 bg-background overflow-y-auto">
        <div className="sticky top-0 bg-background/95 backdrop-blur border-b border-border p-4 flex items-center justify-between z-10">
          <h2 className="line-clamp-1">{product.name}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="pb-24">
          {/* Product Image */}
          <div className="w-full aspect-square bg-muted">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Details */}
          <div className="p-6 space-y-6">
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <h2>{product.name}</h2>
                <Badge variant="secondary">{product.category}</Badge>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{product.rating}</span>
                </div>
                <span>•</span>
                <span>4,289 reviews</span>
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl text-primary">${product.price}</span>
            </div>

            <div>
              <h3 className="mb-2">Description</h3>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            {product.specs && product.specs.length > 0 && (
              <div>
                <h3 className="mb-3">Specifications</h3>
                <div className="grid grid-cols-2 gap-2">
                  {product.specs.map((spec, index) => (
                    <Badge key={index} variant="outline" className="justify-start">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Fixed Buy Button */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-background border-t border-border">
          <Button className="w-full" size="lg">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart - ${product.price}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none">
      <div 
        className="w-full max-w-md mx-auto bg-background rounded-t-2xl shadow-2xl border border-border pointer-events-auto overflow-hidden"
        style={{ height: "70vh" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="line-clamp-1 flex-1">{product.name}</h3>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(true)}
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto h-[calc(70vh-64px)]">
          <div className="aspect-square bg-muted">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{product.rating}</span>
              </div>
              <span className="text-muted-foreground">•</span>
              <Badge variant="secondary">{product.category}</Badge>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl text-primary">${product.price}</span>
            </div>

            <div>
              <h4 className="mb-2">Description</h4>
              <p className="text-muted-foreground text-sm">{product.description}</p>
            </div>

            {product.specs && product.specs.length > 0 && (
              <div>
                <h4 className="mb-2">Key Features</h4>
                <div className="space-y-1">
                  {product.specs.slice(0, 4).map((spec, index) => (
                    <div key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-primary" />
                      {spec}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsExpanded(true)}
            >
              View Full Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
