import { Home, Target, Palette, BookOpen } from 'lucide-react';
import { NavLink } from './NavLink';

const navItems = [
  { to: '/', icon: Home, label: 'Dashboard' },
  { to: '/focus', icon: Target, label: 'Focus Garden' },
  { to: '/matrix', icon: Target, label: 'Matrix' },
  { to: '/resources', icon: BookOpen, label: 'Resources' },
];

export const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              FocusFlow
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground transition-all duration-300"
                activeClassName="bg-primary/10 text-primary font-medium shadow-sm"
              >
                <item.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};
