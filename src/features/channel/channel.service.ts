import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { Prisma, MemberRole, Server, ChannelType, Channel  } from '@prisma/client';
import { ChannelRepository } from '../../cores/repositories/channel.repository';
import { ServerRepository } from '../../cores/repositories/server.repository';
import { ProfileService } from '../profile/profile.service';
import { PaginationModel } from '../../cores/models/pagination.model';

@Injectable()
export class ChannelService {
  constructor(
    private readonly channelRepository: ChannelRepository,
    private readonly serverRepository: ServerRepository,
    private readonly profileService: ProfileService,
  ) {}

  async createChannel(serverId: string, profileId: string, data: { name: string; type: ChannelType }): Promise<Server> {
    const { name, type } = data;

    // Validate profile and server existence
    const profile = await this.profileService.getProfileById(profileId);
    if (!profile) {
      throw new UnauthorizedException('Unauthorized');
    }

    if (!serverId) {
      throw new BadRequestException('Server ID missing');
    }

    if (name === 'general') {
      throw new BadRequestException("Name cannot be 'general'");
    }

    // Update server and add new channel
    return this.serverRepository.updateUser({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profileId,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          create: {
            profileId: profileId,
            name,
            type,
          },
        },
      },
    });
  }

  async getChannelById(channelId: string) {
    const channel = await this.channelRepository.getOne({
      where: { id: channelId },
      include: {
        messages: {
          include: {
            member: {
              include: {
                profile: true,
              },
            },
          }
        }
      },
    });

    return channel;
  }

  async getAllChannels(params: {
    pagination?: PaginationModel;
    where?: Prisma.ChannelWhereInput;
    orderBy?: Prisma.ChannelOrderByWithRelationInput;
  }): Promise<Channel[]> {
    const { pagination, where, orderBy } = params;
    return this.channelRepository.get({
      pagination: {
        skip: pagination?.skip,
        take: pagination?.take,
      },
      where,
      orderBy,
    });
  }

  // Update a channel
  // async updateChannel(serverId: string, profileId: string, channelId: string, data: { name?: string; type?: ChannelType }): Promise<Server> {
  //   const { name, type } = data;

  //   // Validate profile and server existence
  //   const profile = await this.profileService.getProfileById(profileId);
  //   if (!profile) {
  //     throw new UnauthorizedException('Unauthorized');
  //   }

  //   if (!serverId) {
  //     throw new BadRequestException('Server ID missing');
  //   }

  //   if (!channelId) {
  //     throw new BadRequestException('Channel ID missing');
  //   }

  //   if (name === 'general') {
  //     throw new BadRequestException("Name cannot be 'general'");
  //   }

  //   // Update channel within server
  //   return this.serverRepository.updateUser({
  //     where: {
  //       id: serverId,
  //       members: {
  //         some: {
  //           profileId: profileId,
  //           role: {
  //             in: [MemberRole.ADMIN, MemberRole.MODERATOR],
  //           },
  //         },
  //       },
  //     },
  //     data: {
  //       channels: {
  //         update: {
  //           where: {
  //             id: channelId,
  //             NOT: {
  //               name: 'general',
  //             },
  //           },
  //           data: {
  //             name,
  //             type,
  //           },
  //         },
  //       },
  //     },
  //   });
  // }
  async updateChannel(serverId: string, profileId: string, channelId: string, data: { name?: string; type?: ChannelType }) {
    return this.channelRepository.updateUser({
      where: {
        id: channelId,
        serverId: serverId,
      },
      data,
    })
  }

  // Delete a channel
  async deleteChannel(serverId: string, profileId: string, channelId: string): Promise<Server> {
    // Validate profile and server existence
    const profile = await this.profileService.getProfileById(profileId);
    if (!profile) {
      throw new UnauthorizedException('Unauthorized');
    }

    if (!serverId) {
      throw new BadRequestException('Server ID missing');
    }

    if (!channelId) {
      throw new BadRequestException('Channel ID missing');
    }

    // Delete channel from server
    return this.serverRepository.updateUser({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profileId,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          delete: {
            id: channelId,
            name: {
              not: 'general',
            },
          },
        },
      },
    });
  }
}
