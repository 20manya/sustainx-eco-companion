import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CategoryCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  to: string;
  color?: 'primary' | 'accent' | 'forest' | 'water';
}

export function CategoryCard({ icon, title, description, to, color = 'primary' }: CategoryCardProps) {
  const colorClasses = {
    primary: 'from-primary/20 to-primary/5 border-primary/20',
    accent: 'from-accent/20 to-accent/5 border-accent/20',
    forest: 'from-eco-forest/20 to-eco-forest/5 border-eco-forest/20',
    water: 'from-eco-water/20 to-eco-water/5 border-eco-water/20',
  };

  const iconColorClasses = {
    primary: 'bg-primary/20 text-primary',
    accent: 'bg-accent/20 text-accent',
    forest: 'bg-eco-forest/20 text-eco-forest',
    water: 'bg-eco-water/20 text-eco-water',
  };

  return (
    <Link
      to={to}
      className={cn(
        'block rounded-2xl border p-4 bg-gradient-to-br transition-all duration-300',
        'hover:shadow-medium hover:scale-[1.02] active:scale-[0.98]',
        colorClasses[color]
      )}
    >
      <div className="flex items-center gap-4">
        <div className={cn('p-3 rounded-xl', iconColorClasses[color])}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-lg">{title}</h3>
          <p className="text-sm text-muted-foreground truncate">{description}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground" />
      </div>
    </Link>
  );
}
