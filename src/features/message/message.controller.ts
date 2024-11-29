import { Controller, Get, Query, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { MessageService } from './message.service';
import { Message } from '@prisma/client';
import { ProfileService } from '../profile/profile.service';

@Controller('messages')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly profileService: ProfileService,
  ) {}

  @Get()
  async getMessages(
    @Query('channelId') channelId: string,
    @Query('profileId') profileId: string,
    @Query('cursor') cursor?: string,
  ): Promise<{ items: Message[], nextCursor: string | null }> {
    if (!profileId) {
      throw new UnauthorizedException('Unauthorized');
    }

    if (!channelId) {
      throw new BadRequestException('Channel ID missing');
    }

    return this.messageService.getMessages(channelId, profileId, cursor);
  }
}
