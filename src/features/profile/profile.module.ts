import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { ProfileRepository } from '../../cores/repositories/profile.repository';
import { PrismaService } from '../../cores/dao/prisma.service';
import { ServerRepository } from '@cores/repositories/server.repository';

@Module({
  imports: [],
  controllers: [ProfileController],
  providers: [ProfileService, ProfileRepository, PrismaService, ServerRepository],
  exports: [ProfileService], // If you need to use ProfileService in other modules
})
export class ProfileModule {}
