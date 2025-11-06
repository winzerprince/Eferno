import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Minus,
  Plus,
  ShoppingCart,
  Package,
  Check,
  Star,
  Sparkles,
} from "lucide-react";
import { Button } from "./ui/button";
import { type Product } from "../lib/supabase";
import { formatPrice, ugxToUsd } from "../lib/currency";

type ProductDetailsProps = {
  product: Product | null;
  onClose: () => void;
};

export function ProductDetails({ product, onClose }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);
  const [includeDelivery, setIncludeDelivery] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  if (!product) return null;

  const DELIVERY_FEE_PERCENTAGE = 0.08; // 8% delivery fee
  // Convert UGX prices to USD
  const basePrice = ugxToUsd(product.price) * quantity;
  const deliveryFee = includeDelivery ? basePrice * DELIVERY_FEE_PERCENTAGE : 0;
  const totalPrice = basePrice + deliveryFee;

  const handlePurchase = async () => {
    setIsPurchasing(true);

    // Simulate purchase process
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsPurchasing(false);
    setIsPurchased(true);

    // Auto close after 3 seconds
    setTimeout(() => {
      onClose();
      setIsPurchased(false);
      setQuantity(1);
      setIncludeDelivery(false);
    }, 3000);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: "100%", opacity: 0, scale: 0.95 }}
          animate={{
            y: isMinimized ? "calc(100% - 80px)" : 0,
            opacity: 1,
            scale: 1,
          }}
          exit={{ y: "100%", opacity: 0, scale: 0.95 }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 400,
            duration: 0.3,
          }}
          className="relative w-full max-w-2xl bg-card border-t sm:border border-border sm:rounded-xl overflow-hidden shadow-2xl min-h-[90vh] sm:max-h-[85vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm border-b border-border p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.1 }}
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-lg hover:bg-muted transition-colors"
              >
                <Minus className="h-5 w-5" />
              </motion.button>
              <h2 className="font-semibold text-lg line-clamp-1">
                {product.name}
              </h2>
            </div>
            <motion.button
              whileHover={{ scale: 1.05, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.1 }}
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <X className="h-5 w-5" />
            </motion.button>
          </div>

          {/* Content */}
          <motion.div
            animate={{ opacity: isMinimized ? 0 : 1 }}
            transition={{ duration: 0.15 }}
            className="overflow-y-auto max-h-[calc(100vh-100px)] sm:max-h-[calc(85vh-140px)]"
          >
            {/* Product Image */}
            <div className="relative w-full aspect-video bg-muted overflow-hidden">
              <motion.img
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                src={product.image_url}
                alt={product.name}
                loading="eager"
                className="w-full h-full object-cover"
              />

              {/* Category Badge */}
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.2 }}
                className="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary/90 backdrop-blur-sm text-primary-foreground text-sm font-medium capitalize"
              >
                {product.category}
              </motion.div>

              {/* Rating Badge */}
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.2 }}
                className="absolute top-4 right-4 px-3 py-1 rounded-full bg-accent/90 backdrop-blur-sm text-accent-foreground text-sm font-medium flex items-center gap-1"
              >
                <Star className="h-4 w-4 fill-current" />
                {product.rating.toFixed(1)}
              </motion.div>
            </div>

            {/* Product Info */}
            <div className="p-6 space-y-6">
              {/* Price */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="text-3xl font-bold text-primary">
                  {formatPrice(basePrice)}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Base price: {formatPrice(product.price)} per unit
                </div>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-2"
              >
                <h3 className="font-semibold text-lg">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </motion.div>

              {/* Quantity Selector */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-3"
              >
                <h3 className="font-semibold text-lg">Quantity</h3>
                <div className="flex items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.1 }}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-5 w-5" />
                  </motion.button>

                  <div className="flex-1 text-center">
                    <motion.div
                      key={quantity}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.15 }}
                      className="text-2xl font-bold"
                    >
                      {quantity}
                    </motion.div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.1 }}
                    onClick={() => setQuantity(Math.min(99, quantity + 1))}
                    className="p-2 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={quantity >= 99}
                  >
                    <Plus className="h-5 w-5" />
                  </motion.button>
                </div>
              </motion.div>

              {/* Delivery Option */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.2 }}
                className="space-y-3 mt-5"
              >
                <h3 className="font-semibold text-lg">Delivery</h3>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.1 }}
                  onClick={() => setIncludeDelivery(!includeDelivery)}
                  className={`w-full px-4 py-5 rounded-xl border-2 transition-all ${
                    includeDelivery
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Package className="h-5 w-5" />
                      <div className="text-left">
                        <div className="font-medium">Include Delivery</div>
                        <div className="text-sm text-muted-foreground">
                          +{(DELIVERY_FEE_PERCENTAGE * 100).toFixed(0)}%
                          delivery fee
                        </div>
                      </div>
                    </div>
                    <motion.div
                      initial={false}
                      animate={{
                        scale: includeDelivery ? 1 : 0,
                        rotate: includeDelivery ? 0 : 180,
                      }}
                      className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
                    >
                      <Check className="h-4 w-4" />
                    </motion.div>
                  </div>
                </motion.button>
              </motion.div>

              {/* Price Breakdown */}
              {includeDelivery && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-2 text-sm"
                >
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>{formatPrice(basePrice)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Delivery Fee</span>
                    <span>{formatPrice(deliveryFee)}</span>
                  </div>
                  <div className="h-px bg-border" />
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-card/95 backdrop-blur-sm border-t border-border p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-muted-foreground">Total</span>
              <motion.span
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
                className="text-2xl font-bold text-primary"
              >
                {formatPrice(totalPrice)}
              </motion.span>
            </div>

            <motion.div
              whileHover={{ scale: isPurchasing || isPurchased ? 1 : 1.02 }}
              whileTap={{ scale: isPurchasing || isPurchased ? 1 : 0.98 }}
              transition={{ duration: 0.1 }}
            >
              <Button
                onClick={handlePurchase}
                disabled={isPurchasing || isPurchased}
                className="w-full h-12 text-lg font-semibold relative overflow-hidden"
              >
                <AnimatePresence mode="wait">
                  {isPurchasing ? (
                    <motion.div
                      key="purchasing"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex items-center justify-center gap-2"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <ShoppingCart className="h-5 w-5" />
                      </motion.div>
                      Processing...
                    </motion.div>
                  ) : isPurchased ? (
                    <motion.div
                      key="purchased"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      className="flex items-center justify-center gap-2"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 1.2, 1] }}
                        transition={{ duration: 0.5 }}
                      >
                        <Check className="h-5 w-5" />
                      </motion.div>
                      Purchase Successful!
                    </motion.div>
                  ) : (
                    <motion.div
                      key="buy"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      Buy Now
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Success confetti effect */}
                {isPurchased && (
                  <>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 2, opacity: 0 }}
                      transition={{ duration: 0.8 }}
                      className="absolute inset-0 bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 rounded-lg"
                    />
                    {/* Sparkles animation */}
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                        animate={{
                          scale: [0, 1, 0],
                          x: [0, (Math.random() - 0.5) * 150],
                          y: [0, (Math.random() - 0.5) * 150],
                          opacity: [1, 1, 0],
                        }}
                        transition={{
                          duration: 0.8,
                          delay: i * 0.05,
                          ease: "easeOut",
                        }}
                        className="absolute top-1/2 left-1/2"
                      >
                        <Sparkles className="w-4 h-4 text-primary" />
                      </motion.div>
                    ))}
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
