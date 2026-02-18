import { FamilyDetails, FamilyOnboarding } from '../components';
import { useGetFamilyQuery } from '@/features/family/infrastructure';

export const FamilyOnboardingPage = () => {
  const { isFamilyMember } = useGetFamilyQuery();

  if (isFamilyMember) {
    return <FamilyDetails />;
  }

  return <FamilyOnboarding />;
};
