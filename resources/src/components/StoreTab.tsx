import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { ProductDetailSheet } from "./ProductDetailSheet";
import type { Product } from "./ChatMessage";

const ALL_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Sony WH-1000XM5 Wireless Headphones",
    price: 349.99,
    rating: 4.8,
    description: "Industry-leading noise cancellation with crystal-clear sound quality. Up to 30 hours battery life.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzYxMjIwMzgzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Audio",
    availability: "In Stock",
    specs: ["Active Noise Cancellation", "30h Battery Life", "Bluetooth 5.2", "Multi-point connection"],
  },
  {
    id: "2",
    name: "Bose QuietComfort 45",
    price: 279.99,
    rating: 4.7,
    description: "Premium comfort and sound quality with legendary noise cancellation technology.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzYxMjIwMzgzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Audio",
    availability: "In Stock",
    specs: ["Noise Cancellation", "24h Battery", "USB-C Charging", "Foldable Design"],
  },
  {
    id: "3",
    name: "Nike Air Zoom Pegasus 40",
    price: 129.99,
    rating: 4.6,
    description: "Responsive cushioning for everyday runs with enhanced durability and comfort.",
    image: "https://images.unsplash.com/photo-1597892657493-6847b9640bac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydW5uaW5nJTIwc2hvZXN8ZW58MXx8fHwxNzYxMTU2NjY1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Footwear",
    availability: "In Stock",
    specs: ["React Foam", "Zoom Air", "Breathable Mesh", "Waffle Outsole"],
  },
  {
    id: "4",
    name: "Adidas Ultraboost 23",
    price: 189.99,
    rating: 4.8,
    description: "Maximum energy return with Boost cushioning technology for ultimate comfort.",
    image: "https://images.unsplash.com/photo-1597892657493-6847b9640bac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydW5uaW5nJTIwc2hvZXN8ZW58MXx8fHwxNzYxMTU2NjY1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Footwear",
    availability: "Low Stock",
    specs: ["Boost Midsole", "Primeknit Upper", "Continental Rubber", "Torsion System"],
  },
  {
    id: "5",
    name: "MacBook Air M2 13-inch",
    price: 1199.99,
    rating: 4.9,
    description: "Supercharged by M2 chip. Incredibly thin and light design with all-day battery life.",
    image: "https://images.unsplash.com/photo-1511385348-a52b4a160dc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBjb21wdXRlcnxlbnwxfHx8fDE3NjExNDAwODh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Computers",
    availability: "In Stock",
    specs: ["M2 Chip", "13.6\" Liquid Retina", "18h Battery", "8GB RAM"],
  },
  {
    id: "6",
    name: "Dell XPS 13 Plus",
    price: 1099.99,
    rating: 4.7,
    description: "Stunning design with powerful performance. Edge-to-edge InfinityEdge display.",
    image: "https://images.unsplash.com/photo-1511385348-a52b4a160dc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBjb21wdXRlcnxlbnwxfHx8fDE3NjExNDAwODh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Computers",
    availability: "In Stock",
    specs: ["Intel Core i7", "13.4\" FHD+", "16GB RAM", "512GB SSD"],
  },
  {
    id: "7",
    name: "Apple Watch Series 9",
    price: 399.99,
    rating: 4.8,
    description: "Advanced health and fitness features with always-on Retina display.",
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNofGVufDF8fHx8MTc2MTE3Njc4NXww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Wearables",
    availability: "In Stock",
    specs: ["S9 SiP", "Always-On Display", "ECG & Blood Oxygen", "50m Water Resistant"],
  },
  {
    id: "8",
    name: "AirPods Pro (2nd gen)",
    price: 249.99,
    rating: 4.7,
    description: "Active noise cancellation with transparency mode and adaptive audio.",
    image: "https://images.unsplash.com/photo-1627989580309-bfaf3e58af6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGVhcmJ1ZHN8ZW58MXx8fHwxNzYxMTQ3NTEwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Audio",
    availability: "In Stock",
    specs: ["Active ANC", "Adaptive Audio", "30h Total Battery", "MagSafe Charging"],
  },
  {
    id: "9",
    name: "Mechanical Gaming Keyboard",
    price: 159.99,
    rating: 4.6,
    description: "RGB backlit mechanical keyboard with customizable switches and macro support.",
    image: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBrZXlib2FyZHxlbnwxfHx8fDE3NjExNzUwMTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Gaming",
    availability: "In Stock",
    specs: ["Cherry MX Switches", "RGB Lighting", "Programmable Keys", "USB-C"],
  },
  {
    id: "10",
    name: "iPhone 15 Pro",
    price: 999.99,
    rating: 4.9,
    description: "Titanium design with A17 Pro chip. Advanced camera system with 5x optical zoom.",
    image: "https://images.unsplash.com/photo-1732998369893-af4c9a4695fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwZGV2aWNlfGVufDF8fHx8MTc2MTIwMTc0NHww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Smartphones",
    availability: "In Stock",
    specs: ["A17 Pro Chip", "48MP Camera", "Titanium Build", "USB-C"],
  },
  {
    id: "11",
    name: "Travel Backpack 40L",
    price: 89.99,
    rating: 4.5,
    description: "Durable travel backpack with multiple compartments and laptop sleeve.",
    image: "https://images.unsplash.com/photo-1570630358718-4fb324824b3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWNrcGFjayUyMHRyYXZlbHxlbnwxfHx8fDE3NjExMDkzNjF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Accessories",
    availability: "In Stock",
    specs: ["40L Capacity", "Water Resistant", "Laptop Sleeve", "USB Port"],
  },
  {
    id: "12",
    name: "Canon EOS R6 Camera",
    price: 2499.99,
    rating: 4.9,
    description: "Full-frame mirrorless camera with 20MP sensor and advanced autofocus.",
    image: "https://images.unsplash.com/photo-1579535984712-92fffbbaa266?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW1lcmElMjBwaG90b2dyYXBoeXxlbnwxfHx8fDE3NjExNDI0MjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Cameras",
    availability: "In Stock",
    specs: ["20MP Full-Frame", "4K 60fps Video", "In-Body Stabilization", "Dual Card Slots"],
  },
];

const CATEGORIES = ["All", "Audio", "Footwear", "Computers", "Wearables", "Gaming", "Smartphones", "Accessories", "Cameras"];

export function StoreTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = ALL_PRODUCTS.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col h-full">
      {/* Search Bar */}
      <div className="p-4 border-b border-border space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="pl-9"
          />
        </div>

        {/* Category Filter */}
        <ScrollArea className="w-full">
          <div className="flex gap-2 pb-2">
            {CATEGORIES.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer whitespace-nowrap"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Product Grid */}
      <ScrollArea className="flex-1">
        <div className="p-4 grid grid-cols-2 gap-3">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="rounded-xl overflow-hidden bg-card border border-border cursor-pointer hover:shadow-lg transition-all"
              onClick={() => setSelectedProduct(product)}
            >
              <div className="aspect-square bg-muted overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <h3 className="line-clamp-2 mb-2 min-h-[2.5rem]">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-primary">${product.price}</span>
                  <Badge variant="secondary" className="text-xs">
                    ★ {product.rating}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No products found
          </div>
        )}
      </ScrollArea>

      {/* Product Detail Sheet */}
      <ProductDetailSheet
        product={selectedProduct}
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
