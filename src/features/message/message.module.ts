import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { PrismaService } from '../../cores/dao/prisma.service';
import { ProfileService } from '../profile/profile.service';
import { ProfileRepository } from '../../cores/repositories/profile.repository';
import { ServerRepository } from '../../cores/repositories/server.repository';

@Module({
  controllers: [MessageController],
  providers: [MessageService, PrismaService, ProfileService,ProfileRepository, ServerRepository],
})
export class MessageModule {}
