import { Home, Leaf, Recycle, ShoppingBag, Gift, User } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/ecotrack', icon: Leaf, label: 'EcoTrack' },
  { to: '/recircle', icon: Recycle, label: 'ReCircle' },
  { to: '/greencart', icon: ShoppingBag, label: 'GreenCart' },
  { to: '/rewards', icon: Gift, label: 'Rewards' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/50 pb-safe">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200"
            activeClassName="text-primary"
          >
            {({ isActive }: { isActive: boolean }) => (
              <>
                <div className={cn(
                  "p-2 rounded-xl transition-all duration-200",
                  isActive ? "bg-primary/15 shadow-soft" : "bg-transparent"
                )}>
                  <item.icon className={cn(
                    "w-5 h-5 transition-all duration-200",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )} />
                </div>
                <span className={cn(
                  "text-xs font-medium transition-colors duration-200",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
