// Dummy catalogue. Images come from picsum.photos (seeded, so they stay stable).
export const categories = [
  { id: "electronics", name: "Electronics", sub: ["Audio", "Wearables", "Cameras"] },
  { id: "fashion", name: "Fashion", sub: ["Sneakers", "Bags", "Watches"] },
  { id: "home", name: "Home & Living", sub: ["Lighting", "Kitchen", "Decor"] },
  { id: "sports", name: "Sports", sub: ["Fitness", "Outdoor", "Cycling"] },
];

const base = [
  ["Aero Wireless Headphones", "electronics", 129, 4.7, 980],
  ["Pulse Smartwatch S2", "electronics", 199, 4.5, 740],
  ["Lumen 4K Action Camera", "electronics", 249, 4.3, 310],
  ["Orbit Bluetooth Speaker", "electronics", 79, 4.6, 1200],
  ["Stride Running Sneakers", "fashion", 94, 4.4, 860],
  ["Atlas Leather Backpack", "fashion", 119, 4.8, 520],
  ["Meridian Steel Watch", "fashion", 159, 4.2, 280],
  ["Drift Canvas Tote", "fashion", 34, 4.1, 650],
  ["Halo Desk Lamp", "home", 49, 4.6, 410],
  ["Cast Iron Skillet 12\"", "home", 39, 4.9, 1500],
  ["Terra Ceramic Vase Set", "home", 59, 4.0, 190],
  ["Brew Pour-Over Kit", "home", 45, 4.5, 370],
  ["Flex Resistance Bands", "sports", 24, 4.3, 900],
  ["Summit Trail Daypack", "sports", 89, 4.7, 440],
  ["Velo Cycling Helmet", "sports", 69, 4.4, 330],
  ["Core Yoga Mat Pro", "sports", 42, 4.6, 780],
];

export const products = base.map(([name, category, price, rating, sold], i) => ({
  id: i + 1,
  name,
  category,
  price,
  oldPrice: i % 3 === 0 ? Math.round(price * 1.25) : null,
  rating,
  reviews: Math.round(sold / 4),
  sold,
  stock: 5 + ((i * 7) % 30),
  description: `${name} is built with premium materials and tested for everyday use. Includes a 2-year warranty and free 30-day returns.`,
  images: [1, 2, 3, 4].map((n) => `https://picsum.photos/seed/shopwave-${i + 1}-${n}/700/700`),
}));

export const testimonials = [
  { name: "Amira K.", text: "Arrived in two days and the quality is better than the photos.", rating: 5 },
  { name: "Daniel R.", text: "Easy returns. Support answered my question within minutes.", rating: 5 },
  { name: "Priya S.", text: "Clear prices, no surprises at checkout. Will order again.", rating: 4 },
];

export const coupons = { SAVE10: 0.1, WELCOME20: 0.2 };
