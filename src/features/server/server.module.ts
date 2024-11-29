import { Module } from '@nestjs/common';
import { PrismaService } from '../../cores/dao/prisma.service';
import { ServerRepository } from '../../cores/repositories/server.repository';
import { ServerService } from './server.service';
import { ServerController } from './server.controller';

@Module({
  providers: [PrismaService, ServerRepository, ServerService],
  controllers: [ServerController],
  exports: [ServerService],
})
export class ServerModule {}