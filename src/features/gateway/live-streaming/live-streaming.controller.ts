import { Controller, Post, Body } from '@nestjs/common';
import { StreamService } from './live-streaming.service';

@Controller('stream')
export class StreamController {
  constructor(private readonly streamService: StreamService) {}

  @Post('generate-token')
  generateToken(@Body('userId') userId: string) {
    const token = this.streamService.generateToken(userId);
    return { token };
  }
}
