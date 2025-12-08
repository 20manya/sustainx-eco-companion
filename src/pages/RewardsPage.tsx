import { useState } from 'react';
import { ArrowLeft, Gift, Crown, History, Sparkles, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useEcoMiles } from '@/hooks/useEcoMiles';
import { loyaltyTiers, rewardsCatalog } from '@/data/sustainabilityData';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { Reward, RewardCategory } from '@/types/sustainx';
import { cn } from '@/lib/utils';

const categoryLabels: Record<RewardCategory, string> = {
  physical: 'Physical Items',
  digital: 'Digital Rewards',
  voucher: 'Vouchers',
};

export default function RewardsPage() {
  const { 
    totalPoints, 
    transactions, 
    redeemedRewards, 
    redeemReward, 
    currentTier, 
    nextTier, 
    tierProgress,
    todayEarned 
  } = useEcoMiles();
  
  const [activeTab, setActiveTab] = useState<'shop' | 'tiers' | 'history'>('shop');
  const [selectedCategory, setSelectedCategory] = useState<RewardCategory | 'all'>('all');

  const filteredRewards = selectedCategory === 'all' 
    ? rewardsCatalog 
    : rewardsCatalog.filter(r => r.category === selectedCategory);

  const handleRedeem = (reward: Reward) => {
    redeemReward(reward);
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <header className="gradient-eco px-5 pt-12 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <Link to="/" className="p-2 -ml-2 rounded-xl hover:bg-primary-foreground/10 transition-colors">
            <ArrowLeft className="w-5 h-5 text-primary-foreground" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-primary-foreground">EcoMiles Rewards</h1>
            <p className="text-sm text-primary-foreground/80">Earn & redeem sustainably</p>
          </div>
        </div>

        {/* Points Card */}
        <div className="bg-card/95 backdrop-blur-sm rounded-2xl p-5 shadow-medium">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-muted-foreground">Your Balance</p>
              <p className="text-3xl font-bold text-primary">{totalPoints.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">EcoMiles</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{currentTier.icon}</span>
                <span className="font-semibold text-foreground">{currentTier.name}</span>
              </div>
              <p className="text-xs text-muted-foreground">+{todayEarned} today</p>
            </div>
          </div>
          
          {nextTier && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Next: {nextTier.name}</span>
                <span className="text-primary font-medium">{nextTier.minPoints - totalPoints} pts away</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-eco-leaf rounded-full transition-all duration-500"
                  style={{ width: `${tierProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-4">
          {[
            { id: 'shop', label: 'Shop', icon: Gift },
            { id: 'tiers', label: 'Tiers', icon: Crown },
            { id: 'history', label: 'History', icon: History },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
                activeTab === tab.id 
                  ? 'bg-foreground text-background shadow-soft' 
                  : 'bg-card/80 text-foreground hover:bg-card'
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <div className="px-5 py-6">
        {activeTab === 'shop' && (
          <div className="space-y-4 animate-slide-up">
            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {['all', 'physical', 'digital', 'voucher'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat as typeof selectedCategory)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all',
                    selectedCategory === cat 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground hover:bg-secondary'
                  )}
                >
                  {cat === 'all' ? 'All Rewards' : categoryLabels[cat as RewardCategory]}
                </button>
              ))}
            </div>

            {/* Rewards Grid */}
            <div className="grid grid-cols-2 gap-3">
              {filteredRewards.map(reward => {
                const isRedeemed = redeemedRewards.includes(reward.id);
                const canAfford = totalPoints >= reward.cost;
                
                return (
                  <div 
                    key={reward.id} 
                    className={cn(
                      'bg-card rounded-2xl p-4 border shadow-soft transition-all',
                      isRedeemed && 'opacity-60'
                    )}
                  >
                    <div className="text-3xl mb-2">{reward.icon}</div>
                    <h4 className="font-semibold text-sm mb-1">{reward.name}</h4>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {reward.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className={cn(
                        'text-sm font-bold',
                        canAfford ? 'text-primary' : 'text-muted-foreground'
                      )}>
                        {reward.cost} pts
                      </span>
                      {isRedeemed ? (
                        <span className="flex items-center gap-1 text-xs text-primary font-medium">
                          <Check className="w-3 h-3" /> Redeemed
                        </span>
                      ) : (
                        <Button
                          variant={canAfford ? 'eco' : 'secondary'}
                          size="sm"
                          className="text-xs px-3 h-7"
                          disabled={!canAfford}
                          onClick={() => handleRedeem(reward)}
                        >
                          Redeem
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'tiers' && (
          <div className="space-y-4 animate-slide-up">
            <p className="text-sm text-muted-foreground">
              Earn more EcoMiles to unlock higher tiers and exclusive perks!
            </p>
            
            {loyaltyTiers.map((tier, index) => {
              const isCurrentTier = tier.id === currentTier.id;
              const isUnlocked = totalPoints >= tier.minPoints;
              
              return (
                <div 
                  key={tier.id}
                  className={cn(
                    'rounded-2xl p-5 border transition-all',
                    isCurrentTier 
                      ? 'bg-primary/10 border-primary/30 shadow-glow' 
                      : isUnlocked 
                      ? 'bg-card border-border' 
                      : 'bg-muted/50 border-border opacity-70'
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{tier.icon}</span>
                      <div>
                        <h3 className="font-bold">{tier.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {tier.maxPoints === Infinity 
                            ? `${tier.minPoints.toLocaleString()}+ pts` 
                            : `${tier.minPoints.toLocaleString()} - ${tier.maxPoints.toLocaleString()} pts`}
                        </p>
                      </div>
                    </div>
                    {isCurrentTier && (
                      <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-1.5">
                    {tier.perks.map((perk, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="text-muted-foreground">{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4 animate-slide-up">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Transaction History</h3>
              <span className="text-sm text-muted-foreground">{transactions.length} total</span>
            </div>
            
            <div className="space-y-2">
              {transactions.slice(0, 20).map(tx => (
                <div key={tx.id} className="flex items-center gap-3 p-3 bg-card rounded-xl border">
                  <div className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center',
                    tx.points > 0 ? 'bg-primary/10' : 'bg-accent/10'
                  )}>
                    {tx.points > 0 ? (
                      <Sparkles className="w-5 h-5 text-primary" />
                    ) : (
                      <Gift className="w-5 h-5 text-accent" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{tx.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(tx.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={cn(
                    'font-bold text-sm',
                    tx.points > 0 ? 'text-primary' : 'text-destructive'
                  )}>
                    {tx.points > 0 ? '+' : ''}{tx.points}
                  </span>
                </div>
              ))}
              {transactions.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Gift className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No transactions yet.</p>
                  <p className="text-sm">Start logging to earn EcoMiles!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}