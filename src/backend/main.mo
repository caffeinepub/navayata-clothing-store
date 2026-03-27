import Map "mo:core/Map";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Float "mo:core/Float";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  type ProductId = Nat;

  type Product = {
    id : ProductId;
    name : Text;
    price : Float;
    category : Text;
    subcategory : Text;
    imageUrl : Text;
    description : Text;
    sizes : [Text];
    inStock : Bool;
    createdAt : Int;
  };

  public type UserProfile = {
    name : Text;
  };

  module Product {
    public func compare(p1 : Product, p2 : Product) : Order.Order {
      Nat.compare(p1.id, p2.id);
    };
  };

  // Keep accessControlState to maintain upgrade compatibility
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let products = Map.empty<ProductId, Product>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var productCounter = 0;

  func getProductInternal(id : ProductId) : Product {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  // Public query functions
  public query func getAllProducts() : async [Product] {
    products.values().toArray().sort();
  };

  public query func getProductById(id : ProductId) : async ?Product {
    products.get(id);
  };

  public query func getProductsByCategory(category : Text) : async [Product] {
    let filtered = products.values().toArray().filter(func(product) { Text.equal(product.category, category) });
    filtered.sort();
  };

  public query func searchProducts(searchQuery : Text) : async [Product] {
    let loweredQuery = searchQuery.toLower();
    let matches = products.values().toArray().filter(
      func(product) {
        product.name.toLower().contains(#text loweredQuery) or product.subcategory.toLower().contains(#text loweredQuery);
      }
    );
    matches.sort();
  };

  // Mutation functions - no role check, any authenticated user
  public shared func addProduct(product : Product) : async ProductId {
    let newId = productCounter;
    productCounter += 1;
    let newProduct : Product = {
      product with
      id = newId;
      createdAt = Time.now();
    };
    products.add(newId, newProduct);
    newId;
  };

  public shared func updateProduct(product : Product) : async () {
    let existing = getProductInternal(product.id);
    let updatedProduct : Product = {
      product with
      createdAt = existing.createdAt;
    };
    products.add(product.id, updatedProduct);
  };

  public shared func deleteProduct(id : ProductId) : async () {
    ignore getProductInternal(id);
    products.remove(id);
  };

  public shared func toggleStock(id : ProductId) : async () {
    let product = getProductInternal(id);
    let updatedProduct : Product = {
      product with
      inStock = not product.inStock;
    };
    products.add(id, updatedProduct);
  };

  system func preupgrade() { };
  system func postupgrade() {
    if (products.isEmpty()) {
      initializeProducts();
    };
  };

  func initializeProducts() {
    let initialProducts : [Product] = [
      { id = 0; name = "Classic White Kurta"; price = 2999.0; category = "men"; subcategory = "kurtas"; imageUrl = "https://sample-ic-photo/0.png"; description = "Elegant white kurta for any occasion"; sizes = ["S", "M", "L", "XL"]; inStock = true; createdAt = Time.now() },
      { id = 1; name = "Silk Saree"; price = 4999.0; category = "women"; subcategory = "sarees"; imageUrl = "https://sample-ic-photo/1.png"; description = "Beautiful traditional silk saree"; sizes = []; inStock = true; createdAt = Time.now() },
      { id = 2; name = "Kids T-Shirt"; price = 799.0; category = "kids"; subcategory = "tshirts"; imageUrl = "https://sample-ic-photo/2.png"; description = "Fun printed t-shirt for kids"; sizes = ["2Y", "4Y", "6Y"]; inStock = true; createdAt = Time.now() },
      { id = 3; name = "Designer Sherwani"; price = 8999.0; category = "men"; subcategory = "sherwanis"; imageUrl = "https://sample-ic-photo/3.png"; description = "Premium designer sherwani for weddings"; sizes = ["M", "L", "XL", "XXL"]; inStock = true; createdAt = Time.now() },
      { id = 4; name = "Cotton Kurti"; price = 1499.0; category = "women"; subcategory = "kurtis"; imageUrl = "https://sample-ic-photo/4.png"; description = "Comfortable cotton kurti for daily wear"; sizes = ["S", "M", "L", "XL"]; inStock = true; createdAt = Time.now() },
      { id = 5; name = "Kids Ethnic Dress"; price = 1299.0; category = "kids"; subcategory = "dresses"; imageUrl = "https://sample-ic-photo/5.png"; description = "Colorful ethnic dress for girls"; sizes = ["2Y", "4Y", "6Y", "8Y"]; inStock = true; createdAt = Time.now() },
      { id = 6; name = "Men's Formal Shirt"; price = 1799.0; category = "men"; subcategory = "western"; imageUrl = "https://sample-ic-photo/6.png"; description = "Classic formal shirt for office wear"; sizes = ["S", "M", "L", "XL"]; inStock = true; createdAt = Time.now() },
      { id = 7; name = "Banarasi Saree"; price = 6999.0; category = "women"; subcategory = "sarees"; imageUrl = "https://sample-ic-photo/7.png"; description = "Traditional Banarasi silk saree"; sizes = []; inStock = true; createdAt = Time.now() },
      { id = 8; name = "Kids Kurta Pajama"; price = 999.0; category = "kids"; subcategory = "kurtas"; imageUrl = "https://sample-ic-photo/8.png"; description = "Traditional kurta pajama set for boys"; sizes = ["2Y", "4Y", "6Y", "8Y"]; inStock = true; createdAt = Time.now() },
      { id = 9; name = "Denim Jeans"; price = 2499.0; category = "men"; subcategory = "western"; imageUrl = "https://sample-ic-photo/9.png"; description = "Stylish denim jeans for casual wear"; sizes = ["30", "32", "34", "36"]; inStock = true; createdAt = Time.now() },
      { id = 10; name = "Anarkali Suit"; price = 3999.0; category = "women"; subcategory = "suits"; imageUrl = "https://sample-ic-photo/10.png"; description = "Elegant Anarkali suit with dupatta"; sizes = ["S", "M", "L", "XL"]; inStock = true; createdAt = Time.now() },
      { id = 11; name = "Kids Shorts Set"; price = 699.0; category = "kids"; subcategory = "western"; imageUrl = "https://sample-ic-photo/11.png"; description = "Comfortable shorts and t-shirt set"; sizes = ["2Y", "4Y", "6Y"]; inStock = true; createdAt = Time.now() },
      { id = 12; name = "Nehru Jacket"; price = 3499.0; category = "men"; subcategory = "jackets"; imageUrl = "https://sample-ic-photo/12.png"; description = "Classic Nehru jacket for ethnic look"; sizes = ["M", "L", "XL"]; inStock = true; createdAt = Time.now() },
      { id = 13; name = "Palazzo Pants"; price = 1299.0; category = "women"; subcategory = "western"; imageUrl = "https://sample-ic-photo/13.png"; description = "Trendy palazzo pants for comfort"; sizes = ["S", "M", "L", "XL"]; inStock = true; createdAt = Time.now() },
      { id = 14; name = "Kids Party Wear"; price = 1899.0; category = "kids"; subcategory = "party"; imageUrl = "https://sample-ic-photo/14.png"; description = "Fancy party wear outfit for special occasions"; sizes = ["2Y", "4Y", "6Y", "8Y"]; inStock = true; createdAt = Time.now() },
      { id = 15; name = "Linen Shirt"; price = 2199.0; category = "men"; subcategory = "western"; imageUrl = "https://sample-ic-photo/15.png"; description = "Breathable linen shirt for summer"; sizes = ["S", "M", "L", "XL"]; inStock = true; createdAt = Time.now() },
    ];
    for (product in initialProducts.values()) {
      products.add(product.id, product);
    };
    productCounter := initialProducts.size();
  };
};
