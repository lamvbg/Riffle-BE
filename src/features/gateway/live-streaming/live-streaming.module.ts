import { Module } from '@nestjs/common';
import {  StreamService } from './live-streaming.service';
import { StreamController } from './live-streaming.controller';
// import { LiveStreamingController } from './live-streaming.controller';

@Module({
  providers: [StreamService],
  controllers: [StreamController],
  exports: [StreamService],
})
export class LiveStreamingModule {}