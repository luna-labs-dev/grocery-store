export interface FetchListParams<TOrderBy = string> {
  pageIndex: number;
  pageSize: number;
  orderBy: TOrderBy;
  orderDirection: 'asc' | 'desc';
}

export interface FetchListResponse<TResponse> {
  total: number;
  items: TResponse[];
}
