import type { LinkProps } from '@tanstack/react-router';
import { create } from 'zustand';

export type BreadcrumbType = {
  label: string;
  to: LinkProps['to'];
};
export type CurrentPage = {
  title: string;
  subTitle?: string;
};
interface BreadcrumbsStore {
  breadcrumbs: BreadcrumbType[];
  currentPage: CurrentPage;
  addBreadcrumbs: (
    breadcrumbs: BreadcrumbType[],
    currentPage: CurrentPage,
  ) => void;
  clearBreadcrumbs: () => void;
}

export const useBreadCrumbs = create<BreadcrumbsStore>((set) => ({
  breadcrumbs: [],
  currentPage: {
    title: '',
  },
  addBreadcrumbs: (breadcrumbs: BreadcrumbType[], currentPage: CurrentPage) => {
    set({
      breadcrumbs: breadcrumbs,
      currentPage: currentPage,
    });
  },
  clearBreadcrumbs: () => {
    set({
      breadcrumbs: [],
    });
  },
}));
