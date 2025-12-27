import { Home, Rocket, Grid3X3, BookOpen, Wrench } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/office', icon: Home, label: 'Главная' },
  { to: '/tasks', icon: Grid3X3, label: 'Задачи' },
  { to: '/theory', icon: BookOpen, label: 'База' },
  { to: '/toolkit', icon: Wrench, label: 'Тулкит' },
  { to: '/audit', icon: Rocket, label: 'Аудит' },
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
                'flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className={cn(
                  'p-2 rounded-xl transition-colors',
                  isActive && 'bg-primary/10'
                )}>
                  <item.icon className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
