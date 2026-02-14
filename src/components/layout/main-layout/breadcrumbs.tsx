import { Icon } from '@iconify/react';
import { Link } from '@tanstack/react-router';
import React from 'react';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components';
import { useBreadCrumbs } from '@/hooks/use-breadcrumbs';
import { useIsMobile } from '@/hooks/use-mobile';

const MAX_ACCEPTABLE_BREADCRUMBS_LENGTH_DESKTOP = 5;
const MAX_ACCEPTABLE_BREADCRUMBS_LENGTH_MOBILE = 3;

export const Breadcrumbs = () => {
  const { breadcrumbs } = useBreadCrumbs();
  const isMobile = useIsMobile();

  const isTooLong = isMobile
    ? breadcrumbs.length > MAX_ACCEPTABLE_BREADCRUMBS_LENGTH_MOBILE
    : breadcrumbs.length > MAX_ACCEPTABLE_BREADCRUMBS_LENGTH_DESKTOP;

  const lastItem = breadcrumbs[breadcrumbs.length - 1];

  if (!isTooLong) {
    return (
      <BreadcrumbsWrapper>
        {breadcrumbs.map((breadcrumb) => {
          return (
            <React.Fragment key={`${breadcrumb.label}:${breadcrumb.to}`}>
              {breadcrumb === lastItem ? (
                <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
              ) : (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to={breadcrumb.to}>{breadcrumb.label}</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator>
                    <Icon icon={'lucide:dot'} />
                  </BreadcrumbSeparator>
                </>
              )}
            </React.Fragment>
          );
        })}
      </BreadcrumbsWrapper>
    );
  }

  const collapsedItems = breadcrumbs.slice(1, -2);
  const firstItem = breadcrumbs.length > 0 ? breadcrumbs[0] : undefined;
  const lastTwoItems = breadcrumbs.slice(-2);

  return (
    <BreadcrumbsWrapper>
      {firstItem && (
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to={firstItem.to} className="flex items-center">
              {firstItem.label}
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
      )}

      <BreadcrumbItem>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1">
            <BreadcrumbEllipsis className="h-4 w-4" />
            <span className="sr-only">Toggle menu</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-40">
            {collapsedItems.map((breadcrumb) => (
              <DropdownMenuItem key={`${breadcrumb.label}:${breadcrumb.to}`}>
                <Link to={breadcrumb.to}>{breadcrumb.label}</Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </BreadcrumbItem>

      {lastTwoItems.map((breadcrumb) => (
        <div
          key={`${breadcrumb.label}:${breadcrumb.to}`}
          className="flex gap-2 items-center"
        >
          <BreadcrumbItem>
            {breadcrumb === lastItem ? (
              <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
            ) : (
              <>
                <BreadcrumbLink asChild>
                  <Link to={breadcrumb.to}>{breadcrumb.label}</Link>
                </BreadcrumbLink>
                <BreadcrumbSeparator>
                  <Icon icon={'lucide:dot'} />
                </BreadcrumbSeparator>
              </>
            )}
          </BreadcrumbItem>
        </div>
      ))}
    </BreadcrumbsWrapper>
  );
};

interface BreadcrumbsWrapperProps {
  children: React.ReactNode;
}
const BreadcrumbsWrapper = ({ children }: BreadcrumbsWrapperProps) => {
  return (
    <Breadcrumb>
      <BreadcrumbList className="w-[80vw] md:w-full flex flex-wrap md:flex-row">
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to={'/dashboard'} className="flex items-center">
              <Icon icon={'fluent:home-32-filled'} />
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Icon icon={'lucide:dot'} />
        </BreadcrumbSeparator>
        {children}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
