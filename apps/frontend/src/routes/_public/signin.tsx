import { createFileRoute, redirect } from '@tanstack/react-router';
import { motion } from 'motion/react';
import { SigninPage } from '@/features/auth/pages/signin';
import { fadeIn, prefersReducedMotion } from '@/lib/animations';

export const Route = createFileRoute('/_public/signin')({
  beforeLoad: async ({ context }) => {
    if (context.auth?.data) {
      throw redirect({
        to: '/dashboard',
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const shouldAnimate = !prefersReducedMotion();

  return (
    <>
      {shouldAnimate ? (
        <motion.div
          initial="initial"
          animate="animate"
          variants={fadeIn}
          className="h-full"
        >
          <SigninPage />
        </motion.div>
      ) : (
        <SigninPage />
      )}
    </>
  );
}
