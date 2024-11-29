import { Injectable } from '@nestjs/common';
import { BaseRepoAbstraction } from './base-repo.abstraction';
import { Prisma, MemberNotification } from '@prisma/client';
import { PrismaService } from '@cores/dao/prisma.service';

@Injectable()
export class MemberNotificationRepository extends BaseRepoAbstraction<
  MemberNotification,
  Prisma.MemberNotificationDelegate,
  Prisma.MemberNotificationCreateInput,
  Prisma.MemberNotificationWhereInput,
  Prisma.MemberNotificationOrderByWithRelationInput,
  Prisma.MemberNotificationWhereUniqueInput,
  Prisma.MemberNotificationUpdateInput
> {
  public constructor(private prismaService: PrismaService) {
    super();
    this.collection = prismaService.memberNotification;
  }
}
