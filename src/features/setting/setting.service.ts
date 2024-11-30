import { SettingRepository } from '../../cores/repositories/setting.repository';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class SettingService {
    constructor(private readonly settingRepository: SettingRepository) {}

    async getSetting(settingId: string) {
        return this.settingRepository.getOne({
            where: { id: settingId},
        });
    }

    async updateSetting(settingId: string, data: Prisma.SettingUpdateInput) {
        return this.settingRepository.updateUser({
          where: { id: settingId },
          data,
        });
      }
}
