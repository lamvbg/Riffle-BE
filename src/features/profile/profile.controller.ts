import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Prisma } from '@prisma/client';  // Import Prisma types

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  // GET: /profiles - Get all profiles with optional pagination
  @Get()
  async getProfiles(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('filter') filter?: string // Optional filter as a JSON string
  ) {
    const where: Prisma.ProfileWhereInput = filter ? JSON.parse(filter) : {};
    return this.profileService.getProfiles({ skip, take }, where);
  }

  @Get(':id')
  async getProfileById(@Param('id') profileId: string) {
    return this.profileService.getProfileById(profileId);
  }

  @Post()
  async createProfile(@Body() data: Prisma.ProfileCreateInput) {
    return this.profileService.createProfile(data);
  }

  @Patch(':id')
  async updateProfile(
    @Param('id') profileId: string,
    @Body() data: Prisma.ProfileUpdateInput
  ) {
    return this.profileService.updateProfile(profileId, data);
  }

  @Delete(':id')
  async deleteProfile(@Param('id') profileId: string) {
    return this.profileService.deleteProfile(profileId);
  }

  @Get(':id/servers')
  async getServersForProfile(@Param('id') profileId: string) {
    return this.profileService.getServersForProfile(profileId);
  }
}
