import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Bot, User } from "lucide-react";
import { ProductCard } from "./ProductCard";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  description: string;
  category?: string;
  availability?: string;
  specs?: string[];
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  products?: Product[];
  productLinks?: { productId: string; text: string }[];
}

interface ChatMessageProps {
  message: Message;
  onProductClick?: (productId: string) => void;
}

export function ChatMessage({ message, onProductClick }: ChatMessageProps) {
  const isUser = message.role === "user";

  const renderContent = () => {
    if (!message.productLinks || message.productLinks.length === 0) {
      return <p className="whitespace-pre-wrap">{message.content}</p>;
    }

    // Split content by product links and make them clickable
    let content = message.content;
    const parts: (string | { productId: string; text: string })[] = [];
    
    message.productLinks.forEach((link) => {
      const index = content.indexOf(link.text);
      if (index !== -1) {
        if (index > 0) {
          parts.push(content.substring(0, index));
        }
        parts.push(link);
        content = content.substring(index + link.text.length);
      }
    });
    
    if (content.length > 0) {
      parts.push(content);
    }

    return (
      <p className="whitespace-pre-wrap">
        {parts.map((part, idx) => {
          if (typeof part === "string") {
            return part;
          }
          return (
            <button
              key={idx}
              onClick={() => onProductClick?.(part.productId)}
              className="text-blue-400 hover:text-blue-300 underline cursor-pointer"
            >
              {part.text}
            </button>
          );
        })}
      </p>
    );
  };

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"} mb-4`}>
      <Avatar className="w-8 h-8 flex-shrink-0">
        {isUser ? (
          <>
            <AvatarFallback className="bg-primary">
              <User className="w-4 h-4 text-primary-foreground" />
            </AvatarFallback>
          </>
        ) : (
          <>
            <AvatarFallback className="bg-primary">
              <Bot className="w-4 h-4 text-primary-foreground" />
            </AvatarFallback>
          </>
        )}
      </Avatar>

      <div className={`flex-1 ${isUser ? "flex justify-end" : ""}`}>
        <div
          className={`rounded-2xl px-4 py-2 max-w-[85%] ${
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground"
          }`}
        >
          {renderContent()}
        </div>

        {message.products && message.products.length > 0 && (
          <div className="mt-3 space-y-2">
            {message.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}