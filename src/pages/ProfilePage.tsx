import { useState } from 'react';
import { ArrowLeft, User, Settings, History, Award, ChevronRight, Trash2, Gift, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useEcoMiles } from '@/hooks/useEcoMiles';
import { badges as defaultBadges } from '@/data/sustainabilityData';
import { UserProfile, Badge, WasteLog, WishlistItem, RecycleItem } from '@/types/sustainx';
import { EcoScoreRing } from '@/components/shared/EcoScoreRing';
import { BadgeDisplay } from '@/components/shared/BadgeDisplay';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

const defaultProfile: UserProfile = {
  name: 'Eco Warrior',
  email: '',
  joinDate: new Date().toISOString(),
  ecoScore: 0,
  streak: 0,
  badges: [],
};

export default function ProfilePage() {
  const [profile, setProfile] = useLocalStorage<UserProfile>('userProfile', defaultProfile);
  const [badges] = useLocalStorage<Badge[]>('badges', defaultBadges);
  const [wasteLogs] = useLocalStorage<WasteLog[]>('wasteLogs', []);
  const [wishlist] = useLocalStorage<WishlistItem[]>('wishlist', []);
  const [recycleItems] = useLocalStorage<RecycleItem[]>('recycleItems', []);
  const [streak] = useLocalStorage<number>('streak', 0);
  const { totalPoints, currentTier, nextTier, tierProgress, transactions, redeemedRewards } = useEcoMiles();
  
  const [activeTab, setActiveTab] = useState<'profile' | 'badges' | 'history' | 'settings'>('profile');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editEmail, setEditEmail] = useState(profile.email);

  const handleSaveProfile = () => {
    setProfile(prev => ({ ...prev, name: editName, email: editEmail }));
    setIsEditDialogOpen(false);
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const totalLogs = wasteLogs.length;
  const totalRecycled = recycleItems.length;
  const totalWishlist = wishlist.length;
  const earnedBadges = badges.filter(b => b.earned).length;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <header className="bg-muted/50 px-5 pt-12 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <Link to="/" className="p-2 -ml-2 rounded-xl hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-foreground">Profile</h1>
            <p className="text-sm text-muted-foreground">Your sustainability journey</p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-card rounded-2xl p-5 shadow-soft border">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full gradient-eco flex items-center justify-center">
              <User className="w-8 h-8 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold">{profile.name}</h2>
              <p className="text-sm text-muted-foreground">
                Member since {new Date(profile.joinDate).toLocaleDateString()}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  🔥 {streak} day streak
                </span>
                <span className="text-xs bg-accent/10 text-accent-foreground px-2 py-1 rounded-full">
                  🏆 {earnedBadges} badges
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
          {[
            { id: 'profile', label: 'Overview', icon: User },
            { id: 'badges', label: 'Badges', icon: Award },
            { id: 'history', label: 'History', icon: History },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap',
                activeTab === tab.id 
                  ? 'bg-foreground text-background shadow-soft' 
                  : 'bg-card text-muted-foreground hover:bg-secondary'
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <div className="px-5 py-6">
        {activeTab === 'profile' && (
          <div className="space-y-6 animate-slide-up">
            {/* EcoMiles Card */}
            <Link to="/rewards" className="block">
              <div className="bg-gradient-to-r from-primary/10 to-eco-leaf/10 rounded-2xl p-4 border border-primary/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{currentTier.icon}</span>
                    <div>
                      <p className="font-semibold">{currentTier.name}</p>
                      <p className="text-sm text-muted-foreground">{totalPoints.toLocaleString()} EcoMiles</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Rewards redeemed</p>
                    <p className="text-xl font-bold text-primary">{redeemedRewards.length}</p>
                  </div>
                </div>
                {nextTier && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Progress to {nextTier.name}</span>
                      <span className="text-primary">{tierProgress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-eco-leaf rounded-full"
                        style={{ width: `${tierProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </Link>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-card rounded-2xl p-4 border text-center">
                <p className="text-3xl font-bold text-primary">{totalLogs}</p>
                <p className="text-sm text-muted-foreground">Total Logs</p>
              </div>
              <div className="bg-card rounded-2xl p-4 border text-center">
                <p className="text-3xl font-bold text-eco-forest">{totalRecycled}</p>
                <p className="text-sm text-muted-foreground">Items Recycled</p>
              </div>
              <div className="bg-card rounded-2xl p-4 border text-center">
                <p className="text-3xl font-bold text-accent">{totalWishlist}</p>
                <p className="text-sm text-muted-foreground">Wishlist Items</p>
              </div>
              <div className="bg-card rounded-2xl p-4 border text-center">
                <p className="text-3xl font-bold text-eco-water">{streak}</p>
                <p className="text-sm text-muted-foreground">Day Streak</p>
              </div>
            </div>

            {/* Quick Badge Preview */}
            <div className="bg-card rounded-2xl p-5 border">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold">Recent Badges</h3>
                <button 
                  onClick={() => setActiveTab('badges')}
                  className="text-sm text-primary font-medium flex items-center gap-1"
                >
                  View all <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <BadgeDisplay badges={badges} />
            </div>
          </div>

        )}

        {activeTab === 'badges' && (
          <div className="space-y-4 animate-slide-up">
            <p className="text-sm text-muted-foreground">
              Earn badges by tracking your sustainability journey!
            </p>
            <BadgeDisplay badges={badges} showAll />
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4 animate-slide-up">
            <div className="bg-card rounded-2xl p-4 border">
              <h3 className="font-semibold mb-3">Recent Activity</h3>
              <div className="space-y-3">
                {wasteLogs.slice(0, 5).map(log => (
                  <div key={log.id} className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="flex-1">Logged {log.type} usage</span>
                    <span className="text-muted-foreground">
                      {new Date(log.date).toLocaleDateString()}
                    </span>
                  </div>
                ))}
                {wasteLogs.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No activity yet. Start logging!
                  </p>
                )}
              </div>
            </div>

            <div className="bg-card rounded-2xl p-4 border">
              <h3 className="font-semibold mb-3">Saved Wishlist</h3>
              <div className="space-y-2">
                {wishlist.slice(0, 5).map(item => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <span>{item.name}</span>
                    <span className="text-primary font-medium">{item.ecoScore}</span>
                  </div>
                ))}
                {wishlist.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No items saved yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-4 animate-slide-up">
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogTrigger asChild>
                <button className="w-full bg-card rounded-2xl p-4 border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium">Edit Profile</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              </DialogTrigger>
              <DialogContent className="mx-4 rounded-2xl">
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input 
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input 
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleSaveProfile} className="w-full" variant="eco">
                    Save Changes
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <button
              onClick={handleClearData}
              className="w-full bg-destructive/10 rounded-2xl p-4 border border-destructive/20 flex items-center gap-3 text-destructive"
            >
              <Trash2 className="w-5 h-5" />
              <span className="font-medium">Clear All Data</span>
            </button>

            <div className="bg-muted/50 rounded-2xl p-4 mt-6">
              <p className="text-sm text-muted-foreground text-center">
                SustainX v1.0.0<br />
                Made with 💚 for a sustainable future
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
