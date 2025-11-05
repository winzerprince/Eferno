import { useState, useRef, useEffect } from "react";
import { ChatMessage, type Message, type Product } from "./ChatMessage";
import { MessageInput } from "./MessageInput";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { Clock, Trash2, X, Plus } from "lucide-react";
import { Card } from "./ui/card";
import { ProductFloatingWindow } from "./ProductFloatingWindow";

// All products database with full specs
const ALL_PRODUCTS: Record<string, Product> = {
  "1": {
    id: "1",
    name: "Sony WH-1000XM5",
    price: 349.99,
    rating: 4.8,
    description: "Industry-leading noise cancellation with crystal-clear sound quality. Up to 30 hours battery life with premium comfort.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzYxMjIwMzgzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Audio",
    availability: "In Stock",
    specs: ["Active Noise Cancellation", "30h Battery Life", "Bluetooth 5.2", "Multi-point connection", "Premium Sound Quality"],
  },
  "2": {
    id: "2",
    name: "Bose QuietComfort 45",
    price: 279.99,
    rating: 4.7,
    description: "Premium comfort and legendary Bose sound quality with advanced noise cancellation technology.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzYxMjIwMzgzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Audio",
    availability: "In Stock",
    specs: ["Noise Cancellation", "24h Battery", "USB-C Charging", "Foldable Design", "Comfortable Fit"],
  },
  "3": {
    id: "3",
    name: "Nike Air Zoom Pegasus 40",
    price: 129.99,
    rating: 4.6,
    description: "Responsive cushioning for everyday runs with enhanced durability and breathable comfort.",
    image: "https://images.unsplash.com/photo-1597892657493-6847b9640bac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydW5uaW5nJTIwc2hvZXN8ZW58MXx8fHwxNzYxMTU2NjY1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Footwear",
    availability: "In Stock",
    specs: ["React Foam", "Zoom Air", "Breathable Mesh", "Waffle Outsole", "Lightweight Design"],
  },
  "4": {
    id: "4",
    name: "Adidas Ultraboost 23",
    price: 189.99,
    rating: 4.8,
    description: "Maximum energy return with revolutionary Boost cushioning technology for ultimate comfort and performance.",
    image: "https://images.unsplash.com/photo-1597892657493-6847b9640bac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydW5uaW5nJTIwc2hvZXN8ZW58MXx8fHwxNzYxMTU2NjY1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Footwear",
    availability: "In Stock",
    specs: ["Boost Midsole", "Primeknit Upper", "Continental Rubber", "Torsion System", "Energy Return"],
  },
  "5": {
    id: "5",
    name: "MacBook Air M2",
    price: 1199.99,
    rating: 4.9,
    description: "Supercharged by M2 chip. Incredibly thin and light design with all-day battery life and stunning Retina display.",
    image: "https://images.unsplash.com/photo-1511385348-a52b4a160dc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBjb21wdXRlcnxlbnwxfHx8fDE3NjExNDAwODh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Computers",
    availability: "In Stock",
    specs: ["M2 Chip", "13.6\" Liquid Retina", "18h Battery", "8GB RAM", "256GB SSD"],
  },
  "6": {
    id: "6",
    name: "Dell XPS 13 Plus",
    price: 1099.99,
    rating: 4.7,
    description: "Stunning design with powerful Intel performance. Edge-to-edge InfinityEdge display for immersive viewing.",
    image: "https://images.unsplash.com/photo-1511385348-a52b4a160dc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBjb21wdXRlcnxlbnwxfHx8fDE3NjExNDAwODh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Computers",
    availability: "In Stock",
    specs: ["Intel Core i7", "13.4\" FHD+", "16GB RAM", "512GB SSD", "Windows 11"],
  },
  "7": {
    id: "7",
    name: "Apple Watch Series 9",
    price: 399.99,
    rating: 4.8,
    description: "Advanced health and fitness features with always-on Retina display and comprehensive activity tracking.",
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNofGVufDF8fHx8MTc2MTE3Njc4NXww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Wearables",
    availability: "In Stock",
    specs: ["S9 SiP", "Always-On Display", "ECG & Blood Oxygen", "50m Water Resistant", "Crash Detection"],
  },
  "8": {
    id: "8",
    name: "AirPods Pro (2nd gen)",
    price: 249.99,
    rating: 4.7,
    description: "Active noise cancellation with transparency mode, adaptive audio, and personalized spatial audio experience.",
    image: "https://images.unsplash.com/photo-1627989580309-bfaf3e58af6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGVhcmJ1ZHN8ZW58MXx8fHwxNzYxMTQ3NTEwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Audio",
    availability: "In Stock",
    specs: ["Active ANC", "Adaptive Audio", "30h Total Battery", "MagSafe Charging", "Spatial Audio"],
  },
};

interface Conversation {
  id: string;
  title: string;
  timestamp: Date;
  messages: Message[];
}

const COMPARISON_RESPONSES = [
  {
    trigger: ["compare headphones", "headphone comparison", "best headphones"],
    content: "I'd recommend comparing the Sony WH-1000XM5 vs Bose QuietComfort 45:\n\n• Sony WH-1000XM5 ($349.99) - Industry-leading ANC, 30h battery, rated 4.8/5\n• Bose QuietComfort 45 ($279.99) - Legendary comfort, 24h battery, rated 4.7/5\n\nThe Sony WH-1000XM5 offers superior noise cancellation and longer battery life, making it perfect for frequent travelers. However, the Bose QuietComfort 45 is $70 cheaper and many users prefer its comfort for extended wear.\n\nI'd recommend the Sony WH-1000XM5 if you prioritize top-tier ANC and battery life.",
    links: [
      { productId: "1", text: "Sony WH-1000XM5" },
      { productId: "2", text: "Bose QuietComfort 45" },
    ],
  },
  {
    trigger: ["compare shoes", "running shoe comparison", "nike vs adidas"],
    content: "Let me compare the Nike Air Zoom Pegasus 40 vs Adidas Ultraboost 23:\n\n• Nike Air Zoom Pegasus 40 ($129.99) - Responsive cushioning, 4.6/5 rating\n• Adidas Ultraboost 23 ($189.99) - Maximum energy return, 4.8/5 rating\n\nThe Adidas Ultraboost 23 offers superior comfort with its Boost technology and Continental rubber outsole, but it's $60 more expensive. The Nike Pegasus 40 is lighter and more affordable, making it great for daily training.\n\nFor serious runners prioritizing comfort, go with Adidas Ultraboost 23. For value and versatility, choose Nike Air Zoom Pegasus 40.",
    links: [
      { productId: "3", text: "Nike Air Zoom Pegasus 40" },
      { productId: "4", text: "Adidas Ultraboost 23" },
    ],
  },
  {
    trigger: ["compare laptops", "laptop comparison", "macbook vs dell"],
    content: "Here's a comparison of MacBook Air M2 vs Dell XPS 13 Plus:\n\n• MacBook Air M2 ($1,199.99) - M2 chip, 18h battery, macOS, 4.9/5 rating\n• Dell XPS 13 Plus ($1,099.99) - Intel i7, 16GB RAM, Windows 11, 4.7/5 rating\n\nThe MacBook Air M2 delivers exceptional battery life and performance-per-watt with the M2 chip, plus the macOS ecosystem. The Dell XPS 13 Plus offers more RAM (16GB vs 8GB) and runs Windows, at a $100 lower price point.\n\nI recommend the MacBook Air M2 for creators and those in the Apple ecosystem. Choose Dell XPS 13 Plus if you need Windows and more RAM.",
    links: [
      { productId: "5", text: "MacBook Air M2" },
      { productId: "6", text: "Dell XPS 13 Plus" },
    ],
  },
  {
    trigger: ["compare apple watch", "smartwatch comparison", "watch recommendation"],
    content: "The Apple Watch Series 9 ($399.99, 4.8/5) is the top choice for iPhone users:\n\n✓ S9 chip with always-on Retina display\n✓ Advanced health features (ECG, blood oxygen)\n✓ 50m water resistance\n✓ Crash detection and emergency SOS\n\nIt's unmatched in the Apple ecosystem with seamless integration, comprehensive fitness tracking, and life-saving health features. The investment is worth it for daily health monitoring and convenience.",
    links: [{ productId: "7", text: "Apple Watch Series 9" }],
  },
  {
    trigger: ["compare earbuds", "airpods", "wireless earbuds comparison"],
    content: "The AirPods Pro (2nd gen) at $249.99 (4.7/5 rating) offer:\n\n• Active noise cancellation with adaptive audio\n• Transparency mode for awareness\n• 30 hours total battery with MagSafe case\n• Personalized spatial audio\n\nThey're the best true wireless earbuds for iPhone users, with seamless switching between Apple devices and superior call quality. The adaptive audio automatically adjusts based on your environment.\n\nHighly recommended for Apple ecosystem users who want premium sound and ANC.",
    links: [{ productId: "8", text: "AirPods Pro (2nd gen)" }],
  },
];

const NORMAL_RESPONSES = [
  {
    trigger: ["hello", "hi", "hey"],
    content: "Hello! 👋 I'm your AI shopping assistant. I can help you:\n\n• Compare products and find the best deals\n• Get personalized recommendations\n• Answer questions about specifications\n\nTry asking me to compare headphones, laptops, or running shoes!",
  },
  {
    trigger: ["help", "what can you do"],
    content: "I can assist you with:\n\n✓ Product comparisons with detailed analysis\n✓ Price comparisons and recommendations\n✓ Specification breakdowns\n✓ Finding the best product for your needs\n\nJust ask me about any product category like headphones, laptops, shoes, smartwatches, or earbuds!",
  },
  {
    trigger: ["thank", "thanks"],
    content: "You're welcome! 😊 Is there anything else you'd like to know about our products? I'm here to help you make the best choice!",
  },
];

function getAIResponse(userMessage: string): Omit<Message, "id" | "role"> {
  const lowerMessage = userMessage.toLowerCase();

  // Check for comparison responses
  for (const response of COMPARISON_RESPONSES) {
    if (response.trigger.some((trigger) => lowerMessage.includes(trigger))) {
      return {
        content: response.content,
        productLinks: response.links,
      };
    }
  }

  // Check for normal responses
  for (const response of NORMAL_RESPONSES) {
    if (response.trigger.some((trigger) => lowerMessage.includes(trigger))) {
      return {
        content: response.content,
      };
    }
  }

  // Default response
  return {
    content: "I'd be happy to help you find products! Try asking me to compare headphones, laptops, running shoes, or other products. I can provide detailed comparisons with prices and recommendations.",
  };
}

export function AskTab() {
  const [currentMessages, setCurrentMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! 👋 I'm your AI shopping assistant. I can compare products, provide recommendations, and help you find the perfect item. Try asking me to compare headphones or laptops!",
    },
  ]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showRecent, setShowRecent] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
    };

    setCurrentMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const response = getAIResponse(content);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        ...response,
      };

      setCurrentMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 800);
  };

  const handleNewChat = () => {
    if (currentMessages.length > 1) {
      // Save current conversation
      const newConversation: Conversation = {
        id: Date.now().toString(),
        title: currentMessages[1]?.content || "New conversation",
        timestamp: new Date(),
        messages: currentMessages,
      };
      setConversations((prev) => [newConversation, ...prev]);
    }

    // Start new conversation
    setCurrentMessages([
      {
        id: Date.now().toString(),
        role: "assistant",
        content: "Hello! 👋 I'm your AI shopping assistant. I can compare products, provide recommendations, and help you find the perfect item. Try asking me to compare headphones or laptops!",
      },
    ]);
    setShowRecent(false);
  };

  const handleLoadConversation = (conversation: Conversation) => {
    setCurrentMessages(conversation.messages);
    setShowRecent(false);
  };

  const handleDeleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((conv) => conv.id !== id));
  };

  const handleProductClick = (productId: string) => {
    setSelectedProductId(productId);
  };

  if (showRecent) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h2>Recent Conversations</h2>
          <Button variant="ghost" size="icon" onClick={() => setShowRecent(false)}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-3">
            {conversations.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No recent conversations
              </div>
            ) : (
              conversations.map((conv) => (
                <Card
                  key={conv.id}
                  className="p-4 cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => handleLoadConversation(conv)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="truncate mb-1">{conv.title}</p>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span className="text-sm">
                          {conv.timestamp.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteConversation(conv.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-border">
          <Button onClick={handleNewChat} className="w-full">
            Start New Chat
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header - Grok/ChatGPT Style */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <Button variant="ghost" size="sm" onClick={() => setShowRecent(true)}>
          <Clock className="w-4 h-4 mr-2" />
          Recent
        </Button>
        <Button variant="ghost" size="sm" onClick={handleNewChat}>
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Chat Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1">
        <div className="px-4 py-6">
          {currentMessages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              onProductClick={handleProductClick}
            />
          ))}
          {isTyping && (
            <div className="flex gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-primary-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-1.5 h-1.5 bg-primary-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-1.5 h-1.5 bg-primary-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <MessageInput onSend={handleSendMessage} disabled={isTyping} />

      {/* Product Floating Window */}
      {selectedProductId && ALL_PRODUCTS[selectedProductId] && (
        <ProductFloatingWindow
          product={ALL_PRODUCTS[selectedProductId]}
          onClose={() => setSelectedProductId(null)}
        />
      )}
    </div>
  );
}
