import { Home, Rocket, Grid3X3, BookOpen, Calculator } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/office', icon: Home, label: 'ОФИС' },
  { to: '/audit', icon: Rocket, label: 'PH AUDIT' },
  { to: '/tasks', icon: Grid3X3, label: 'ЗАДАЧИ' },
  { to: '/theory', icon: BookOpen, label: 'БАЗА' },
  { to: '/toolkit', icon: Calculator, label: 'ТУЛКИТ' },
];

export function BottomNav() {
  return (
    <nav className="nav-bottom">
      <div className="container flex items-center justify-around py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200',
                isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span className="text-[10px] font-semibold tracking-wider">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
