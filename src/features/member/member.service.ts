import { Injectable } from '@nestjs/common';
import { MemberRepository } from '../../cores/repositories/member.repository';
import { Prisma, MemberRole } from '@prisma/client';
import { ServerRepository } from '../../cores/repositories/server.repository';
import { ProfileService } from '../profile/profile.service';
import { PrismaService } from '../../cores/dao/prisma.service';

@Injectable()
export class MemberService {
  constructor(
    private readonly memberRepository: MemberRepository,
    private readonly serverRepository: ServerRepository,
    private readonly profileService: ProfileService,
    private readonly prisma: PrismaService
  ) {}

  async deleteMember(serverId: string, memberId: string) {

    const server = await this.prisma.server.update({
      where: { id: serverId },
      data: {
        members: {
          delete: {
            id: memberId,
          },
        },
      },
      include: {
        members: {
          orderBy: {
            role: 'asc',
          },
        },
      },
    });

    return server;
  }

  async getMember(memberId: string) {
    return this.memberRepository.getOne({
      where: { id: memberId },
    });
  }
  async updateMemberRole( serverId: string, memberId: string, role: string) {
    const roleToUpdate = MemberRole[role as keyof typeof MemberRole];
  
    const server = await this.prisma.server.update({
      where: { id: serverId },
      data: {
        members: {
          update: {
            where: { id: memberId },
            data: { role: roleToUpdate },
          },
        },
      },
      include: {
        members: {
          orderBy: { role: 'asc' },
        },
      },
    });
  
    return server;
  }

  async updateMemberOnline(serverId: string, memberId: string, isOnline: boolean) {
    const server = await this.prisma.server.update({
      where: { id: serverId },
      data: {
        members: {
          update: {
            where: { id: memberId },
            data: { isOnline },
          },
        },
      },
      include: {
        members: {
          orderBy: { role: 'asc' },
        },
      },
    });
  
    return server;
  }

  async getAllMembersByServerId(serverId: string) {
    const members = await this.prisma.member.findMany({
      where: { serverId },
      include: {
        profile: true,
      },
      orderBy: {
        role: 'asc',
      },
    });

    return members;
  }
  
}