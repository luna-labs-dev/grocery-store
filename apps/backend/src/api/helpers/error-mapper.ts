import { badRequest, conflict, notFound, serverError } from './http-helper';
import type { UseCaseError } from '@/domain';

export const errorMapper: Record<string, any> = {
  UNEXPECTED_ERROR: (error: UseCaseError) => serverError(error),
  MARKET_ALREADY_EXISTS_ERROR: (error: UseCaseError) => badRequest(error),
  MARKET_NOT_FOUND_ERROR: (error: UseCaseError) => notFound(error),
  SHOPPING_EVENT_ALREADY_ENDED_ERROR: (error: UseCaseError) => conflict(error),
  EMPTY_CART_ERROR: (error: UseCaseError) => badRequest(error),
  FAMILY_NOT_FOUND_ERROR: (error: UseCaseError) => notFound(error),
  FAMILY_OWNER_CANNOT_BE_REMOVED_ERROR: (error: UseCaseError) =>
    badRequest(error),
  USER_NOT_FAMILY_OWNER_ERROR: (error: UseCaseError) => badRequest(error),
  USER_NOT_A_FAMILY_MEMBER_ERROR: (error: UseCaseError) => badRequest(error),
};
