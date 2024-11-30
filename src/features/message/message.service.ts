import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { Prisma, Message } from '@prisma/client';
import { PrismaService } from '../../cores/dao/prisma.service';
import { ProfileService } from '../profile/profile.service';

@Injectable()
export class MessageService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly profileService: ProfileService,
  ) {}

  async getAllMessage(): Promise<Message[]> {
    return this.prismaService.message.findMany();
  }

  // Get messages with optional cursor for pagination
  async getMessages(channelId: string, profileId: string, cursor?: string): Promise<{ items: Message[], nextCursor: string | null }> {
    // Validate profile existence
    const profile = await this.profileService.getProfileById(profileId);
    if (!profile) {
      throw new UnauthorizedException('Unauthorized');
    }

    if (!channelId) {
      throw new BadRequestException('Channel ID missing');
    }

    let messages: Message[] = [];

    if (cursor) {
      // Fetch messages starting from the cursor for pagination
      messages = await this.prismaService.message.findMany({
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } else {
      // Fetch all messages
      messages = await this.prismaService.message.findMany({
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    // Determine next cursor for pagination
    let nextCursor = null;
    if (messages.length > 0) {
      nextCursor = messages[messages.length - 1].id;
    }

    return {
      items: messages,
      nextCursor,
    };
  }

  async createMessage(channelId: string, memberId: string, content: string): Promise<Message> {
    if (!channelId || !content) {
      throw new BadRequestException('Missing channel ID or content');
    }

    const message = await this.prismaService.message.create({
      data: {
        channelId,
        memberId,
        content,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    return message;
  }
}
