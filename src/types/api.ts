// Generic API response
export interface StandardResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Pagination info
export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
}

// Error format
export interface AppError {
  message: string;
  code?: string;
}