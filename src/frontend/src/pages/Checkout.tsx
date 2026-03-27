import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "@tanstack/react-router";
import { MessageCircle, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useCart } from "../context/CartContext";

interface CheckoutForm {
  name: string;
  phone: string;
  address: string;
  pincode: string;
}

export function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState<CheckoutForm>({
    name: "",
    phone: "",
    address: "",
    pincode: "",
  });
  const [errors, setErrors] = useState<Partial<CheckoutForm>>({});

  const shipping = totalPrice >= 999 ? 0 : 99;
  const grandTotal = totalPrice + shipping;

  const validate = (): boolean => {
    const newErrors: Partial<CheckoutForm> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.phone.trim() || !/^[6-9]\d{9}$/.test(form.phone))
      newErrors.phone = "Enter a valid 10-digit mobile number";
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.pincode.trim() || !/^\d{6}$/.test(form.pincode))
      newErrors.pincode = "Enter a valid 6-digit pincode";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof CheckoutForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const itemsList = items
      .map(
        (item) =>
          `• ${item.name} | Size: ${item.size} | Qty: ${item.quantity} | ₹${(item.price * item.quantity).toLocaleString("en-IN")}`,
      )
      .join("\n");

    const message = [
      "🛍️ New Order from NAVAYATA",
      "",
      `Customer: ${form.name}`,
      `Phone: ${form.phone}`,
      `Address: ${form.address}, ${form.pincode}`,
      "",
      "Order Items:",
      itemsList,
      "",
      `Total: ₹${grandTotal.toLocaleString("en-IN")}`,
      "Payment: Cash on Delivery",
    ].join("\n");

    const url = `https://wa.me/918910883176?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
    clearCart();
    navigate({ to: "/" });
  };

  if (items.length === 0) {
    return (
      <main
        className="max-w-xl mx-auto px-4 py-20 text-center"
        data-ocid="checkout.empty_state"
      >
        <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
        <h2 className="font-display text-xl font-bold text-maroon mb-2">
          Cart is empty
        </h2>
        <Link to="/catalog" search={{ category: "all", q: "" }}>
          <Button className="bg-maroon text-cream hover:bg-maroon/90">
            Go Shopping
          </Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-bold text-maroon mb-6">
        Checkout
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Form */}
        <div className="md:col-span-2">
          <form
            onSubmit={handlePlaceOrder}
            className="space-y-5"
            noValidate
            data-ocid="checkout.dialog"
          >
            <div className="bg-card rounded-xl shadow-card p-6">
              <h2 className="font-display text-xl font-semibold text-maroon mb-4">
                Delivery Details
              </h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="mt-1"
                    data-ocid="checkout.name.input"
                  />
                  {errors.name && (
                    <p
                      className="text-destructive text-xs mt-1"
                      data-ocid="checkout.name_error"
                    >
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    className="mt-1"
                    data-ocid="checkout.phone.input"
                  />
                  {errors.phone && (
                    <p
                      className="text-destructive text-xs mt-1"
                      data-ocid="checkout.phone_error"
                    >
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="address">Delivery Address *</Label>
                  <Input
                    id="address"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="House no., Street, Area, City"
                    className="mt-1"
                    data-ocid="checkout.address.input"
                  />
                  {errors.address && (
                    <p
                      className="text-destructive text-xs mt-1"
                      data-ocid="checkout.address_error"
                    >
                      {errors.address}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="pincode">Pincode *</Label>
                  <Input
                    id="pincode"
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    placeholder="6-digit pincode"
                    maxLength={6}
                    className="mt-1"
                    data-ocid="checkout.pincode.input"
                  />
                  {errors.pincode && (
                    <p
                      className="text-destructive text-xs mt-1"
                      data-ocid="checkout.pincode_error"
                    >
                      {errors.pincode}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-card rounded-xl shadow-card p-6">
              <h2 className="font-display text-xl font-semibold text-maroon mb-3">
                Payment Method
              </h2>
              <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
                <div>
                  <p className="font-semibold text-green-800">
                    Cash on Delivery
                  </p>
                  <p className="text-xs text-green-600">
                    Pay when you receive your order
                  </p>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              data-ocid="checkout.submit_button"
              size="lg"
              className="w-full bg-[#25D366] hover:bg-[#20b558] text-white gap-2 font-semibold"
            >
              <MessageCircle className="h-5 w-5" />
              Place Order via WhatsApp
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-card rounded-xl shadow-card p-5 h-fit">
          <h2 className="font-display text-lg font-bold text-maroon mb-4">
            Your Order
          </h2>

          <div className="space-y-3 max-h-60 overflow-y-auto">
            {items.map((item, i) => (
              <div
                key={`${item.productId}-${item.size}`}
                data-ocid={`checkout.item.${i + 1}`}
                className="flex gap-3"
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-12 h-14 rounded-lg object-cover bg-muted"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Size: {item.size} × {item.quantity}
                  </p>
                  <p className="text-sm font-bold text-maroon">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-3" />

          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>₹{totalPrice.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className="text-green-600">
                {shipping === 0 ? "Free" : `₹${shipping}`}
              </span>
            </div>
          </div>

          <Separator className="my-2" />

          <div className="flex justify-between font-bold">
            <span>Grand Total</span>
            <span className="text-maroon text-lg">
              ₹{grandTotal.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
