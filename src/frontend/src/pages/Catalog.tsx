import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { ProductCard } from "../components/ProductCard";
import { useAllProducts } from "../hooks/useProducts";

const ALL_SUBCATEGORIES: Record<string, string[]> = {
  women: ["sarees", "salwar kameez", "lehengas", "western"],
  men: ["kurtas", "sherwani", "western"],
  kids: ["kids wear"],
  all: [],
};

const SKELETON_KEYS = ["sk1", "sk2", "sk3", "sk4", "sk5", "sk6", "sk7", "sk8"];

export function Catalog() {
  const search = useSearch({ from: "/catalog" });
  const navigate = useNavigate();
  const activeCategory = (search as any).category || "all";
  const searchQuery = (search as any).q || "";

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const { data: allProducts = [], isLoading } = useAllProducts();

  const filtered = useMemo(() => {
    let result = allProducts;

    if (activeCategory && activeCategory !== "all") {
      result = result.filter((p) => p.category === activeCategory);
    }

    if (selectedSubcategory) {
      result = result.filter((p) => p.subcategory === selectedSubcategory);
    }

    const q = localSearch.toLowerCase();
    if (q) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.subcategory.toLowerCase().includes(q),
      );
    }

    return result;
  }, [allProducts, activeCategory, selectedSubcategory, localSearch]);

  const subcategories = ALL_SUBCATEGORIES[activeCategory] || [];

  const handleCategoryChange = (cat: string) => {
    setSelectedSubcategory("");
    navigate({ to: "/catalog", search: { category: cat, q: localSearch } });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({
      to: "/catalog",
      search: { category: activeCategory, q: localSearch },
    });
  };

  const categoryTabs = ["all", "women", "men", "kids"];

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-maroon capitalize">
          {activeCategory === "all"
            ? "All Products"
            : `${activeCategory}'s Collection`}
        </h1>
        <p className="text-muted-foreground mt-1">
          {filtered.length} products found
        </p>
      </div>

      {/* Category Tabs */}
      <div
        className="flex gap-2 mb-6 flex-wrap"
        data-ocid="catalog.category.tab"
      >
        {categoryTabs.map((cat) => (
          <Button
            key={cat}
            variant={activeCategory === cat ? "default" : "outline"}
            size="sm"
            onClick={() => handleCategoryChange(cat)}
            data-ocid={`catalog.${cat}.tab`}
            className={`capitalize ${
              activeCategory === cat
                ? "bg-maroon text-cream hover:bg-maroon/90"
                : "border-maroon text-maroon hover:bg-maroon hover:text-cream"
            }`}
          >
            {cat === "all" ? "All" : cat}
          </Button>
        ))}
      </div>

      {/* Search + Filter bar */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <form
          onSubmit={handleSearchSubmit}
          className="flex gap-2 flex-1 min-w-[240px]"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-9"
              data-ocid="catalog.search_input"
            />
          </div>
          <Button
            type="submit"
            className="bg-maroon text-cream hover:bg-maroon/90"
          >
            <Search className="h-4 w-4" />
          </Button>
        </form>

        <Button
          variant="outline"
          onClick={() => setShowFilters((v) => !v)}
          className="gap-2 border-maroon text-maroon hover:bg-maroon hover:text-cream"
          data-ocid="catalog.filter.toggle"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Subcategory filters */}
      {showFilters && subcategories.length > 0 && (
        <div className="flex gap-2 mb-6 flex-wrap bg-cream p-3 rounded-lg">
          <span className="text-sm font-medium text-muted-foreground self-center">
            Subcategory:
          </span>
          {subcategories.map((sub) => (
            <Badge
              key={sub}
              variant={selectedSubcategory === sub ? "default" : "outline"}
              className={`cursor-pointer capitalize ${
                selectedSubcategory === sub
                  ? "bg-maroon text-cream"
                  : "border-maroon text-maroon hover:bg-maroon hover:text-cream"
              }`}
              onClick={() =>
                setSelectedSubcategory(selectedSubcategory === sub ? "" : sub)
              }
            >
              {sub}
            </Badge>
          ))}
          {selectedSubcategory && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedSubcategory("")}
              className="text-xs gap-1"
            >
              <X className="h-3 w-3" /> Clear
            </Button>
          )}
        </div>
      )}

      {/* Product Grid */}
      {isLoading ? (
        <div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
          data-ocid="catalog.loading_state"
        >
          {SKELETON_KEYS.map((key) => (
            <div key={key} className="space-y-3">
              <Skeleton className="aspect-[3/4] rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20" data-ocid="catalog.empty_state">
          <p className="text-6xl mb-4">🔍</p>
          <h3 className="font-display text-xl font-semibold text-maroon mb-2">
            No products found
          </h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your filters or search query.
          </p>
          <Button
            onClick={() => {
              setLocalSearch("");
              setSelectedSubcategory("");
              handleCategoryChange("all");
            }}
            className="bg-maroon text-cream hover:bg-maroon/90"
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
          data-ocid="catalog.list"
        >
          {filtered.map((product, i) => (
            <ProductCard
              key={product.id.toString()}
              product={product}
              index={i + 1}
            />
          ))}
        </div>
      )}
    </main>
  );
}
