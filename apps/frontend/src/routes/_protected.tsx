import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { motion } from 'motion/react';
import { MainLayout } from '@/components';
import { fadeIn, prefersReducedMotion } from '@/lib/animations';

export const Route = createFileRoute('/_protected')({
  beforeLoad: async ({ context }) => {
    if (!context.auth?.data) {
      throw redirect({
        to: '/signin',
      });
    }
  },

  component: RouteComponent,
});

function RouteComponent() {
  const shouldAnimate = !prefersReducedMotion();

  return (
    <MainLayout>
      {shouldAnimate ? (
        <motion.div
          initial="initial"
          animate="animate"
          variants={fadeIn}
          className="h-full"
        >
          <Outlet />
        </motion.div>
      ) : (
        <Outlet />
      )}
    </MainLayout>
  );
}
