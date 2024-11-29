export interface PluralResponseModel<T = unknown> {
    data: Array<T>;
    currentPage: number;
    totalPages: number;
    count: number;
    succeed: boolean;
    message: string;
  }