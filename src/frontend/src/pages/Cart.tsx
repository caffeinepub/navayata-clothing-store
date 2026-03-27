import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";

export function Cart() {
  const { items, removeItem, updateQuantity, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <main
        className="max-w-3xl mx-auto px-4 py-20 text-center"
        data-ocid="cart.empty_state"
      >
        <ShoppingBag className="h-20 w-20 mx-auto text-muted-foreground/30 mb-4" />
        <h2 className="font-display text-2xl font-bold text-maroon mb-2">
          Your cart is empty
        </h2>
        <p className="text-muted-foreground mb-6">
          Looks like you haven't added anything yet.
        </p>
        <Link to="/catalog" search={{ category: "all", q: "" }}>
          <Button
            data-ocid="cart.shop.primary_button"
            className="bg-maroon text-cream hover:bg-maroon/90 gap-2"
          >
            <ShoppingBag className="h-4 w-4" /> Start Shopping
          </Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-bold text-maroon mb-6">
        Shopping Cart
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="md:col-span-2 space-y-4" data-ocid="cart.list">
          {items.map((item, i) => (
            <div
              key={`${item.productId}-${item.size}`}
              data-ocid={`cart.item.${i + 1}`}
              className="flex gap-4 bg-card rounded-xl p-4 shadow-card"
            >
              <div className="w-20 h-24 rounded-lg overflow-hidden bg-muted shrink-0">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='96'%3E%3Crect width='80' height='96' fill='%23f6f0e6'/%3E%3C/svg%3E";
                  }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">
                  {item.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Size: {item.size}
                </p>
                <p className="text-maroon font-bold mt-1">
                  ₹{item.price.toLocaleString("en-IN")}
                </p>

                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(
                        item.productId,
                        item.size,
                        item.quantity - 1,
                      )
                    }
                    data-ocid={`cart.decrease.${i + 1}`}
                    className="w-7 h-7 rounded border border-border flex items-center justify-center hover:border-maroon"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-6 text-center text-sm font-medium">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(
                        item.productId,
                        item.size,
                        item.quantity + 1,
                      )
                    }
                    data-ocid={`cart.increase.${i + 1}`}
                    className="w-7 h-7 rounded border border-border flex items-center justify-center hover:border-maroon"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-end justify-between">
                <button
                  type="button"
                  onClick={() => removeItem(item.productId, item.size)}
                  data-ocid={`cart.delete_button.${i + 1}`}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                  aria-label="Remove item"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <p className="font-bold text-foreground">
                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-card rounded-xl shadow-card p-5 h-fit">
          <h2 className="font-display text-lg font-bold text-maroon mb-4">
            Order Summary
          </h2>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)
              </span>
              <span>₹{totalPrice.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className="text-green-600">
                {totalPrice >= 999 ? "Free" : "₹99"}
              </span>
            </div>
          </div>

          <Separator className="my-3" />

          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-maroon">
              ₹
              {(totalPrice + (totalPrice >= 999 ? 0 : 99)).toLocaleString(
                "en-IN",
              )}
            </span>
          </div>

          <Link to="/checkout">
            <Button
              data-ocid="cart.checkout.primary_button"
              className="w-full mt-4 bg-maroon hover:bg-maroon/90 text-cream gap-2"
              size="lg"
            >
              Proceed to Checkout <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>

          <Link to="/catalog" search={{ category: "all", q: "" }}>
            <Button
              data-ocid="cart.continue_shopping.button"
              variant="outline"
              className="w-full mt-2 border-maroon text-maroon hover:bg-maroon hover:text-cream"
            >
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
