import { ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  iconOnly?: boolean;
}
export const GroceryfyLogo = ({ iconOnly }: Props) => {
  return (
    <div className="flex items-center justify-center transition-all duration-200 ease-linear gap-2 text-xl font-bold text-violet-700 dark:text-violet-400">
      <ShoppingCart className="w-6 h-6" />
      <p
        className={cn(
          'text-slate-400 dark:text-white',
          iconOnly ? 'hidden' : 'opacity-100',
        )}
      >
        Grocery<span className="text-violet-700 dark:text-violet-400">fy</span>
      </p>
    </div>
  );
};
