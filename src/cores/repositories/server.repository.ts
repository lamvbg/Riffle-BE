import { Injectable } from '@nestjs/common';
import { Member, Prisma, Server } from '@prisma/client';

import { PrismaService } from '../dao/prisma.service';
import { BaseRepoAbstraction } from '../repositories/base-repo.abstraction';

@Injectable()
export class ServerRepository extends BaseRepoAbstraction<
  Server,
  Prisma.ServerDelegate,
  Prisma.ServerCreateInput,
  Prisma.ServerWhereInput,
  Prisma.ServerOrderByWithRelationInput,
  Prisma.ServerWhereUniqueInput,
  Prisma.ServerUpdateInput
> {
  public constructor(private prismaService: PrismaService) {
    super();
    this.collection = prismaService.server;
  }
}