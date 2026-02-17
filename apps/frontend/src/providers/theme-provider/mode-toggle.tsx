import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';
import { useTheme } from '@/providers';

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <AnimatedThemeToggler theme={theme} setTheme={setTheme} duration={400} />
  );
}
