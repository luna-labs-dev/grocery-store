import { Icon } from '@iconify/react';
import { Link, useLocation } from '@tanstack/react-router';
import { useHaptics } from '@/hooks/use-haptics';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

export function MobileTabBar() {
  const isMobile = useIsMobile();
  const location = useLocation();
  const haptics = useHaptics();

  if (!isMobile) return null;

  const tabs = [
    {
      title: 'Mercados',
      to: '/market',
      icon: 'lsicon:marketplace-outline',
      activeIcon: 'lsicon:marketplace-filled',
    },
    {
      title: 'Eventos',
      to: '/shopping-event',
      icon: 'ph:shopping-cart',
      activeIcon: 'ph:shopping-cart-fill',
    },
    {
      title: 'Início',
      to: '/dashboard',
      icon: 'ri:home-5-line',
      activeIcon: 'ri:home-5-fill',
      isCenter: true,
    },
    {
      title: 'Grupos',
      to: '/manage-groups',
      icon: 'ph:users',
      activeIcon: 'ph:users-fill',
    },
    {
      title: 'Perfil',
      to: '/profile', // Placeholder for upcoming profile/settings page
      icon: 'ph:user',
      activeIcon: 'ph:user-fill',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-background/80 backdrop-blur-md pb-safe">
      {tabs.map((tab) => {
        const isActive = location.pathname.startsWith(tab.to);
        const isCenter = tab.isCenter;
        return (
          <Link
            key={tab.to}
            to={tab.to}
            onClick={() => haptics.selection()}
            className={cn(
              'flex flex-col items-center justify-center gap-1 min-w-[56px] h-full transition-all active:scale-95 duration-200',
              isActive
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground',
              isCenter && 'relative -top-3',
            )}
          >
            <div
              className={cn(
                'relative flex items-center justify-center',
                isCenter &&
                  'bg-primary text-primary-foreground rounded-full size-12 shadow-lg shadow-primary/25',
              )}
            >
              <Icon
                icon={isActive ? tab.activeIcon : tab.icon}
                className={cn(
                  'size-6 transition-transform',
                  isActive && !isCenter && 'scale-110',
                )}
              />
              {isActive && !isCenter && (
                <span className="absolute -bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary" />
              )}
            </div>
            <span
              className={cn(
                'text-[10px] font-medium leading-none',
                isCenter && 'mt-1',
              )}
            >
              {tab.title}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
