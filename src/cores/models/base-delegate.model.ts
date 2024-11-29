export type BaseDelegateModel<T extends object = any> = {
    findMany: (params?: {
      skip?: number;
      take: number;
      where?: any;
      orderBy?: any;
    }) => Promise<Array<T>>;
    findUnique: (params: { where: any, include: Record<string, boolean>}) => Promise<T>;
    create: (params: { data: any }) => Promise<T>;
    update: (params: { where: any; data: any }) => Promise<T>;
    delete: (params: { where: any }) => Promise<T>;
  };