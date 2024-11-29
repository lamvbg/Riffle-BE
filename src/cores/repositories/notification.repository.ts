import { Injectable } from '@nestjs/common';
import { BaseRepoAbstraction } from './base-repo.abstraction';
import { Prisma, Notification } from '@prisma/client';
import { PrismaService } from '@cores/dao/prisma.service';

@Injectable()
export class NotificationRepository extends BaseRepoAbstraction<
  Notification,
  Prisma.NotificationDelegate,
  Prisma.NotificationCreateInput,
  Prisma.NotificationWhereInput,
  Prisma.NotificationOrderByWithRelationInput,
  Prisma.NotificationWhereUniqueInput,
  Prisma.NotificationUpdateInput
> {
  public constructor(private prismaService: PrismaService) {
    super();
    this.collection = prismaService.notification;
  }
}
