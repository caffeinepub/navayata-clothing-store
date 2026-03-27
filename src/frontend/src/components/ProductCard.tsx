import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "../backend.d.ts";
import { useCart } from "../context/CartContext";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 1 }: ProductCardProps) {
  const { addItem } = useCart();
  const [imgError, setImgError] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id.toString(),
      name: product.name,
      imageUrl: product.imageUrl,
      price: product.price,
      size: product.sizes[0] ?? "Free Size",
      quantity: 1,
    });
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <article
      data-ocid={`product.item.${index}`}
      className="group bg-card rounded-xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 flex flex-col"
    >
      <Link to="/product/$id" params={{ id: product.id.toString() }}>
        <div className="relative overflow-hidden aspect-[3/4] bg-muted">
          {!imgError ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => setImgError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-cream">
              <span className="text-4xl">👗</span>
            </div>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Badge variant="secondary" className="text-sm">
                Out of Stock
              </Badge>
            </div>
          )}
          <Badge className="absolute top-2 left-2 bg-maroon text-cream capitalize text-xs">
            {product.category}
          </Badge>
        </div>

        <div className="p-4 flex flex-col gap-2 flex-1">
          <p className="text-xs text-muted-foreground capitalize">
            {product.subcategory}
          </p>
          <h3 className="font-display font-semibold text-foreground line-clamp-2 leading-snug">
            {product.name}
          </h3>
          <p className="text-maroon font-bold text-lg mt-auto">
            ₹{product.price.toLocaleString("en-IN")}
          </p>
        </div>
      </Link>

      <div className="px-4 pb-4">
        <Button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          data-ocid={`product.add_to_cart.${index}`}
          className="w-full bg-maroon hover:bg-maroon/90 text-cream gap-2"
        >
          <ShoppingCart className="h-4 w-4" />
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </Button>
      </div>
    </article>
  );
}
