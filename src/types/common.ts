export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = unknown> {
  data: T;
  message: string;
  success: boolean;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface FilterParams {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  [key: string]: unknown;
}
