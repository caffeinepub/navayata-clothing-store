import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer className="bg-maroon text-cream">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="font-display text-2xl font-bold tracking-widest text-cream mb-3">
              NAVAYATA
            </h3>
            <p className="text-cream/80 text-sm leading-relaxed max-w-sm">
              Your destination for elegant ethnic and western fusion clothing.
              Celebrating Indian craftsmanship for Men, Women &amp; Kids.
            </p>
            <p className="mt-4 text-gold text-sm font-medium">
              📞 WhatsApp: +91 8910883176
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-3 text-gold">
              Categories
            </h4>
            <ul className="space-y-2 text-sm text-cream/80">
              <li>
                <Link
                  to="/catalog"
                  search={{ category: "women", q: "" }}
                  className="hover:text-gold transition-colors"
                >
                  Women
                </Link>
              </li>
              <li>
                <Link
                  to="/catalog"
                  search={{ category: "men", q: "" }}
                  className="hover:text-gold transition-colors"
                >
                  Men
                </Link>
              </li>
              <li>
                <Link
                  to="/catalog"
                  search={{ category: "kids", q: "" }}
                  className="hover:text-gold transition-colors"
                >
                  Kids
                </Link>
              </li>
              <li>
                <Link
                  to="/catalog"
                  search={{ category: "all", q: "" }}
                  className="hover:text-gold transition-colors"
                >
                  All Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-3 text-gold">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-cream/80">
              <li>
                <Link to="/cart" className="hover:text-gold transition-colors">
                  Cart
                </Link>
              </li>
              <li>
                <Link
                  to="/checkout"
                  className="hover:text-gold transition-colors"
                >
                  Checkout
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-gold transition-colors">
                  Admin Panel
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-cream/20 mt-8 pt-6 text-center text-sm text-cream/60">
          <p>
            © {year}. Built with{" "}
            <Heart className="inline h-3.5 w-3.5 text-gold fill-gold" /> using{" "}
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
