import { Module } from '@nestjs/common';
import { SettingController } from './setting.controller';
import { SettingService } from './setting.service';
import { SettingRepository } from '@cores/repositories/setting.repository';
import { PrismaService } from '@cores/dao/prisma.service';

@Module({
  controllers: [SettingController],
  providers: [SettingService, SettingRepository, PrismaService]
})
export class SettingModule {}
