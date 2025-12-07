import { useState, useMemo } from 'react';
import { ArrowLeft, Star, Heart, Package, Leaf, TrendingUp, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ecoProducts } from '@/data/sustainabilityData';
import { WishlistItem } from '@/types/sustainx';
import { EcoScoreRing } from '@/components/shared/EcoScoreRing';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

export default function GreenCartPage() {
  const [wishlist, setWishlist] = useLocalStorage<WishlistItem[]>('wishlist', []);
  const [activeTab, setActiveTab] = useState<'products' | 'wishlist' | 'score'>('products');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', category: 'Personal Care', ecoScore: 80, notes: '' });

  const handleAddToWishlist = (product: typeof ecoProducts[0]) => {
    const exists = wishlist.find(w => w.name === product.name);
    if (exists) return;
    const item: WishlistItem = {
      id: Date.now().toString(),
      name: product.name,
      ecoScore: product.ecoScore,
      category: product.category,
      addedDate: new Date().toISOString(),
    };
    setWishlist(prev => [item, ...prev]);
  };

  const handleAddCustomItem = () => {
    if (!newItem.name) return;
    const item: WishlistItem = {
      id: Date.now().toString(),
      name: newItem.name,
      ecoScore: newItem.ecoScore,
      category: newItem.category,
      notes: newItem.notes,
      addedDate: new Date().toISOString(),
    };
    setWishlist(prev => [item, ...prev]);
    setNewItem({ name: '', category: 'Personal Care', ecoScore: 80, notes: '' });
    setIsDialogOpen(false);
  };

  const removeFromWishlist = (id: string) => {
    setWishlist(prev => prev.filter(w => w.id !== id));
  };

  const monthlyScore = useMemo(() => {
    if (wishlist.length === 0) return 0;
    return Math.round(wishlist.reduce((sum, item) => sum + item.ecoScore, 0) / wishlist.length);
  }, [wishlist]);

  const getPackagingBadge = (packaging: string) => {
    if (packaging === 'None' || packaging === 'Minimal') return { label: 'Low Waste', color: 'bg-primary/20 text-primary' };
    if (packaging === 'Recyclable' || packaging === 'Paper Box' || packaging === 'Paper') return { label: 'Recyclable', color: 'bg-eco-forest/20 text-eco-forest' };
    return { label: 'Standard', color: 'bg-muted text-muted-foreground' };
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <header className="bg-accent/10 px-5 pt-12 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <Link to="/" className="p-2 -ml-2 rounded-xl hover:bg-accent/10 transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-foreground">GreenCart</h1>
            <p className="text-sm text-muted-foreground">Sustainable shopping guide</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {[
            { id: 'products', label: 'Products' },
            { id: 'wishlist', label: `Wishlist (${wishlist.length})` },
            { id: 'score', label: 'Eco Score' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                activeTab === tab.id 
                  ? 'bg-accent text-accent-foreground shadow-soft' 
                  : 'bg-card text-muted-foreground hover:bg-secondary'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <div className="px-5 py-6">
        {activeTab === 'products' && (
          <div className="space-y-4 animate-slide-up">
            <p className="text-sm text-muted-foreground">
              Browse eco-friendly alternatives with ratings based on packaging, material & durability.
            </p>
            {ecoProducts.map((product, index) => {
              const badge = getPackagingBadge(product.packaging);
              const inWishlist = wishlist.some(w => w.name === product.name);
              return (
                <div key={index} className="bg-card rounded-2xl p-4 border shadow-soft">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold">{product.name}</h4>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full">
                      <Star className="w-3.5 h-3.5 text-primary fill-primary" />
                      <span className="text-sm font-bold text-primary">{product.ecoScore}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={cn('text-xs px-2 py-1 rounded-full', badge.color)}>
                      <Package className="w-3 h-3 inline mr-1" />
                      {badge.label}
                    </span>
                    <span className="text-xs bg-eco-leaf/10 text-eco-leaf px-2 py-1 rounded-full">
                      <Leaf className="w-3 h-3 inline mr-1" />
                      {product.material}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-muted-foreground">
                      Durability: <span className="font-medium">{product.durability}</span>
                    </p>
                    <Button
                      variant={inWishlist ? 'secondary' : 'soft'}
                      size="sm"
                      onClick={() => handleAddToWishlist(product)}
                      disabled={inWishlist}
                    >
                      <Heart className={cn('w-4 h-4', inWishlist && 'fill-current')} />
                      {inWishlist ? 'Added' : 'Wishlist'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'wishlist' && (
          <div className="space-y-4 animate-slide-up">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="eco" size="lg" className="w-full">
                  <Plus className="w-5 h-5" />
                  Add Custom Item
                </Button>
              </DialogTrigger>
              <DialogContent className="mx-4 rounded-2xl">
                <DialogHeader>
                  <DialogTitle>Add to Wishlist</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Product Name</Label>
                    <Input 
                      placeholder="e.g., Reusable straws"
                      value={newItem.name}
                      onChange={(e) => setNewItem(p => ({ ...p, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={newItem.category} onValueChange={(v) => setNewItem(p => ({ ...p, category: v }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {['Personal Care', 'Kitchen', 'Lifestyle', 'Shopping', 'Home'].map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Eco Score (1-100)</Label>
                    <Input 
                      type="number"
                      min={1}
                      max={100}
                      value={newItem.ecoScore}
                      onChange={(e) => setNewItem(p => ({ ...p, ecoScore: parseInt(e.target.value) || 50 }))}
                    />
                  </div>
                  <Button onClick={handleAddCustomItem} className="w-full" variant="eco">
                    Add to Wishlist
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <div className="space-y-3">
              {wishlist.map(item => (
                <div key={item.id} className="bg-card rounded-2xl p-4 border">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full">
                        <Star className="w-3.5 h-3.5 text-primary fill-primary" />
                        <span className="text-sm font-bold text-primary">{item.ecoScore}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive h-8 w-8"
                        onClick={() => removeFromWishlist(item.id)}
                      >
                        ✕
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {wishlist.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  Your wishlist is empty. Browse products to add items!
                </p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'score' && (
          <div className="space-y-6 animate-slide-up">
            <div className="bg-card rounded-2xl p-6 border shadow-soft text-center">
              <h3 className="font-semibold mb-4 flex items-center justify-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Monthly Eco Shopping Score
              </h3>
              <EcoScoreRing score={monthlyScore} size="lg" showLabel={false} className="mx-auto" />
              <p className="mt-4 text-muted-foreground text-sm">
                {monthlyScore >= 80 ? 'Excellent! You\'re a conscious consumer!' :
                 monthlyScore >= 60 ? 'Great choices! Keep going!' :
                 monthlyScore > 0 ? 'Good start! Add more eco-friendly items.' :
                 'Add items to your wishlist to see your score!'}
              </p>
            </div>

            <div className="bg-accent/10 rounded-2xl p-4 border border-accent/20">
              <h4 className="font-semibold mb-2">Shopping Tips</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Choose products with minimal or recyclable packaging</li>
                <li>• Look for durable items that last longer</li>
                <li>• Consider second-hand options when possible</li>
                <li>• Support local and sustainable brands</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
