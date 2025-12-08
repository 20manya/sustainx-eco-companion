import { useMemo, useEffect, useState } from 'react';
import { Leaf, Recycle, ShoppingBag, Flame, Sparkles, Gift, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useEcoMiles } from '@/hooks/useEcoMiles';
import { dailyTips, badges as defaultBadges } from '@/data/sustainabilityData';
import { EcoScoreRing } from '@/components/shared/EcoScoreRing';
import { CategoryCard } from '@/components/shared/CategoryCard';
import { BadgeDisplay } from '@/components/shared/BadgeDisplay';
import { WasteLog, Badge } from '@/types/sustainx';
import { cn } from '@/lib/utils';

export default function HomePage() {
  const [wasteLogs] = useLocalStorage<WasteLog[]>('wasteLogs', []);
  const [badges] = useLocalStorage<Badge[]>('badges', defaultBadges);
  const [streak] = useLocalStorage<number>('streak', 0);
  const { totalPoints, todayEarned, currentTier } = useEcoMiles();
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    setTipIndex(dayOfYear % dailyTips.length);
  }, []);

  const todaysTip = dailyTips[tipIndex];

  const ecoScore = useMemo(() => {
    const baseScore = 50;
    const logsToday = wasteLogs.filter(log => 
      new Date(log.date).toDateString() === new Date().toDateString()
    ).length;
    const earnedBadges = badges.filter(b => b.earned).length;
    const streakBonus = Math.min(streak * 2, 20);
    return Math.min(baseScore + logsToday * 5 + earnedBadges * 5 + streakBonus, 100);
  }, [wasteLogs, badges, streak]);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <header className="gradient-eco px-5 pt-12 pb-8 rounded-b-3xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-primary-foreground">SustainX</h1>
            <p className="text-primary-foreground/80 text-sm">Your daily eco companion</p>
          </div>
          <div className="flex items-center gap-2 bg-primary-foreground/20 px-3 py-1.5 rounded-full">
            <Flame className="w-4 h-4 text-primary-foreground" />
            <span className="text-sm font-semibold text-primary-foreground">{streak} day streak</span>
          </div>
        </div>
        
        {/* Eco Score Card */}
        <div className="bg-card/95 backdrop-blur-sm rounded-2xl p-5 shadow-medium">
          <div className="flex items-center gap-5">
            <EcoScoreRing score={ecoScore} size="md" />
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-foreground mb-1">Today's Eco Score</h2>
              <p className="text-sm text-muted-foreground mb-3">
                {ecoScore >= 80 ? 'Amazing! Keep it up!' : 
                 ecoScore >= 60 ? 'Great progress today!' : 
                 ecoScore >= 40 ? 'Good start, log more!' : 
                 'Start logging to boost your score!'}
              </p>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-accent" />
                  <span className="text-xs text-muted-foreground">
                    {badges.filter(b => b.earned).length} badges
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Gift className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground">
                    +{todayEarned} pts today
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* EcoMiles Quick Card */}
        <Link to="/rewards" className="block mt-4">
          <div className="bg-card/80 backdrop-blur-sm rounded-xl p-4 shadow-soft border border-primary-foreground/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{currentTier.icon}</span>
              <div>
                <p className="text-sm font-medium text-foreground">{currentTier.name}</p>
                <p className="text-xs text-muted-foreground">{totalPoints.toLocaleString()} EcoMiles</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-primary text-sm font-medium">
              <Crown className="w-4 h-4" />
              View Rewards
            </div>
          </div>
        </Link>
      </header>

      <div className="px-5 py-6 space-y-6">
        {/* Daily Tip */}
        <section className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-6 bg-accent rounded-full" />
            <h2 className="text-lg font-semibold">Daily Tip</h2>
          </div>
          <div className="bg-accent/10 border border-accent/20 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-accent/20 rounded-xl">
                <Sparkles className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="font-medium text-foreground mb-1">{todaysTip.title}</h3>
                <p className="text-sm text-muted-foreground">{todaysTip.content}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-6 bg-primary rounded-full" />
            <h2 className="text-lg font-semibold">Quick Actions</h2>
          </div>
          <div className="space-y-3">
            <CategoryCard
              icon={<Leaf className="w-6 h-6" />}
              title="EcoTrack"
              description="Log your daily consumption"
              to="/ecotrack"
              color="primary"
            />
            <CategoryCard
              icon={<Recycle className="w-6 h-6" />}
              title="ReCircle"
              description="Recycle & upcycle items"
              to="/recircle"
              color="forest"
            />
            <CategoryCard
              icon={<ShoppingBag className="w-6 h-6" />}
              title="GreenCart"
              description="Shop sustainably"
              to="/greencart"
              color="accent"
            />
          </div>
        </section>

        {/* Badges */}
        <section className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-6 bg-eco-water rounded-full" />
              <h2 className="text-lg font-semibold">Your Badges</h2>
            </div>
            <a href="/profile" className="text-sm text-primary font-medium">View all</a>
          </div>
          <BadgeDisplay badges={badges} />
        </section>
      </div>
    </div>
  );
}
