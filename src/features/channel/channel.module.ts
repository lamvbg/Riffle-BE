import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { ChannelRepository } from '../../cores/repositories/channel.repository';
import { PrismaService } from '../../cores/dao/prisma.service';
import { ServerRepository } from '../../cores/repositories/server.repository';
import { ProfileService } from '../profile/profile.service';
import { ProfileRepository } from '../../cores/repositories/profile.repository';

@Module({
  controllers: [ChannelController],
  providers: [ChannelService, ChannelRepository, PrismaService, ServerRepository, ProfileService, ProfileRepository],
  exports: [ChannelService],
})
export class ChannelModule {}
