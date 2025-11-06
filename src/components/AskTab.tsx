import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../lib/auth';
import { supabase, type Product } from '../lib/supabase';
import { getProductRecommendations, type ProductRecommendation } from '../lib/gemini';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Send, Star, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ProductDetails } from './ProductDetails';
import { formatPrice } from '../lib/currency';

type Message = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    recommendations?: ProductRecommendation[];
    timestamp: Date;
};

type AskTabProps = {
    conversationId?: string;
};

export function AskTab({ conversationId }: AskTabProps) {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '0',
            role: 'assistant',
            content: "Hi! I'm your shopping assistant. Tell me what you're looking for - describe the product, your budget, or any specific features you need, and I'll find the best options for you! 🛍️",
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentConversationId, setCurrentConversationId] = useState<string | undefined>(conversationId);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const hasLoadedConversation = useRef(false); // Track if we've loaded a conversation

    useEffect(() => {
        // Scroll to bottom when messages change
        if (scrollRef.current) {
            const scrollContainer = scrollRef.current.parentElement;
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        }
    }, [messages]);

    useEffect(() => {
        // Only load conversation if it's different and we haven't loaded it yet
        if (conversationId && conversationId !== currentConversationId) {
            loadConversation(conversationId);
            setCurrentConversationId(conversationId);
            hasLoadedConversation.current = true;
        } else if (conversationId === undefined && currentConversationId !== undefined) {
            // New chat - reset messages only when explicitly requested
            setMessages([
                {
                    id: '0',
                    role: 'assistant',
                    content: "Hi! I'm your shopping assistant. Tell me what you're looking for - describe the product, your budget, or any specific features you need, and I'll find the best options for you! 🛍️",
                    timestamp: new Date(),
                },
            ]);
            setCurrentConversationId(undefined);
            hasLoadedConversation.current = false;
        }
    }, [conversationId]);

    const loadConversation = async (convId: string) => {
        try {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('conversation_id', convId)
                .order('created_at', { ascending: true });

            if (error) throw error;

            if (data && data.length > 0) {
                const loadedMessages: Message[] = data.map((msg) => ({
                    id: msg.id,
                    role: msg.role,
                    content: msg.content,
                    recommendations: msg.recommendations,
                    timestamp: new Date(msg.created_at),
                }));
                setMessages(loadedMessages);
            }
        } catch (error) {
            console.error('Error loading conversation:', error);
        }
    };

    const createConversation = async (firstMessage: string) => {
        if (!user) return null;

        try {
            const title = firstMessage.slice(0, 50) + (firstMessage.length > 50 ? '...' : '');
            const { data, error } = await supabase
                .from('conversations')
                .insert({
                    user_id: user.id,
                    title,
                })
                .select()
                .single();

            if (error) throw error;
            return data.id;
        } catch (error) {
            console.error('Error creating conversation:', error);
            return null;
        }
    };

    const saveMessage = async (convId: string, message: Message) => {
        try {
            await supabase.from('messages').insert({
                conversation_id: convId,
                role: message.role,
                content: message.content,
                recommendations: message.recommendations,
            });

            // Update conversation updated_at
            await supabase
                .from('conversations')
                .update({ updated_at: new Date().toISOString() })
                .eq('id', convId);
        } catch (error) {
            console.error('Error saving message:', error);
        }
    };

    const handleProductClick = async (productId: string) => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', productId)
                .single();

            if (error) throw error;
            if (data) {
                setSelectedProduct(data);
            }
        } catch (error) {
            console.error('Error fetching product:', error);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || loading || !user) return;

        const userQuery = input.trim();
        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: userQuery,
            timestamp: new Date(),
        };

        // Clear input immediately
        setInput('');
        setLoading(true);

        // Reset textarea height
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }

        // Add user message to display immediately
        setMessages((prev) => [...prev, userMessage]);

        try {
            // Create or use existing conversation
            let convId = currentConversationId;
            if (!convId) {
                convId = await createConversation(userQuery);
                if (convId) {
                    setCurrentConversationId(convId);
                }
            }

            // Save user message
            if (convId) {
                await saveMessage(convId, userMessage);
            }

            // Fetch relevant products from Supabase
            const { data: products, error } = await supabase
                .from('products')
                .select('*')
                .limit(100);

            if (error) throw error;

            // Get AI recommendations
            const { recommendations, message: aiMessage } = await getProductRecommendations(
                userQuery,
                products as Product[]
            );

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: aiMessage,
                recommendations,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, assistantMessage]);

            // Save assistant message
            if (convId) {
                await saveMessage(convId, assistantMessage);
            }
        } catch (error) {
            console.error('Error:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "Sorry, I encountered an error while searching for products. Please try again!",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
        // Auto-resize textarea
        e.target.style.height = 'auto';
        e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px';
    };

    return (
        <div className="flex flex-col h-full">
            {/* Messages Area */}
            <ScrollArea className="flex-1 h-full">
                <div ref={scrollRef} className="space-y-4 max-w-3xl mx-auto px-4 py-4 pb-20">
                    {messages.map((message, index) => (
                        <div
                            key={message.id}
                            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            {message.role === 'assistant' && (
                                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 animate-in zoom-in duration-300 p-1">
                                    <img src="/logo.png" alt="Eferno" className="w-full h-full object-contain" />
                                </div>
                            )}

                            <div className={`flex flex-col gap-2 max-w-[80%]`}>
                                <div
                                    className={`rounded-2xl px-4 py-2 transition-all duration-200 hover:scale-[1.02] ${message.role === 'user'
                                            ? 'bg-primary text-primary-foreground shadow-sm'
                                            : 'bg-muted shadow-sm'
                                        }`}
                                >
                                    <div className="text-sm prose prose-sm dark:prose-invert max-w-none">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {message.content}
                                        </ReactMarkdown>
                                    </div>
                                </div>

                                {/* Product Recommendations */}
                                {message.recommendations && message.recommendations.length > 0 && (
                                    <div className="space-y-2">
                                        {message.recommendations.map((rec, recIndex) => (
                                            <motion.div
                                                key={rec.id}
                                                whileHover={{ scale: 1.02, y: -2 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleProductClick(rec.id)}
                                                className="bg-card border border-border rounded-lg p-3 hover:shadow-lg hover:border-primary/50 transition-all duration-200 cursor-pointer transform hover:-translate-y-0.5 animate-in fade-in slide-in-from-bottom-1"
                                                style={{ animationDelay: `${(recIndex + 1) * 100}ms` }}
                                            >
                                                <div className="flex items-start justify-between gap-2 mb-2">
                                                    <h4 className="font-medium text-sm line-clamp-1">{rec.name}</h4>
                                                    <div className="flex items-center gap-1 flex-shrink-0 bg-yellow-500/10 px-2 py-0.5 rounded-full">
                                                        <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                                                        <span className="text-xs font-medium">{rec.rating.toFixed(1)}</span>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                                                    {rec.reason}
                                                </p>
                                                <p className="text-sm font-semibold text-primary">
                                                    {formatPrice(rec.price)}
                                                </p>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {message.role === 'user' && (
                                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 animate-in zoom-in duration-300">
                                    <User className="w-5 h-5 text-secondary-foreground" />
                                </div>
                            )}
                        </div>
                    ))}

                    {loading && (
                        <div className="flex gap-3 justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 p-1">
                                <img src="/logo.png" alt="Eferno" className="w-full h-full object-contain" />
                            </div>
                            <div className="bg-muted rounded-2xl px-4 py-3 shadow-sm">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t border-border bg-background p-4">
                <div className="flex gap-2 items-end max-w-3xl mx-auto">
                    <Textarea
                        ref={textareaRef}
                        value={input}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyPress}
                        placeholder="Describe what you're looking for..."
                        disabled={loading}
                        className="flex-1 min-h-[44px] max-h-[150px] resize-none"
                        rows={1}
                    />
                    <Button
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                        size="icon"
                        className="flex-shrink-0 h-11 w-11"
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <ProductDetails
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />
        </div>
    );
}
