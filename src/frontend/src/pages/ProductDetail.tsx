import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Check, MessageCircle, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "../context/CartContext";
import { useProductById } from "../hooks/useProducts";

export function ProductDetail() {
  const { id } = useParams({ from: "/product/$id" });
  const productId = BigInt(id);
  const { data: product, isLoading } = useProductById(productId);
  const { addItem } = useCart();

  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [imgError, setImgError] = useState(false);

  if (isLoading) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Skeleton className="aspect-[3/4] rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="max-w-5xl mx-auto px-4 py-20 text-center">
        <p className="text-6xl mb-4">😕</p>
        <h2 className="font-display text-2xl font-bold text-maroon mb-4">
          Product not found
        </h2>
        <Link to="/catalog" search={{ category: "all", q: "" }}>
          <Button className="bg-maroon text-cream hover:bg-maroon/90">
            Back to Catalog
          </Button>
        </Link>
      </main>
    );
  }

  const currentSize = selectedSize || product.sizes[0] || "Free Size";

  const handleAddToCart = () => {
    addItem({
      productId: product.id.toString(),
      name: product.name,
      imageUrl: product.imageUrl,
      price: product.price,
      size: currentSize,
      quantity,
    });
    toast.success(`${product.name} (${currentSize}) added to cart!`);
  };

  const handleWhatsAppOrder = () => {
    const message = [
      "🛍️ Product Enquiry from NAVAYATA",
      "",
      `Product: ${product.name}`,
      `Category: ${product.category} — ${product.subcategory}`,
      `Price: ₹${product.price.toLocaleString("en-IN")}`,
      `Size: ${currentSize}`,
      `Quantity: ${quantity}`,
      "",
      "Please confirm availability and delivery details.",
    ].join("\n");
    const url = `https://wa.me/918910883176?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-maroon transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link
          to="/catalog"
          search={{ category: product.category, q: "" }}
          className="hover:text-maroon transition-colors capitalize"
        >
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="relative rounded-2xl overflow-hidden aspect-[3/4] bg-muted shadow-card">
          {!imgError ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-cream">
              <span className="text-8xl">👗</span>
            </div>
          )}
          <Badge className="absolute top-3 left-3 bg-maroon text-cream capitalize">
            {product.category}
          </Badge>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-sm text-muted-foreground capitalize mb-1">
              {product.subcategory}
            </p>
            <h1 className="font-display text-3xl font-bold text-maroon">
              {product.name}
            </h1>
          </div>

          <p className="text-3xl font-bold text-maroon">
            ₹{product.price.toLocaleString("en-IN")}
          </p>

          <p className="text-foreground/80 leading-relaxed">
            {product.description}
          </p>

          {/* Size selector */}
          {product.sizes.length > 0 && (
            <div>
              <p className="font-medium text-sm mb-2">Select Size:</p>
              <div
                className="flex gap-2 flex-wrap"
                data-ocid="product.size.select"
              >
                {product.sizes.map((size) => (
                  <button
                    type="button"
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    data-ocid={`product.size.${size.replace(/[^a-z0-9]/gi, "_").toLowerCase()}`}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                      currentSize === size
                        ? "bg-maroon text-cream border-maroon"
                        : "border-border hover:border-maroon hover:text-maroon"
                    }`}
                  >
                    {currentSize === size && (
                      <Check className="inline h-3 w-3 mr-1" />
                    )}
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <p className="font-medium text-sm mb-2">Quantity:</p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 rounded-lg border border-border flex items-center justify-center hover:border-maroon text-lg font-bold"
              >
                −
              </button>
              <span className="w-8 text-center font-semibold">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-9 h-9 rounded-lg border border-border flex items-center justify-center hover:border-maroon text-lg font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3 mt-2">
            <Button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              data-ocid="product.add_to_cart.button"
              size="lg"
              className="bg-maroon hover:bg-maroon/90 text-cream gap-2"
            >
              <ShoppingCart className="h-5 w-5" />
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </Button>

            <Button
              onClick={handleWhatsAppOrder}
              disabled={!product.inStock}
              data-ocid="product.whatsapp.button"
              size="lg"
              variant="outline"
              className="border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white gap-2"
            >
              <MessageCircle className="h-5 w-5" />
              Order on WhatsApp
            </Button>
          </div>

          {/* Back link */}
          <Link
            to="/catalog"
            search={{ category: product.category, q: "" }}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-maroon transition-colors mt-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back to {product.category}'s
            collection
          </Link>
        </div>
      </div>
    </main>
  );
}
