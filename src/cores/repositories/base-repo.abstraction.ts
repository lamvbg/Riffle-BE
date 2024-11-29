import { Injectable } from '@nestjs/common';
import { PaginationModel } from '../models/pagination.model';

import { BaseDelegateModel } from '../models/base-delegate.model';

@Injectable()
export abstract class BaseRepoAbstraction<
  ResponseType,
  Delegate extends BaseDelegateModel,
  CreateInput,
  WhereInput,
  OrderByInput,
  WhereUniqueInput,
  UpdateInput = Partial<CreateInput>,
> {
  protected collection: Delegate;

  protected constructor() {}

  public async get(params: {
    pagination?: PaginationModel;
    where?: WhereInput;
    orderBy?: OrderByInput;
    include?: any;
  }): Promise<Array<ResponseType>> {
    const { pagination, where, orderBy, include } = params;
    return this.collection.findMany({
      ...(pagination && {
        skip: pagination.skip,
        take: pagination.take,
      }),
      ...(where && { where: where }),
      ...(include && { include: include }),
      ...(orderBy && { orderBy: orderBy }),
    });
  }


  public async getOne(params: {
    where: WhereUniqueInput;
    include?: any;
  }): Promise<ResponseType> {
    const { where, include } = params;
    return this.collection.findUnique({
      where,
      include,
    });
  }

  public async createUser(data: CreateInput): Promise<ResponseType> {
    return this.collection.create({
      data,
    });
  }

  public async updateUser(params: {
    where: WhereUniqueInput;
    data: UpdateInput;
  }): Promise<ResponseType> {
    const { where, data } = params;
    return this.collection.update({
      where,
      data,
    });
  }

  public async deleteUser(where: WhereUniqueInput): Promise<ResponseType> {
    return this.collection.delete({
      where,
    });
  }
}
