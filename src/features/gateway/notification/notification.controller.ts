import { Controller, Get, Post, Param, Body, Patch } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Prisma } from '@prisma/client';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  async createNotification(@Body() data: Prisma.NotificationCreateInput) {
    return this.notificationService.createNotification(data);
  }

  @Get(':profileId')
  async getNotifications(@Param('profileId') profileId: string) {
    return this.notificationService.getNotifications(profileId);
  }

  @Get('notification/:notificationId')
  async getNotificationById(@Param('notificationId') notificationId: string) {
    return this.notificationService.getNotificationById(notificationId);
  }

  @Patch(':notificationId/read/:memberId')
  async markAsRead(
    @Param('notificationId') notificationId: string,
    @Param('memberId') memberId: string
  ) {
    return this.notificationService.markAsRead(notificationId, memberId);
  }
}
