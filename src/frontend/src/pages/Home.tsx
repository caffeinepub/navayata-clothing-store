import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { ProductCard } from "../components/ProductCard";
import { useAllProducts } from "../hooks/useProducts";

export function Home() {
  const { data: products = [] } = useAllProducts();
  const featured = products.slice(0, 6);

  const categories = [
    {
      label: "Women",
      value: "women",
      image: "/assets/generated/category-women.dim_600x400.jpg",
      description: "Sarees, Lehengas & More",
    },
    {
      label: "Men",
      value: "men",
      image: "/assets/generated/category-men.dim_600x400.jpg",
      description: "Kurtas, Sherwanis & More",
    },
    {
      label: "Kids",
      value: "kids",
      image: "/assets/generated/category-kids.dim_600x400.jpg",
      description: "Ethnic & Casual Wear",
    },
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-cream min-h-[80vh] flex items-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 w-full grid grid-cols-1 md:grid-cols-2 gap-8 py-16">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col justify-center gap-6"
          >
            <div className="flex items-center gap-2 text-gold">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-medium uppercase tracking-widest">
                New Collection 2026
              </span>
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-maroon leading-tight">
              Elegant Ethnic &amp; Western Fusion
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
              Discover exquisite Indian ethnic wear and contemporary western
              fashion. Crafted with love for Men, Women &amp; Kids.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link to="/catalog" search={{ category: "all", q: "" }}>
                <Button
                  data-ocid="hero.primary_button"
                  size="lg"
                  className="bg-maroon hover:bg-maroon/90 text-cream gap-2 px-8"
                >
                  Shop Now <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/catalog" search={{ category: "women", q: "" }}>
                <Button
                  data-ocid="hero.secondary_button"
                  size="lg"
                  variant="outline"
                  className="border-maroon text-maroon hover:bg-maroon hover:text-cream gap-2"
                >
                  View Women's
                </Button>
              </Link>
            </div>
            {/* Trust badges */}
            <div className="flex gap-6 text-sm text-muted-foreground flex-wrap">
              <span>✅ Cash on Delivery</span>
              <span>🚚 Free Shipping above ₹999</span>
              <span>💬 WhatsApp Support</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden md:flex items-center justify-center"
          >
            <div className="relative w-full max-w-md">
              <img
                src="/assets/generated/hero-couple.dim_700x600.jpg"
                alt="NAVAYATA Collection"
                className="w-full h-auto rounded-2xl shadow-hover object-cover"
              />
              <div className="absolute -bottom-4 -left-4 bg-gold text-foreground px-4 py-2 rounded-lg shadow-card font-medium text-sm">
                🌟 Premium Quality Fabrics
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Tiles */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="font-display text-4xl font-bold text-maroon mb-2">
              Shop by Category
            </h2>
            <p className="text-muted-foreground">
              Find the perfect outfit for every occasion
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.value}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Link
                  to="/catalog"
                  search={{ category: cat.value, q: "" }}
                  data-ocid={`category.${cat.value}.link`}
                >
                  <div className="group relative overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer shadow-card hover:shadow-hover transition-all duration-300">
                    <img
                      src={cat.image}
                      alt={cat.label}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-maroon/80 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 text-cream">
                      <h3 className="font-display text-2xl font-bold">
                        {cat.label}
                      </h3>
                      <p className="text-cream/80 text-sm">{cat.description}</p>
                      <span className="inline-flex items-center gap-1 mt-2 text-gold text-sm font-medium">
                        Shop Now <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-10"
          >
            <div>
              <h2 className="font-display text-4xl font-bold text-maroon mb-1">
                Featured Products
              </h2>
              <p className="text-muted-foreground">
                Handpicked for you this season
              </p>
            </div>
            <Link to="/catalog" search={{ category: "all", q: "" }}>
              <Button
                data-ocid="featured.view_all.button"
                variant="outline"
                className="border-maroon text-maroon hover:bg-maroon hover:text-cream gap-2 hidden md:flex"
              >
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featured.map((product, i) => (
              <ProductCard
                key={product.id.toString()}
                product={product}
                index={i + 1}
              />
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <Link to="/catalog" search={{ category: "all", q: "" }}>
              <Button
                data-ocid="featured.mobile_view_all.button"
                className="bg-maroon text-cream hover:bg-maroon/90"
              >
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Banner/CTA */}
      <section className="py-20 bg-maroon text-cream">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-4xl font-bold mb-4">
              Order via WhatsApp — It's Easy!
            </h2>
            <p className="text-cream/80 text-lg mb-8">
              Select your product, choose your size, and place your order on
              WhatsApp. Cash on Delivery available across India.
            </p>
            <Link to="/catalog" search={{ category: "all", q: "" }}>
              <Button
                data-ocid="cta.shop.primary_button"
                size="lg"
                className="bg-gold text-foreground hover:bg-gold/90 gap-2 font-semibold px-10"
              >
                Start Shopping
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
