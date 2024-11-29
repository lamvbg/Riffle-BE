import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { SettingService } from './setting.service';
import { Prisma } from '@prisma/client';

@Controller('setting')
export class SettingController {
    constructor(private readonly settingService: SettingService) {}

    @Get(':id')
    async getSetting(@Param('id') settingId: string) {
        return this.settingService.getSetting(settingId);
    }

    @Patch(':id')
    async updateSetting(
        @Param('id') settingId: string, 
        @Body() data: Prisma.SettingUpdateInput) {
        return this.settingService.updateSetting(settingId, data);
    }
}
