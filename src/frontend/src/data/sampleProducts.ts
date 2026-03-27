import type { Product } from "../backend.d.ts";

export const sampleProducts: Product[] = [
  // Women
  {
    id: 1n,
    name: "Banarasi Silk Saree",
    price: 2499,
    category: "women",
    subcategory: "sarees",
    imageUrl:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400",
    description:
      "Exquisite Banarasi silk saree with golden zari work. Perfect for weddings and festive occasions.",
    sizes: ["Free Size"],
    inStock: true,
    createdAt: 0n,
  },
  {
    id: 2n,
    name: "Embroidered Salwar Kameez",
    price: 1299,
    category: "women",
    subcategory: "salwar kameez",
    imageUrl:
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400",
    description:
      "Beautiful embroidered salwar kameez set with matching dupatta.",
    sizes: ["S", "M", "L", "XL"],
    inStock: true,
    createdAt: 0n,
  },
  {
    id: 3n,
    name: "Bridal Lehenga Choli",
    price: 4999,
    category: "women",
    subcategory: "lehengas",
    imageUrl:
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400",
    description:
      "Stunning bridal lehenga with heavy embroidery and stone work. A dream come true for brides.",
    sizes: ["S", "M", "L", "XL"],
    inStock: true,
    createdAt: 0n,
  },
  {
    id: 4n,
    name: "Anarkali Suit",
    price: 2299,
    category: "women",
    subcategory: "salwar kameez",
    imageUrl:
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400",
    description:
      "Elegant floor-length anarkali suit with dupatta. Perfect for festive gatherings.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    inStock: true,
    createdAt: 0n,
  },
  {
    id: 5n,
    name: "Western Floral Dress",
    price: 1599,
    category: "women",
    subcategory: "western",
    imageUrl:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400",
    description:
      "Trendy floral print western dress. Casual chic for everyday style.",
    sizes: ["XS", "S", "M", "L"],
    inStock: true,
    createdAt: 0n,
  },
  // Men
  {
    id: 6n,
    name: "Cotton Kurta Pajama",
    price: 899,
    category: "men",
    subcategory: "kurtas",
    imageUrl:
      "https://images.unsplash.com/photo-1604467794349-0b74285de7e7?w=400",
    description:
      "Comfortable cotton kurta pajama set. Ideal for daily wear and festive occasions.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    inStock: true,
    createdAt: 0n,
  },
  {
    id: 7n,
    name: "Designer Sherwani",
    price: 6999,
    category: "men",
    subcategory: "sherwani",
    imageUrl:
      "https://images.unsplash.com/photo-1614252235316-8c857196f400?w=400",
    description:
      "Royal designer sherwani for weddings and special events. Crafted with premium fabric.",
    sizes: ["S", "M", "L", "XL"],
    inStock: true,
    createdAt: 0n,
  },
  {
    id: 8n,
    name: "Dhoti Kurta Set",
    price: 1499,
    category: "men",
    subcategory: "kurtas",
    imageUrl:
      "https://images.unsplash.com/photo-1604467794349-0b74285de7e7?w=400",
    description:
      "Traditional dhoti kurta set for festivals and religious occasions.",
    sizes: ["M", "L", "XL"],
    inStock: true,
    createdAt: 0n,
  },
  {
    id: 9n,
    name: "Casual Printed Shirt",
    price: 699,
    category: "men",
    subcategory: "western",
    imageUrl:
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400",
    description:
      "Stylish casual printed shirt for everyday wear. Soft cotton blend.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    inStock: true,
    createdAt: 0n,
  },
  {
    id: 10n,
    name: "Indo-Western Jacket",
    price: 2999,
    category: "men",
    subcategory: "western",
    imageUrl:
      "https://images.unsplash.com/photo-1520975954732-35dd22299614?w=400",
    description:
      "Trendy indo-western jacket for parties and events. A statement piece.",
    sizes: ["S", "M", "L", "XL"],
    inStock: true,
    createdAt: 0n,
  },
  // Kids
  {
    id: 11n,
    name: "Girls Party Frock",
    price: 699,
    category: "kids",
    subcategory: "kids wear",
    imageUrl:
      "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=400",
    description:
      "Beautiful party frock for little girls. Perfect for birthdays and special occasions.",
    sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"],
    inStock: true,
    createdAt: 0n,
  },
  {
    id: 12n,
    name: "Boys Kurta Pajama",
    price: 599,
    category: "kids",
    subcategory: "kids wear",
    imageUrl: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=400",
    description:
      "Cute ethnic kurta pajama for boys. Comfortable for festive wear.",
    sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"],
    inStock: true,
    createdAt: 0n,
  },
  {
    id: 13n,
    name: "Kids Ethnic Set",
    price: 899,
    category: "kids",
    subcategory: "kids wear",
    imageUrl:
      "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=400",
    description:
      "Adorable ethnic set for kids' festivals and family functions.",
    sizes: ["3-4Y", "5-6Y", "7-8Y"],
    inStock: true,
    createdAt: 0n,
  },
  {
    id: 14n,
    name: "Girls Lehenga Set",
    price: 999,
    category: "kids",
    subcategory: "kids wear",
    imageUrl:
      "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=400",
    description: "Mini lehenga set for little princesses at special occasions.",
    sizes: ["2-3Y", "4-5Y", "6-7Y"],
    inStock: true,
    createdAt: 0n,
  },
  {
    id: 15n,
    name: "Boys Casual Wear",
    price: 499,
    category: "kids",
    subcategory: "kids wear",
    imageUrl: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=400",
    description:
      "Comfortable daily wear for boys. Soft fabric for all-day comfort.",
    sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y"],
    inStock: true,
    createdAt: 0n,
  },
];
