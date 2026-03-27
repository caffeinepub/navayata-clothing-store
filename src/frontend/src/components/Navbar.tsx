import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Search, ShoppingCart, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "../context/CartContext";

export function Navbar() {
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({
        to: "/catalog",
        search: { q: searchQuery.trim(), category: "all" },
      });
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const categories = [
    { label: "All", value: "all" },
    { label: "Women", value: "women" },
    { label: "Men", value: "men" },
    { label: "Kids", value: "kids" },
  ];

  return (
    <header>
      {/* Top utility bar */}
      <div className="bg-maroon text-cream py-2 px-4 text-center text-sm font-body">
        ✨ Free shipping on orders above ₹999 | Cash on Delivery available
      </div>

      {/* Main nav */}
      <nav className="bg-offwhite border-b border-border shadow-xs">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" data-ocid="nav.link" className="shrink-0">
            <span className="font-display text-2xl font-bold tracking-widest text-maroon uppercase">
              NAVAYATA
            </span>
          </Link>

          {/* Desktop Category Links */}
          <div className="hidden md:flex items-center gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.value}
                to="/catalog"
                search={{ category: cat.value, q: "" }}
                data-ocid={`nav.${cat.value}.link`}
                className="font-body text-sm font-medium text-foreground hover:text-maroon transition-colors uppercase tracking-wide"
              >
                {cat.label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Search toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen((v) => !v)}
              data-ocid="nav.search_input"
              aria-label="Toggle search"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Cart */}
            <Link to="/cart" data-ocid="nav.cart.link">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                aria-label="Cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-maroon text-cream text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            {/* Admin */}
            <Link
              to="/admin"
              data-ocid="nav.admin.link"
              className="hidden md:block"
            >
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-maroon"
              >
                Admin
              </Button>
            </Link>

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="border-t border-border bg-cream px-4 py-3">
            <form
              onSubmit={handleSearch}
              className="max-w-2xl mx-auto flex gap-2"
            >
              <Input
                autoFocus
                placeholder="Search for sarees, kurtas, dresses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
                data-ocid="nav.search_input"
              />
              <Button
                type="submit"
                className="bg-maroon text-cream hover:bg-maroon/90"
              >
                Search
              </Button>
            </form>
          </div>
        )}

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-border bg-cream px-4 py-3 flex flex-col gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.value}
                to="/catalog"
                search={{ category: cat.value, q: "" }}
                data-ocid={`nav.mobile.${cat.value}.link`}
                onClick={() => setMenuOpen(false)}
                className="font-body text-sm font-medium text-foreground hover:text-maroon uppercase tracking-wide py-1"
              >
                {cat.label}
              </Link>
            ))}
            <Link
              to="/admin"
              data-ocid="nav.mobile.admin.link"
              onClick={() => setMenuOpen(false)}
              className="font-body text-sm text-muted-foreground hover:text-maroon py-1"
            >
              Admin Panel
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
