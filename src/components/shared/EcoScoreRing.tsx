import { cn } from '@/lib/utils';

interface EcoScoreRingProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function EcoScoreRing({ score, size = 'md', showLabel = true, className }: EcoScoreRingProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  const strokeWidth = size === 'sm' ? 4 : size === 'md' ? 6 : 8;
  const radius = size === 'sm' ? 28 : size === 'md' ? 42 : 56;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  const getScoreColor = () => {
    if (score >= 80) return 'stroke-primary';
    if (score >= 60) return 'stroke-eco-leaf';
    if (score >= 40) return 'stroke-accent';
    return 'stroke-destructive';
  };

  return (
    <div className={cn('relative flex items-center justify-center', sizeClasses[size], className)}>
      <svg className="transform -rotate-90 w-full h-full">
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-muted"
        />
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          className={cn(getScoreColor(), 'transition-all duration-700 ease-out')}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={cn('font-bold text-foreground', textSizes[size])}>{score}</span>
        {showLabel && <span className="text-xs text-muted-foreground">Eco Score</span>}
      </div>
    </div>
  );
}
