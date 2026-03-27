import { useQuery } from "@tanstack/react-query";
import type { Product } from "../backend.d.ts";
import { sampleProducts } from "../data/sampleProducts";
import { useActor } from "./useActor";

export function useAllProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return sampleProducts;
      try {
        const result = await actor.getAllProducts();
        return result.length > 0 ? result : sampleProducts;
      } catch {
        return sampleProducts;
      }
    },
    enabled: !isFetching,
    placeholderData: sampleProducts,
  });
}

export function useProductsByCategory(category: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products", "category", category],
    queryFn: async () => {
      if (!actor) return sampleProducts.filter((p) => p.category === category);
      try {
        const result = await actor.getProductsByCategory(category);
        return result.length > 0
          ? result
          : sampleProducts.filter((p) => p.category === category);
      } catch {
        return sampleProducts.filter((p) => p.category === category);
      }
    },
    enabled: !isFetching,
  });
}

export function useProductById(id: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery<Product | null>({
    queryKey: ["products", id.toString()],
    queryFn: async () => {
      if (!actor) return sampleProducts.find((p) => p.id === id) ?? null;
      try {
        const result = await actor.getProductById(id);
        return result ?? sampleProducts.find((p) => p.id === id) ?? null;
      } catch {
        return sampleProducts.find((p) => p.id === id) ?? null;
      }
    },
    enabled: !isFetching,
  });
}

export function useSearchProducts(query: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products", "search", query],
    queryFn: async () => {
      if (!query.trim()) return [];
      if (!actor) {
        const q = query.toLowerCase();
        return sampleProducts.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q),
        );
      }
      try {
        return await actor.searchProducts(query);
      } catch {
        const q = query.toLowerCase();
        return sampleProducts.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q),
        );
      }
    },
    enabled: !isFetching && !!query.trim(),
  });
}
