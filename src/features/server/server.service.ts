import { Injectable } from '@nestjs/common';
import { Member, MemberRole, Prisma, Server } from '@prisma/client';
import { ServerRepository } from '../../cores/repositories/server.repository';
import { PaginationModel } from '../../cores/models/pagination.model';
import { v4 as uuidv4 } from 'uuid';
import { ProfileService } from '../profile/profile.service';

@Injectable()
export class ServerService {
  constructor(
    private readonly serverRepository: ServerRepository,
    // private readonly profileService: ProfileService
  ) {}

  async createServer(
    data: Prisma.ServerCreateInput,
    profileId: string,
  ): Promise<Server> {
    return this.serverRepository.createUser({
      ...data,
      inviteCode: uuidv4(),
      profile: {
        connect: { id: profileId },
      },
      channels: {
        create: [{ name: 'general', profileId: profileId }],
      },
      members: {
        create: [{ profile: { connect: { id: profileId } }, role: 'ADMIN' }],
      },
    });
  }

  async getServerById(serverId: string) {
    const server = await this.serverRepository.getOne({
      where: { id: serverId },
      include: {
        members: true,
        channels: true,
      },
    });

    return server;
  }

  async getAllServers(params: {
    pagination?: PaginationModel;
    where?: Prisma.ServerWhereInput;
    orderBy?: Prisma.ServerOrderByWithRelationInput;
  }): Promise<Server[]> {
    const { pagination, where, orderBy } = params;
    return this.serverRepository.get({
      pagination: {
        skip: pagination?.skip,
        take: pagination?.take,
      },
      where,
      orderBy,
    });
  }

  async updateInviteCode(serverId: string, profileId: string): Promise<Server> {
    return this.serverRepository.updateUser({
      where: {
        id: serverId,
        profileId: profileId,
      },
      data: {
        inviteCode: uuidv4(),
      },
    });
  }

  // Leave server (remove member) - Fixing the deleteMany issue
  async leaveServer(serverId: string, profileId: string): Promise<Server> {
    // First find the server where the member exists
    const server = await this.serverRepository.getOne({
      where: {
        id: serverId,
        members: {
          some: { profileId },
        },
      },
    });

    if (!server) {
      throw new Error('Server not found or user is not a member');
    }

    return this.serverRepository.updateUser({
      where: { id: serverId },
      data: {
        members: {
          deleteMany: { profileId: profileId },
        },
      },
    });
  }

  async joinServer(inviteCode: string, profileId: string): Promise<Server> {
    const server = await this.serverRepository.getOne({
      where: {
        inviteCode: inviteCode,
      },
    });
  
    if (!server) {
      throw new Error('Invalid invite code or server does not exist');
    }
  
    const isMember = await this.serverRepository.getOne({
      where: {
        id: server.id,
        members: {
          some: { profileId },
        },
      },
    });
  
    if (isMember) {
      throw new Error('User is already a member of this server');
    }
  
    return this.serverRepository.updateUser({
      where: { id: server.id },
      data: {
        members: {
          create: [{ profile: { connect: { id: profileId } }, role: 'GUEST' }],
        },
      },
    });
  }
  

  async deleteServer(serverId: string, profileId: string): Promise<Server> {
    return this.serverRepository.deleteUser({
      id: serverId,
      profileId: profileId,
    });
  }

  async updateServerDetails(
    serverId: string,
    profileId: string,
    data: { name?: string; imageUrl?: string },
  ): Promise<Server> {
    return this.serverRepository.updateUser({
      where: {
        id: serverId,
        profileId: profileId,
      },
      data,
    });
  }
}
