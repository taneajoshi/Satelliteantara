export interface PaginatedInterface<T> {
  items: T[];

  offset: number;

  totalItems: number; // total number of items across all pages

  totalPages: number; // total pages respect to item count per page

  itemCount: number; // per page items

  page: number; // current page being showed
}

export interface PaginationQuery {
  page?: number;
  pageSize?: number;
}
