export const MOCK_PRODUCTS = [
  {
    id: "pop-1",
    name: "Pepperoni Pizza Slice",
    description:
      "Classic hand-tossed pizza with rich tomato sauce, mozzarella cheese, and spicy pepperoni.",
    price: 1200,
    image_url: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800",
    seller_id: "seller-1",
    seller_name: "Pizza Palace",
    category: "Popular",
    sizes: [
      { label: "Regular", price: 0 },
      { label: "Large", price: 500 },
    ],
  },
  {
    id: "pop-2",
    name: "Fried Rice Combo",
    description:
      "Nigerian-style fried rice with mixed vegetables, chicken, and plantain.",
    price: 1500,
    image_url: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800",
    seller_id: "seller-1",
    seller_name: "Mama Cass",
    category: "Popular",
    sizes: [
      { label: "Regular", price: 0 },
      { label: "Family", price: 2000 },
    ],
  },
  {
    id: "pop-3",
    name: "Chicken Shawarma",
    description:
      "Tender marinated chicken wrapped in warm pita with garlic sauce and fresh veggies.",
    price: 1800,
    image_url: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800",
    seller_id: "seller-2",
    seller_name: "Shawarma Express",
    category: "Popular",
    sizes: [
      { label: "Regular", price: 0 },
      { label: "Large", price: 500 },
    ],
  },
  {
    id: "flash-1",
    name: "Jollof Rice & Chicken",
    description:
      "Smoky party jollof rice served with grilled chicken and coleslaw.",
    price: 1500,
    image_url: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800",
    seller_id: "seller-1",
    seller_name: "Mama Cass",
    category: "Flash Deals",
    sizes: [
      { label: "Regular", price: 0 },
      { label: "Family", price: 2000 },
    ],
  },
  {
    id: "flash-2",
    name: "Jollof Rice Combo",
    description:
      "Smoky party jollof rice served with fried chicken, fried plantain, and coleslaw.",
    price: 1800,
    image_url: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800",
    seller_id: "seller-2",
    seller_name: "Mama Cass",
    category: "Flash Deals",
    sizes: [
      { label: "Regular", price: 0 },
      { label: "Family", price: 2000 },
    ],
  },
  {
    id: "cl-1",
    name: "Meat Pie",
    description:
      "Flaky pastry filled with seasoned minced meat, potatoes, and carrots.",
    price: 500,
    image_url: "https://images.unsplash.com/photo-1606101273945-e9eba91eb11c?w=800",
    seller_id: "seller-1",
    seller_name: "Mama Cass",
    category: "Clearance",
    sizes: [{ label: "Regular", price: 0 }],
  },
  {
    id: "cl-2",
    name: "Puff Puff (6 pcs)",
    description:
      "Soft and fluffy deep-fried dough balls, dusted with powdered sugar.",
    price: 400,
    image_url: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800",
    seller_id: "seller-2",
    seller_name: "Mama Cass",
    category: "Clearance",
    sizes: [{ label: "Regular", price: 0 }],
  },
];

export const MOCK_CATEGORIES = [
  { id: "cat-1", name: "Food", icon: "UtensilsCrossed" },
  { id: "cat-2", name: "Groceries", icon: "ShoppingBasket" },
  { id: "cat-3", name: "Drinks", icon: "Coffee" },
  { id: "cat-4", name: "Snacks", icon: "Cookie" },
  { id: "cat-5", name: "Pharmacy", icon: "Heart" },
];

export const MOCK_ORDERS = [
  {
    id: "order-001",
    status: "delivered",
    total: 3000,
    delivery_fee: 500,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    items: [
      { name: "Pepperoni Pizza Slice", quantity: 2 },
      { name: "Fried Rice Combo", quantity: 1 },
    ],
    seller_name: "Pizza Palace",
  },
  {
    id: "order-002",
    status: "on_the_way",
    total: 1800,
    delivery_fee: 500,
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    items: [{ name: "Chicken Shawarma", quantity: 1 }],
    seller_name: "Shawarma Express",
  },
];

export const MOCK_DELIVERIES = [
  {
    id: "delivery-001",
    order_id: "order-001",
    status: "heading_to_seller",
    delivery_fee: 500,
    created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    orders: {
      id: "order-001",
      notes: "Extra spicy",
      delivery_address: "123 Campus Road",
      items: [{ name: "Jollof Rice" }, { name: "Fried Plantain" }],
    },
  },
];

export const MOCK_AGENT = {
  id: "agent-001",
  is_online: true,
  is_active: true,
  total_earnings: 45000,
  completed_deliveries: 23,
};
