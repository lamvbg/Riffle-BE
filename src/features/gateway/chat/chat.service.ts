import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../cores/dao/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async saveChannelMessage(data: { memberId: string; channelId: string; content: string, fileUrl?: string }) {
    return this.prisma.message.create({
      data: {
        memberId: data.memberId,
        channelId: data.channelId,
        content: data.content,
        fileUrl: data.fileUrl
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });
  }

  async getMemberDetails(memberIds: string[]): Promise<any[]> {
    // Filter out undefined or null values from the array
    const validMemberIds = memberIds.filter((id) => id !== undefined && id !== null);
  
    // Proceed with the query using the filtered array
    return this.prisma.member.findMany({
      where: {
        id: {
          in: validMemberIds,
        },
      },
      select: {
        id: true,
        profile: true,
      },
    });
  }
  
  

  async saveDirectMessage(data: { memberId: string; conversationId: string; content: string, fileUrl?: string }) {
    return this.prisma.directMessage.create({
      data: {
        memberId: data.memberId,
        conversationId: data.conversationId,
        content: data.content,
        fileUrl: data.fileUrl
      },
    });
  }
}
