export interface WasteLog {
  id: string;
  type: 'food' | 'plastic' | 'water' | 'electricity';
  amount: number;
  unit: string;
  date: string;
  notes?: string;
}

export interface ExpiryItem {
  id: string;
  name: string;
  expiryDate: string;
  category: string;
  reminded: boolean;
}

export interface RecycleItem {
  id: string;
  name: string;
  recyclable: boolean;
  material: string;
  divertedWeight: number;
  date: string;
}

export interface WishlistItem {
  id: string;
  name: string;
  ecoScore: number;
  category: string;
  notes?: string;
  addedDate: string;
}

export interface UserProfile {
  name: string;
  email: string;
  joinDate: string;
  ecoScore: number;
  streak: number;
  badges: string[];
}

export interface DailyTip {
  id: string;
  title: string;
  content: string;
  category: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
}

// EcoMiles Types
export type EcoMilesAction = 
  | 'food_log'
  | 'water_log'
  | 'electricity_log'
  | 'plastic_log'
  | 'zero_waste_day'
  | 'recycle_check'
  | 'wishlist_add'
  | 'reusable_choice';

export interface EcoMilesTransaction {
  id: string;
  action: EcoMilesAction | 'redemption';
  points: number;
  description: string;
  date: string;
  rewardId?: string;
}

export interface EcoMilesState {
  totalPoints: number;
  transactions: EcoMilesTransaction[];
  redeemedRewards: string[];
}

export type RewardCategory = 'physical' | 'digital' | 'voucher';
export type TierLevel = 'green' | 'leaf' | 'tree' | 'earth_guardian';

export interface Reward {
  id: string;
  name: string;
  description: string;
  cost: number;
  category: RewardCategory;
  icon: string;
  image?: string;
}

export interface Tier {
  id: TierLevel;
  name: string;
  minPoints: number;
  maxPoints: number;
  color: string;
  icon: string;
  perks: string[];
}
