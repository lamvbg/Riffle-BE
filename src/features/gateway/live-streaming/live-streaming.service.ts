import { Injectable } from '@nestjs/common';
import { StreamChat } from 'stream-chat';

@Injectable()
export class StreamService {
  private readonly apiKey = 'ezc3czdn98xg';
  private readonly secret = 'yss5pbmgw97zdwwwtfmce79975wxkydzjk9wpkggpgxjpayhqz8uqdye2p4fkjbw';
  private readonly serverClient: StreamChat;

  constructor() {
    this.serverClient = StreamChat.getInstance(this.apiKey, this.secret);
  }

  generateToken(userId: string): string {
    return this.serverClient.createToken(userId);
  }
}
