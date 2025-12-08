import { DailyTip, Badge, Reward, Tier, EcoMilesAction } from '@/types/sustainx';

export const dailyTips: DailyTip[] = [
  { id: '1', title: 'Reusable Bags', content: 'Bring your own bags when shopping to reduce plastic waste by up to 500 bags per year!', category: 'plastic' },
  { id: '2', title: 'Water Conservation', content: 'Turn off the tap while brushing teeth to save up to 8 gallons of water daily.', category: 'water' },
  { id: '3', title: 'LED Lights', content: 'Switching to LED bulbs can save 75% more energy than incandescent lighting.', category: 'electricity' },
  { id: '4', title: 'Meal Planning', content: 'Plan your meals to reduce food waste. The average family throws away $1,500 of food yearly!', category: 'food' },
  { id: '5', title: 'Composting', content: 'Start composting food scraps to reduce landfill waste and create nutrient-rich soil.', category: 'food' },
  { id: '6', title: 'Refill Stations', content: 'Look for refill stations for household products to cut down on single-use plastic.', category: 'plastic' },
  { id: '7', title: 'Cold Wash', content: 'Washing clothes in cold water saves 90% of energy used for laundry.', category: 'electricity' },
  { id: '8', title: 'Shorter Showers', content: 'Reducing shower time by 2 minutes saves 10 gallons of water per shower.', category: 'water' },
];

export const badges: Badge[] = [
  { id: 'first-log', name: 'First Step', description: 'Log your first waste entry', icon: '🌱', earned: false },
  { id: 'week-streak', name: 'Week Warrior', description: 'Maintain a 7-day logging streak', icon: '🔥', earned: false },
  { id: 'recycler', name: 'Recycling Champion', description: 'Divert 10kg from landfill', icon: '♻️', earned: false },
  { id: 'water-saver', name: 'Water Guardian', description: 'Log water usage for 7 days', icon: '💧', earned: false },
  { id: 'eco-shopper', name: 'Conscious Consumer', description: 'Add 5 items to sustainable wishlist', icon: '🛒', earned: false },
  { id: 'diy-master', name: 'Upcycle Artist', description: 'Try 5 DIY suggestions', icon: '✨', earned: false },
];

export const recyclableItems: Record<string, { recyclable: boolean; material: string; tips: string }> = {
  'plastic bottle': { recyclable: true, material: 'plastic', tips: 'Rinse and remove cap before recycling' },
  'cardboard box': { recyclable: true, material: 'paper', tips: 'Flatten and remove tape' },
  'glass jar': { recyclable: true, material: 'glass', tips: 'Rinse clean, labels can stay' },
  'aluminum can': { recyclable: true, material: 'metal', tips: 'Rinse, no need to crush' },
  'plastic bag': { recyclable: false, material: 'plastic', tips: 'Return to store drop-off bins' },
  'styrofoam': { recyclable: false, material: 'plastic', tips: 'Check for special recycling programs' },
  'pizza box': { recyclable: false, material: 'paper', tips: 'Too greasy for recycling, compost instead' },
  'newspaper': { recyclable: true, material: 'paper', tips: 'Bundle together' },
  'tin can': { recyclable: true, material: 'metal', tips: 'Rinse and remove paper labels' },
  'milk carton': { recyclable: true, material: 'paper', tips: 'Rinse and flatten' },
};

export const diyIdeas = [
  { title: 'T-Shirt Tote Bag', materials: ['Old t-shirt', 'Scissors'], difficulty: 'Easy', time: '10 min' },
  { title: 'Glass Jar Organizer', materials: ['Glass jars', 'Paint', 'Labels'], difficulty: 'Easy', time: '15 min' },
  { title: 'Cardboard Drawer Dividers', materials: ['Cardboard boxes', 'Ruler', 'Cutter'], difficulty: 'Medium', time: '20 min' },
  { title: 'Plastic Bottle Planter', materials: ['Plastic bottle', 'Soil', 'Seeds'], difficulty: 'Easy', time: '15 min' },
  { title: 'Newspaper Gift Wrap', materials: ['Old newspapers', 'Twine'], difficulty: 'Easy', time: '5 min' },
  { title: 'Tin Can Pen Holder', materials: ['Tin cans', 'Paint', 'Decorations'], difficulty: 'Easy', time: '20 min' },
];

export const recyclingCenters = [
  { name: 'Green Earth Recycling', address: '123 Eco Street, Green City', types: ['Plastic', 'Paper', 'Glass'], phone: '555-0101' },
  { name: 'City Waste Management', address: '456 Sustainability Ave', types: ['Electronics', 'Batteries', 'Metal'], phone: '555-0102' },
  { name: 'EcoHub Drop-off', address: '789 Nature Lane', types: ['Textiles', 'Plastic', 'Cardboard'], phone: '555-0103' },
  { name: 'Community Recycling Center', address: '321 Earth Drive', types: ['All Materials'], phone: '555-0104' },
];

export const ecoProducts = [
  { name: 'Bamboo Toothbrush', category: 'Personal Care', ecoScore: 95, packaging: 'Minimal', material: 'Bamboo', durability: 'High' },
  { name: 'Steel Water Bottle', category: 'Lifestyle', ecoScore: 90, packaging: 'Recyclable', material: 'Stainless Steel', durability: 'Very High' },
  { name: 'Organic Cotton Bag', category: 'Shopping', ecoScore: 88, packaging: 'None', material: 'Organic Cotton', durability: 'High' },
  { name: 'Beeswax Food Wrap', category: 'Kitchen', ecoScore: 92, packaging: 'Paper', material: 'Beeswax & Cotton', durability: 'Medium' },
  { name: 'Shampoo Bar', category: 'Personal Care', ecoScore: 94, packaging: 'Paper Box', material: 'Natural Ingredients', durability: 'Medium' },
  { name: 'Reusable Silicone Bags', category: 'Kitchen', ecoScore: 85, packaging: 'Minimal', material: 'Food-grade Silicone', durability: 'Very High' },
];

// EcoMiles Point Values
export const ecoMilesPointValues: Record<EcoMilesAction, number> = {
  food_log: 10,
  water_log: 5,
  electricity_log: 5,
  plastic_log: 10,
  zero_waste_day: 20,
  recycle_check: 10,
  wishlist_add: 8,
  reusable_choice: 15,
};

export const ecoMilesActionLabels: Record<EcoMilesAction | 'redemption', string> = {
  food_log: 'Logged food waste',
  water_log: 'Logged water usage',
  electricity_log: 'Logged electricity usage',
  plastic_log: 'Logged plastic usage',
  zero_waste_day: 'Zero waste day bonus',
  recycle_check: 'Checked recyclability',
  wishlist_add: 'Added to eco wishlist',
  reusable_choice: 'Chose reusable alternative',
  redemption: 'Reward redemption',
};

// Rewards Catalog
export const rewardsCatalog: Reward[] = [
  // Physical Items
  { id: 'water-bottle', name: 'Reusable Water Bottle', description: 'Stainless steel insulated bottle', cost: 200, category: 'physical', icon: '🍶' },
  { id: 'tote-bag', name: 'Canvas Tote Bag', description: 'Eco-friendly shopping bag', cost: 150, category: 'physical', icon: '👜' },
  { id: 'bamboo-toothbrush', name: 'Bamboo Toothbrush Pack', description: 'Set of 4 bamboo toothbrushes', cost: 80, category: 'physical', icon: '🪥' },
  { id: 'lunchbox', name: 'Stainless Lunchbox', description: 'Durable food container', cost: 350, category: 'physical', icon: '🍱' },
  { id: 'beeswax-wrap', name: 'Beeswax Wrap Set', description: 'Reusable food wraps', cost: 120, category: 'physical', icon: '🐝' },
  // Digital Rewards
  { id: 'premium-theme', name: 'Premium Theme', description: 'Unlock dark nature theme', cost: 50, category: 'digital', icon: '🎨' },
  { id: 'ad-free', name: 'Ad-Free Mode', description: 'Remove all advertisements', cost: 100, category: 'digital', icon: '✨' },
  { id: 'sustainability-guide', name: 'Sustainability Guide PDF', description: 'Complete eco-living guide', cost: 30, category: 'digital', icon: '📚' },
  { id: 'special-badge', name: 'Special Badge', description: 'Exclusive profile badge', cost: 20, category: 'digital', icon: '🏅' },
  { id: 'eco-wallpaper', name: 'Eco Wallpaper Pack', description: 'Nature-themed wallpapers', cost: 25, category: 'digital', icon: '🖼️' },
  // Voucher Rewards
  { id: 'mobile-recharge', name: '₹20 Mobile Recharge', description: 'Prepaid mobile recharge voucher', cost: 150, category: 'voucher', icon: '📱' },
  { id: 'product-discount', name: '₹50 Off Sustainable Products', description: 'Discount on eco products', cost: 250, category: 'voucher', icon: '🏷️' },
  { id: 'electricity-discount', name: '5% Off Electricity Bill', description: 'Bill payment discount', cost: 200, category: 'voucher', icon: '⚡' },
  { id: 'grocery-voucher', name: '₹100 Organic Grocery', description: 'Organic store voucher', cost: 300, category: 'voucher', icon: '🥬' },
];

// Loyalty Tiers
export const loyaltyTiers: Tier[] = [
  { 
    id: 'green', 
    name: 'Green Tier', 
    minPoints: 0, 
    maxPoints: 499, 
    color: 'primary',
    icon: '🌿',
    perks: ['Access to basic rewards', 'Daily sustainability tips']
  },
  { 
    id: 'leaf', 
    name: 'Leaf Tier', 
    minPoints: 500, 
    maxPoints: 1499, 
    color: 'eco-leaf',
    icon: '🍃',
    perks: ['10% bonus on all points', 'Early access to new rewards', 'Monthly eco report']
  },
  { 
    id: 'tree', 
    name: 'Tree Tier', 
    minPoints: 1500, 
    maxPoints: 2999, 
    color: 'eco-forest',
    icon: '🌳',
    perks: ['20% bonus on all points', 'Exclusive rewards unlocked', 'Priority support', 'Quarterly eco gifts']
  },
  { 
    id: 'earth_guardian', 
    name: 'Earth Guardian', 
    minPoints: 3000, 
    maxPoints: Infinity, 
    color: 'eco-water',
    icon: '🌍',
    perks: ['30% bonus on all points', 'All rewards unlocked', 'VIP perks', 'Annual sustainability award', 'Featured in community']
  },
];
