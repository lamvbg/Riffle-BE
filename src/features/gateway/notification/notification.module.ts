import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { NotificationRepository } from '../../../cores/repositories/notification.repository';
import { NotificationGateway } from './notification.gateway';
import { PrismaService } from '../../../cores/dao/prisma.service';
import { MemberNotificationRepository } from '../../../cores/repositories/member-notification.repository';

@Module({
  providers: [NotificationService, NotificationRepository, NotificationGateway, PrismaService, MemberNotificationRepository],
  controllers: [NotificationController]
})
export class NotificationModule {}
