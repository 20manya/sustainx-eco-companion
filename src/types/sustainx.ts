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
