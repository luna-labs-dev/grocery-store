'use client';

import { ShoppingCart } from 'lucide-react';

interface LoadingCartProps {
  size?: number;
  color?: string;
  className?: string;
}

export function LoadingCart({ size = 40, color = '#8b5cf6', className = '' }: LoadingCartProps) {
  return (
    <div
      className={`relative w-[160px] h-[80px] flex items-center justify-center overflow-hidden rounded-xl ${className}`}
    >
      {/* Efeito de brilho */}
      <div className="absolute inset-0" />

      {/* Linhas de movimento com início e fim aleatórios */}
      <div className="absolute left-0 z-0 w-full -translate-y-1/2 top-1/2">
        {/* Linha 1 */}
        <div className="h-[1px] w-[70%] mx-auto relative overflow-hidden">
          <div className="absolute top-0 w-[60%] h-full bg-gradient-to-r from-transparent via-violet-500/80 to-transparent animate-flow-1" />
        </div>

        {/* Linha 2 */}
        <div className="h-[1px] w-[80%] mx-auto mt-6 relative overflow-hidden opacity-70">
          <div className="absolute top-0 w-[50%] h-full bg-gradient-to-r from-transparent via-violet-500/60 to-transparent animate-flow-2" />
        </div>

        {/* Linha 3 */}
        <div className="h-[1px] w-[75%] mx-auto mt-3 relative overflow-hidden opacity-40">
          <div className="absolute top-0 w-[55%] h-full bg-gradient-to-r from-transparent via-violet-500/40 to-transparent animate-flow-3" />
        </div>

        {/* Linha 4 */}
        <div className="h-[1px] w-[65%] mx-auto -mt-9 relative overflow-hidden opacity-70">
          <div className="absolute top-0 w-[45%] h-full bg-gradient-to-r from-transparent via-violet-500/60 to-transparent animate-flow-4" />
        </div>

        {/* Linha 5 */}
        <div className="h-[1px] w-[85%] mx-auto -mt-3 relative overflow-hidden opacity-40">
          <div className="absolute top-0 w-[40%] h-full bg-gradient-to-r from-transparent via-violet-500/40 to-transparent animate-flow-5" />
        </div>
      </div>

      {/* Rastro do carrinho */}
      <div className="absolute z-10 animate-cart-move-modern">
        <div className="absolute w-12 h-8 -translate-y-1/2 -left-6 top-1/2 bg-gradient-to-r from-violet-500/10 via-violet-500/5 to-transparent blur-sm" />
      </div>

      {/* Carrinho em movimento */}
      <div className="relative z-20 animate-cart-move-modern">
        <div className="animate-cart-tilt-subtle">
          <ShoppingCart size={size} color={color} strokeWidth={2} className="drop-shadow-lg" />
        </div>
      </div>
    </div>
  );
}
