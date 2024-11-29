// src/features/server/server.controller.ts
import { Controller, Get, Post, Body, Param, Query, Patch, HttpException, HttpStatus, Delete } from '@nestjs/common';
import { ServerService } from './server.service';
import { Prisma } from '@prisma/client';
import { PaginationModel } from '../../cores/models/pagination.model';

@Controller('servers')
export class ServerController {
  constructor(private readonly serverService: ServerService) {}

  @Post(':profileId')
  async createServer(
    @Param('profileId') profileId: string,
    @Body() createServerDto: Prisma.ServerCreateInput 
  ) {
    return this.serverService.createServer(createServerDto, profileId);
  }

  @Get(':id')
  async getServerById(@Param('id') id: string) {
    return this.serverService.getServerById(id);
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

    return this.serverService.getAllServers({
      pagination,
      where: whereParsed,
      orderBy: orderByParsed,
    });
  }

  @Patch(':id/invite-code')
  async updateInviteCode(
    @Param('id') serverId: string,
    @Body('profileId') profileId: string,
  ) {
    try {
      return await this.serverService.updateInviteCode(serverId, profileId);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update invite code',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Patch(':id/leave')
  async leaveServer(
    @Param('id') serverId: string,
    @Body('profileId') profileId: string,
  ) {
    try {
      return await this.serverService.leaveServer(serverId, profileId);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to leave server',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('join/:inviteCode')
  async joinServer(
    @Param('inviteCode') inviteCode: string,
    @Body('profileId') profileId: string,
  ) {
    try {
      return await this.serverService.joinServer(inviteCode, profileId);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to join server',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  async deleteServer(
    @Param('id') serverId: string,
    @Body('profileId') profileId: string,
  ){
    try {
      return await this.serverService.deleteServer(serverId, profileId);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to delete server',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Patch(':id')
  async updateServerDetails(
    @Param('id') serverId: string,
    @Body('profileId') profileId: string,
    @Body() data: { name?: string; imageUrl?: string },
  ) {
    try {
      return await this.serverService.updateServerDetails(serverId, profileId, data);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update server details',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
