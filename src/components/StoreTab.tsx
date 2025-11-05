import { useState, useEffect } from 'react';
import { supabase, type Product } from '../lib/supabase';
import { ScrollArea } from './ui/scroll-area';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Star, Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

const CATEGORIES = [
  'all',
  'laptop',
  'phone',
  'computer',
  'headphone',
  'watch',
  'keyboard',
  'mouse',
  'bag',
  'shoes',
  'jacket',
  'sunglasses',
  'bottle',
];

export function StoreTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  async function fetchProducts() {
    try {
      setLoading(true);
      let query = supabase.from('products').select('*');

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      const { data, error } = await query.order('rating', { ascending: false }).limit(50);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Filter Controls */}
      <div className="px-4 py-3 border-b border-border bg-background">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Products Grid */}
      <ScrollArea className="flex-1">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 p-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg hover:border-primary/50 transition-all duration-200 cursor-pointer transform hover:-translate-y-1"
              >
                <div className="aspect-square bg-muted relative overflow-hidden">
                  <LazyLoadImage
                    src={product.image_url}
                    alt={product.name}
                    effect="opacity"
                    className="w-full h-full object-cover"
                    wrapperClassName="w-full h-full"
                    threshold={100}
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-sm line-clamp-2 mb-1 hover:text-primary transition-colors">{product.name}</h3>
                  <div className="flex items-center gap-1 mb-2 bg-yellow-500/10 px-2 py-0.5 rounded-full w-fit">
                    <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                    <span className="text-xs font-medium">{product.rating.toFixed(1)}</span>
                  </div>
                  <p className="text-sm font-semibold text-primary">{formatPrice(product.price)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
