import { Star, MapPin, Package } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent } from "./ui/sheet";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import type { Product } from "./ChatMessage";

interface ProductDetailSheetProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

export function ProductDetailSheet({ product, open, onClose }: ProductDetailSheetProps) {
  if (!product) return null;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[90vh] p-0">
        <ScrollArea className="h-full">
          <div className="pb-20">
            {/* Product Image */}
            <div className="w-full aspect-square bg-muted">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Info */}
            <div className="p-6 space-y-6">
              {/* Header */}
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

              {/* Price */}
              <div className="flex items-baseline gap-2">
                <span className="text-3xl text-primary">${product.price}</span>
              </div>

              {/* Availability */}
              <div className="flex items-center gap-2 text-sm">
                <Package className="w-4 h-4 text-green-600" />
                <span className="text-green-600">{product.availability || "In Stock"}</span>
              </div>

              {/* Description */}
              <div>
                <h3 className="mb-2">Description</h3>
                <p className="text-muted-foreground">{product.description}</p>
              </div>

              {/* Specifications */}
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

              {/* Location */}
              <div className="flex items-center gap-2 p-4 rounded-lg bg-muted">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                <div>
                  <p className="text-sm">Ships from</p>
                  <p className="text-muted-foreground text-sm">United States</p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Fixed Bottom Button */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-background border-t border-border">
          <Button className="w-full" size="lg">
            Order Now
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
