import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { HttpAgent } from "@icp-sdk/core/agent";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Edit2,
  Loader2,
  LogIn,
  LogOut,
  PackageCheck,
  PackageX,
  Plus,
  Shield,
  Trash2,
  Upload,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../auth";
import type { Product } from "../backend.d.ts";
import { loadConfig } from "../config";
import { sampleProducts } from "../data/sampleProducts";
import { useActor } from "../hooks/useActor";
import { StorageClient } from "../utils/StorageClient";

const SKELETON_KEYS = ["sk1", "sk2", "sk3", "sk4", "sk5"];

const EMPTY_PRODUCT: Omit<Product, "id" | "createdAt"> = {
  name: "",
  price: 0,
  category: "women",
  subcategory: "sarees",
  imageUrl: "",
  description: "",
  sizes: [],
  inStock: true,
};

export function Admin() {
  const { isLoggedIn, isLoggingIn, login, logout } = useAuth();
  const { actor } = useActor();
  const qc = useQueryClient();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] =
    useState<Omit<Product, "id" | "createdAt">>(EMPTY_PRODUCT);
  const [sizesInput, setSizesInput] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<bigint | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [storageClient, setStorageClient] = useState<StorageClient | null>(
    null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadConfig().then((config) => {
      const agent = new HttpAgent({ host: config.backend_host });
      setStorageClient(
        new StorageClient(
          config.bucket_name,
          config.storage_gateway_url,
          config.backend_canister_id,
          config.project_id,
          agent,
        ),
      );
    });
  }, []);

  const { data: products = [], isLoading: productsLoading } = useQuery<
    Product[]
  >({
    queryKey: ["admin-products"],
    queryFn: async () => {
      if (!actor) return sampleProducts;
      try {
        const result = await actor.getAllProducts();
        return result.length > 0 ? result : sampleProducts;
      } catch {
        return sampleProducts;
      }
    },
    enabled: isLoggedIn && !!actor,
  });

  const addMutation = useMutation({
    mutationFn: async (product: Product) => {
      if (!actor) throw new Error("No actor");
      return actor.addProduct(product);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product added successfully!");
      setDialogOpen(false);
    },
    onError: () => toast.error("Failed to add product"),
  });

  const updateMutation = useMutation({
    mutationFn: async (product: Product) => {
      if (!actor) throw new Error("No actor");
      return actor.updateProduct(product);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product updated!");
      setDialogOpen(false);
    },
    onError: () => toast.error("Failed to update product"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteProduct(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted");
      setDeleteConfirmId(null);
    },
    onError: () => toast.error("Failed to delete product"),
  });

  const toggleMutation = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.toggleStock(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success("Stock status updated");
    },
    onError: () => toast.error("Failed to toggle stock"),
  });

  const openAdd = () => {
    setEditingProduct(null);
    setForm(EMPTY_PRODUCT);
    setSizesInput("");
    setDialogOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      price: product.price,
      category: product.category,
      subcategory: product.subcategory,
      imageUrl: product.imageUrl,
      description: product.description,
      sizes: product.sizes,
      inStock: product.inStock,
    });
    setSizesInput(product.sizes.join(", "));
    setDialogOpen(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !storageClient) return;

    setIsUploading(true);
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const { hash } = await storageClient.putFile(bytes);
      const url = await storageClient.getDirectURL(hash);
      setForm((f) => ({ ...f, imageUrl: url }));
      toast.success("Photo uploaded!");
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sizes = sizesInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const productData: Product = {
      ...form,
      sizes,
      id: editingProduct ? editingProduct.id : BigInt(Date.now()),
      createdAt: editingProduct ? editingProduct.createdAt : BigInt(Date.now()),
    };
    if (editingProduct) {
      updateMutation.mutate(productData);
    } else {
      addMutation.mutate(productData);
    }
  };

  if (!isLoggedIn) {
    return (
      <main className="max-w-md mx-auto px-4 py-20 text-center">
        <Shield className="h-16 w-16 mx-auto text-maroon/30 mb-4" />
        <h1 className="font-display text-3xl font-bold text-maroon mb-2">
          Admin Panel
        </h1>
        <p className="text-muted-foreground mb-6">
          Please login to access the admin panel.
        </p>
        <Button
          onClick={login}
          disabled={isLoggingIn}
          data-ocid="admin.login.primary_button"
          size="lg"
          className="bg-maroon text-cream hover:bg-maroon/90 gap-2"
        >
          <LogIn className="h-5 w-5" />
          {isLoggingIn ? "Logging in..." : "Login"}
        </Button>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-maroon">
            Admin Panel
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage NAVAYATA products
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={openAdd}
            data-ocid="admin.add_product.primary_button"
            className="bg-maroon text-cream hover:bg-maroon/90 gap-2"
          >
            <Plus className="h-4 w-4" /> Add Product
          </Button>
          <Button
            onClick={logout}
            variant="outline"
            data-ocid="admin.logout.button"
            className="gap-2"
          >
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>
      </div>

      {productsLoading ? (
        <div className="space-y-3" data-ocid="admin.loading_state">
          {SKELETON_KEYS.map((key) => (
            <Skeleton key={key} className="h-14 w-full" />
          ))}
        </div>
      ) : (
        <div
          className="bg-card rounded-xl shadow-card overflow-hidden"
          data-ocid="admin.table"
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product, i) => (
                <TableRow
                  key={product.id.toString()}
                  data-ocid={`admin.product.row.${i + 1}`}
                >
                  <TableCell>
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-12 h-14 object-cover rounded-lg bg-muted"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </TableCell>
                  <TableCell className="font-medium max-w-[180px] truncate">
                    {product.name}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="capitalize border-maroon text-maroon"
                    >
                      {product.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    ₹{product.price.toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        product.inStock
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                      variant="secondary"
                    >
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEdit(product)}
                        data-ocid={`admin.product.edit_button.${i + 1}`}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleMutation.mutate(product.id)}
                        data-ocid={`admin.product.toggle.${i + 1}`}
                        title={
                          product.inStock
                            ? "Mark out of stock"
                            : "Mark in stock"
                        }
                      >
                        {product.inStock ? (
                          <PackageX className="h-4 w-4 text-orange-500" />
                        ) : (
                          <PackageCheck className="h-4 w-4 text-green-500" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setDeleteConfirmId(product.id)}
                        data-ocid={`admin.product.delete_button.${i + 1}`}
                        className="hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add/Edit Product Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className="max-w-xl max-h-[90vh] overflow-y-auto"
          data-ocid="admin.product.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-maroon">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div>
              <Label>Product Name *</Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="e.g. Banarasi Silk Saree"
                required
                className="mt-1"
                data-ocid="admin.product.name.input"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Category *</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}
                >
                  <SelectTrigger
                    className="mt-1"
                    data-ocid="admin.product.category.select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="women">Women</SelectItem>
                    <SelectItem value="men">Men</SelectItem>
                    <SelectItem value="kids">Kids</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Subcategory *</Label>
                <Input
                  value={form.subcategory}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, subcategory: e.target.value }))
                  }
                  placeholder="e.g. sarees"
                  required
                  className="mt-1"
                  data-ocid="admin.product.subcategory.input"
                />
              </div>
            </div>

            <div>
              <Label>Price (₹) *</Label>
              <Input
                type="number"
                value={form.price || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, price: Number(e.target.value) }))
                }
                placeholder="e.g. 1299"
                required
                min={0}
                className="mt-1"
                data-ocid="admin.product.price.input"
              />
            </div>

            {/* Image upload section */}
            <div>
              <Label>Product Image *</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={form.imageUrl}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, imageUrl: e.target.value }))
                  }
                  placeholder="https://... or upload a photo"
                  required
                  className="flex-1"
                  data-ocid="admin.product.imageurl.input"
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={isUploading}
                  onClick={() => fileInputRef.current?.click()}
                  data-ocid="admin.product.upload_button"
                  className="shrink-0 border-maroon text-maroon hover:bg-maroon hover:text-cream gap-1.5"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Upload Photo
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Upload a photo from your device or paste an image URL
              </p>
              {form.imageUrl && (
                <img
                  src={form.imageUrl}
                  alt="Preview"
                  className="mt-2 h-20 w-auto rounded-lg object-cover border border-border"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                  onLoad={(e) => {
                    (e.target as HTMLImageElement).style.display = "block";
                  }}
                />
              )}
            </div>

            <div>
              <Label>Sizes (comma-separated)</Label>
              <Input
                value={sizesInput}
                onChange={(e) => setSizesInput(e.target.value)}
                placeholder="e.g. S, M, L, XL or Free Size"
                className="mt-1"
                data-ocid="admin.product.sizes.input"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Product description..."
                rows={3}
                className="mt-1"
                data-ocid="admin.product.description.textarea"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="inStock"
                checked={form.inStock}
                onChange={(e) =>
                  setForm((f) => ({ ...f, inStock: e.target.checked }))
                }
                data-ocid="admin.product.instock.checkbox"
                className="w-4 h-4 accent-maroon"
              />
              <Label htmlFor="inStock">In Stock</Label>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                data-ocid="admin.product.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={addMutation.isPending || updateMutation.isPending}
                data-ocid="admin.product.save_button"
                className="bg-maroon text-cream hover:bg-maroon/90"
              >
                {addMutation.isPending || updateMutation.isPending
                  ? "Saving..."
                  : editingProduct
                    ? "Update Product"
                    : "Add Product"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog
        open={!!deleteConfirmId}
        onOpenChange={() => setDeleteConfirmId(null)}
      >
        <DialogContent data-ocid="admin.delete.dialog">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-maroon">
              Delete Product?
            </DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            This action cannot be undone. Are you sure?
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmId(null)}
              data-ocid="admin.delete.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={() =>
                deleteConfirmId && deleteMutation.mutate(deleteConfirmId)
              }
              disabled={deleteMutation.isPending}
              data-ocid="admin.delete.confirm_button"
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
