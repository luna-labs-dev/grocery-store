import { Clerk } from '@clerk/clerk-js';
import { env } from '../env';

const { publishableKey } = env.clerk;

export const clerk = new Clerk(publishableKey);

let isLoaded = false;

export const loadClerkIfNeeded = async () => {
  if (!isLoaded) {
    console.log('loading clerk');
    await clerk.load();
    isLoaded = true;
  }
};
