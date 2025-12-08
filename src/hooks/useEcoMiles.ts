import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { EcoMilesState, EcoMilesTransaction, EcoMilesAction, TierLevel, Reward } from '@/types/sustainx';
import { ecoMilesPointValues, ecoMilesActionLabels, loyaltyTiers, rewardsCatalog } from '@/data/sustainabilityData';
import { toast } from '@/hooks/use-toast';

const defaultState: EcoMilesState = {
  totalPoints: 0,
  transactions: [],
  redeemedRewards: [],
};

export function useEcoMiles() {
  const [state, setState] = useLocalStorage<EcoMilesState>('ecoMiles', defaultState);

  const earnPoints = useCallback((action: EcoMilesAction) => {
    const basePoints = ecoMilesPointValues[action];
    const tier = getCurrentTier(state.totalPoints);
    const bonus = tier.id === 'leaf' ? 0.1 : tier.id === 'tree' ? 0.2 : tier.id === 'earth_guardian' ? 0.3 : 0;
    const totalPoints = Math.round(basePoints * (1 + bonus));

    const transaction: EcoMilesTransaction = {
      id: Date.now().toString(),
      action,
      points: totalPoints,
      description: ecoMilesActionLabels[action],
      date: new Date().toISOString(),
    };

    setState(prev => ({
      ...prev,
      totalPoints: prev.totalPoints + totalPoints,
      transactions: [transaction, ...prev.transactions],
    }));

    toast({
      title: `+${totalPoints} EcoMiles! 🌱`,
      description: ecoMilesActionLabels[action],
    });

    return totalPoints;
  }, [state.totalPoints, setState]);

  const redeemReward = useCallback((reward: Reward): boolean => {
    if (state.totalPoints < reward.cost) {
      toast({
        title: 'Not enough EcoMiles',
        description: `You need ${reward.cost - state.totalPoints} more points.`,
        variant: 'destructive',
      });
      return false;
    }

    if (state.redeemedRewards.includes(reward.id)) {
      toast({
        title: 'Already redeemed',
        description: 'You have already redeemed this reward.',
        variant: 'destructive',
      });
      return false;
    }

    const transaction: EcoMilesTransaction = {
      id: Date.now().toString(),
      action: 'redemption',
      points: -reward.cost,
      description: `Redeemed: ${reward.name}`,
      date: new Date().toISOString(),
      rewardId: reward.id,
    };

    setState(prev => ({
      ...prev,
      totalPoints: prev.totalPoints - reward.cost,
      transactions: [transaction, ...prev.transactions],
      redeemedRewards: [...prev.redeemedRewards, reward.id],
    }));

    toast({
      title: 'Reward Redeemed! 🎉',
      description: `You got: ${reward.name}`,
    });

    return true;
  }, [state.totalPoints, state.redeemedRewards, setState]);

  const currentTier = useMemo(() => getCurrentTier(state.totalPoints), [state.totalPoints]);
  
  const nextTier = useMemo(() => {
    const tierIndex = loyaltyTiers.findIndex(t => t.id === currentTier.id);
    return tierIndex < loyaltyTiers.length - 1 ? loyaltyTiers[tierIndex + 1] : null;
  }, [currentTier]);

  const tierProgress = useMemo(() => {
    if (!nextTier) return 100;
    const pointsInTier = state.totalPoints - currentTier.minPoints;
    const tierRange = nextTier.minPoints - currentTier.minPoints;
    return Math.round((pointsInTier / tierRange) * 100);
  }, [state.totalPoints, currentTier, nextTier]);

  const todayEarned = useMemo(() => {
    const today = new Date().toDateString();
    return state.transactions
      .filter(t => new Date(t.date).toDateString() === today && t.points > 0)
      .reduce((sum, t) => sum + t.points, 0);
  }, [state.transactions]);

  return {
    totalPoints: state.totalPoints,
    transactions: state.transactions,
    redeemedRewards: state.redeemedRewards,
    earnPoints,
    redeemReward,
    currentTier,
    nextTier,
    tierProgress,
    todayEarned,
    rewards: rewardsCatalog,
  };
}

function getCurrentTier(points: number) {
  return loyaltyTiers.find(t => points >= t.minPoints && points <= t.maxPoints) || loyaltyTiers[0];
}