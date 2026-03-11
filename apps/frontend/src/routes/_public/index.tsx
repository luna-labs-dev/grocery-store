import { createFileRoute, redirect } from '@tanstack/react-router';
import { motion } from 'motion/react';
import { LandingPage } from '@/features/landing-page';
import { fadeIn, prefersReducedMotion } from '@/lib/animations';

export const Route = createFileRoute('/_public/')({
  component: Index,
  beforeLoad: async () => {
    throw redirect({
      to: '/signin',
    });
  },
  head: () => ({
    meta: [
      {
        title: 'Grocery Store',
      },
    ],
  }),
});

function Index() {
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
          <LandingPage />
        </motion.div>
      ) : (
        <LandingPage />
      )}
    </>
  );
}
