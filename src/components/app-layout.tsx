
'use client';
import {
  LayoutGrid,
  MessageSquare,
  Newspaper,
  User,
  Gamepad2,
  LogOut,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/auth-context';

const navItems = [
  {
    name: 'Summary',
    href: '/home',
    icon: LayoutGrid,
  },
  {
    name: 'Chat',
    href: '/ai-doc',
    icon: MessageSquare,
  },
  {
    name: 'Feed',
    href: '/feed',
    icon: Newspaper,
  },
  {
    name: 'Games',
    href: '/games',
    icon: Gamepad2,
  },
  {
    name: 'Profile',
    href: '/profile',
    icon: User,
  },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isAuthPage = pathname === '/login' || pathname === '/register';

  if (!user || isAuthPage) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground selection:bg-primary/30">
      <aside className="w-64 border-r border-border/50 bg-card/50 backdrop-blur-xl p-6 flex flex-col justify-between shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]">
        <div className="overflow-y-auto overflow-x-hidden -mr-2 pr-2">
          <div className="sticky top-0 pt-2 pb-6">
            <Link href="/home" className="flex items-center gap-2 mb-10 px-2 group">
              <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-lg group-hover:scale-105 transition-transform">
                M
              </div>
              <h1 className="text-2xl font-bold text-foreground font-headline tracking-tight">
                MindWell
              </h1>
            </Link>
            <nav className="flex flex-col gap-2">
              {navItems.map(item => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Button
                    key={item.name}
                    asChild
                    variant={isActive ? 'default' : 'ghost'}
                    className={`justify-start text-base font-medium h-12 px-4 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]'
                        : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground hover:scale-[1.02]'
                    }`}
                  >
                    <Link href={item.href}>
                      <item.icon className={`w-5 h-5 mr-4 ${isActive ? 'text-primary-foreground' : 'text-primary'}`} />
                      {item.name}
                    </Link>
                  </Button>
                );
              })}
            </nav>
          </div>
        </div>
        <div className="mb-4">
           <Button
            onClick={logout}
            variant="ghost"
            className="justify-start text-base font-medium h-12 px-4 w-full rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive transition-all hover:scale-[1.02]"
          >
            <LogOut className="w-5 h-5 mr-4 text-destructive" />
            Logout
          </Button>
        </div>
      </aside>
      <main className="flex-1 flex flex-col overflow-y-auto relative">{children}</main>
    </div>
  );
}
