import { useState, useEffect } from 'react';
import { supabase, type Product } from '../lib/supabase';
import { ScrollArea } from './ui/scroll-area';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Star } from 'lucide-react';
import { SkeletonCard } from './ui/Skeleton';
import { motion } from 'framer-motion';
import { formatPrice } from '../lib/currency';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './ui/select';
import { ProductDetails } from './ProductDetails';

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
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    useEffect(() => {
        fetchProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            <ScrollArea className="flex-1 h-full">
                <div className="h-full">
                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 pb-20">
                            {[...Array(8)].map((_, i) => (
                                <div key={i}>
                                    <SkeletonCard />
                                </div>
                            ))}
                        </div>
                    ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 pb-20">
                {products.map((product) => (
                    <motion.div
                        key={product.id}
                        whileHover={{ scale: 1.02, y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedProduct(product)}
                        className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg hover:border-primary/50 transition-all duration-200 cursor-pointer"
                    >
                                    <div className="aspect-square bg-muted relative overflow-hidden">
                                        <LazyLoadImage
                                            src={product.image_url}
                                            alt={product.name}
                                            effect="opacity"
                                            className="w-full h-full object-cover"
                                            wrapperClassName="w-full h-full"
                                            threshold={50}
                                            placeholderSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect fill='%23f3f4f6' width='400' height='400'/%3E%3C/svg%3E"
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
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </ScrollArea>

            <ProductDetails
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />
        </div>
    );
}
