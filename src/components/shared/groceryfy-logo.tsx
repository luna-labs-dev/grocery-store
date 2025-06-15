import { ShoppingCart } from 'lucide-react';

export const GroceryfyLogo = () => {
  return (
    <div className="flex items-center justify-center gap-2 mb-6 text-xl font-bold text-violet-400">
      <ShoppingCart className="w-6 h-6" />
      <p className="text-white">
        Grocery<span className="text-violet-400">fy</span>
      </p>
    </div>
  );
};
