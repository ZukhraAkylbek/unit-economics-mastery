import { Users, BarChart3, Settings, BookOpen } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

const adminNavItems = [
  { to: '/admin', icon: Users, label: 'Студенты' },
  { to: '/admin/progress', icon: BarChart3, label: 'Прогресс' },
  { to: '/admin/content', icon: BookOpen, label: 'Контент' },
  { to: '/admin/settings', icon: Settings, label: 'Настройки' },
];

export function AdminNav() {
  return (
    <nav className="nav-bottom">
      <div className="container flex items-center justify-around py-2">
        {adminNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/admin'}
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
