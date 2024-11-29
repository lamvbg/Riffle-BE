import { PrismaService } from '@cores/dao/prisma.service';
import { MemberNotificationRepository } from '@cores/repositories/member-notification.repository';
import { NotificationRepository } from '@cores/repositories/notification.repository';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly memberNotificationRepository: MemberNotificationRepository
  ) {}

  async createNotification(data: Prisma.NotificationCreateInput) {
    return this.notificationRepository.createUser(data);
  }

  async getNotifications(memberId: string) {
    return this.notificationRepository.getOne({
      where: { id:memberId },
      include: { notification: true },
    });
  }

  async getNotificationById(notificationId: string) {
    return this.notificationRepository.getOne({
      where: { id: notificationId },
    });
  }
  
  async markAsRead(notificationId: string, memberId: string) {
    return this.memberNotificationRepository.updateUser({
      where: { memberId_notificationId: { memberId, notificationId } },
      data: { read: true },
    });
  }
}
