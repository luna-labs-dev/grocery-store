export interface UseCaseError extends Error {
  code: string;
  uuid?: string;
  extras?: any;
}
