import { cn } from '@/lib/utils';
import { Badge } from '@/types/sustainx';

interface BadgeDisplayProps {
  badges: Badge[];
  showAll?: boolean;
  className?: string;
}

export function BadgeDisplay({ badges, showAll = false, className }: BadgeDisplayProps) {
  const displayBadges = showAll ? badges : badges.filter(b => b.earned).slice(0, 4);

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {displayBadges.length === 0 ? (
        <p className="text-sm text-muted-foreground">Start logging to earn badges!</p>
      ) : (
        displayBadges.map((badge) => (
          <div
            key={badge.id}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-xl border transition-all',
              badge.earned 
                ? 'bg-primary/10 border-primary/30 shadow-soft' 
                : 'bg-muted/50 border-border opacity-50'
            )}
          >
            <span className="text-xl">{badge.icon}</span>
            <div>
              <p className={cn(
                'text-sm font-medium',
                badge.earned ? 'text-foreground' : 'text-muted-foreground'
              )}>
                {badge.name}
              </p>
              {showAll && (
                <p className="text-xs text-muted-foreground">{badge.description}</p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
