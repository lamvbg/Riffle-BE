import {
  Controller,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UnauthorizedException,
  BadRequestException,
  Get,
} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { Prisma, ChannelType } from '@prisma/client';
import { PaginationModel } from '@cores/models/pagination.model';

@Controller('channels')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Post()
  async createChannel(
    @Query('serverId') serverId: string,
    @Body('profileId') profileId: string,
    @Body() createChannelDto: { name: string; type: ChannelType }
  ) {
    if (!serverId) {
      throw new BadRequestException('Server ID missing');
    }

    return this.channelService.createChannel(serverId, profileId, createChannelDto);
  }

  @Get(':id')
  async getChannelById(@Param('id') id: string) {
    return this.channelService.getChannelById(id);
  }

  @Get()
  async getAllServers(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('orderBy') orderBy?: string,
    @Query('where') where?: string,
  ) {
    const pagination: PaginationModel = { skip, take };
    const orderByParsed = orderBy ? JSON.parse(orderBy) : undefined;
    const whereParsed = where ? JSON.parse(where) : undefined;

    return this.channelService.getAllChannels({
      pagination,
      where: whereParsed,
      orderBy: orderByParsed,
    });
  }

  @Patch(':channelId')
  async updateChannel(
    @Param('channelId') channelId: string,
    @Query('serverId') serverId: string,
    @Body('profileId') profileId: string,
    @Body() updateChannelDto: { name?: string; type?: ChannelType }
  ) {
    if (!serverId) {
      throw new BadRequestException('Server ID missing');
    }

    if (!channelId) {
      throw new BadRequestException('Channel ID missing');
    }

    return this.channelService.updateChannel(serverId, profileId, channelId, updateChannelDto);
  }

  // Delete a channel
  @Delete(':channelId')
  async deleteChannel(
    @Param('channelId') channelId: string,
    @Query('serverId') serverId: string,
    @Body('profileId') profileId: string
  ) {
    if (!serverId) {
      throw new BadRequestException('Server ID missing');
    }

    if (!channelId) {
      throw new BadRequestException('Channel ID missing');
    }

    return this.channelService.deleteChannel(serverId, profileId, channelId);
  }
}
