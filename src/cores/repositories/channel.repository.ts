import { Injectable } from '@nestjs/common';
import { Prisma, Channel } from '@prisma/client';
import { PrismaService } from '../dao/prisma.service';
import { BaseRepoAbstraction } from '../repositories/base-repo.abstraction';
@Injectable()
export class ChannelRepository extends BaseRepoAbstraction<
  Channel,
  Prisma.ChannelDelegate,
  Prisma.ChannelCreateInput,
  Prisma.ChannelWhereInput,
  Prisma.ChannelOrderByWithRelationInput,
  Prisma.ChannelWhereUniqueInput,
  Prisma.ChannelUpdateInput // Specify the correct UpdateInput type
> {
  public constructor(private prismaService: PrismaService) {
    super();
    this.collection = prismaService.channel;
  }
}

