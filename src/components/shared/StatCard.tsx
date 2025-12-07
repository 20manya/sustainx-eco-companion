import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
  variant?: 'default' | 'primary' | 'accent';
}

export function StatCard({ 
  icon, 
  label, 
  value, 
  unit, 
  trend, 
  trendValue, 
  className,
  variant = 'default'
}: StatCardProps) {
  const variantClasses = {
    default: 'bg-card',
    primary: 'bg-primary/10 border-primary/20',
    accent: 'bg-accent/10 border-accent/20',
  };

  return (
    <div className={cn(
      'rounded-2xl border p-4 shadow-soft transition-all duration-200 hover:shadow-medium',
      variantClasses[variant],
      className
    )}>
      <div className="flex items-start justify-between mb-3">
        <div className={cn(
          'p-2 rounded-xl',
          variant === 'primary' ? 'bg-primary/20' : variant === 'accent' ? 'bg-accent/20' : 'bg-muted'
        )}>
          {icon}
        </div>
        {trend && (
          <span className={cn(
            'text-xs font-medium px-2 py-1 rounded-full',
            trend === 'up' ? 'bg-primary/20 text-primary' : 
            trend === 'down' ? 'bg-destructive/20 text-destructive' : 
            'bg-muted text-muted-foreground'
          )}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
          </span>
        )}
      </div>
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="text-2xl font-bold text-foreground">
        {value}
        {unit && <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>}
      </p>
    </div>
  );
}
