import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
// import { ChatController } from './chat.controller';
import { MessageService } from '../../message/message.service';
import { ProfileService } from '../../profile/profile.service';
import { PrismaService } from '@cores/dao/prisma.service';
import { ProfileRepository } from '@cores/repositories/profile.repository';
import { ChatGateway } from './chat.gateway';
import { ServerRepository } from '@cores/repositories/server.repository';
import { NotificationService } from '../notification/notification.service';
import { NotificationRepository } from '@cores/repositories/notification.repository';
import { MemberNotificationRepository } from '@cores/repositories/member-notification.repository';
import { AuthService } from 'src/features/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [ChatService, MessageService, ProfileService, PrismaService, ProfileRepository, ChatGateway, ServerRepository, NotificationService, NotificationRepository, MemberNotificationRepository, AuthService, JwtService],
  // controllers: [ChatController],
  exports: [],
})
export class ChatModule {}