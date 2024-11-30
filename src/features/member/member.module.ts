import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { MemberRepository } from '../../cores/repositories/member.repository';
import { ServerService } from '../server/server.service';
import { ServerRepository } from '../../cores/repositories/server.repository';
import { ProfileService } from '../profile/profile.service';
import { ProfileRepository } from '../../cores/repositories/profile.repository';
import { PrismaService } from '../../cores/dao/prisma.service';

@Module({
  controllers: [MemberController],
  providers: [MemberService, MemberRepository, ServerService, ServerRepository, ProfileService, ProfileRepository, PrismaService],
  exports: [MemberService],
})
export class MemberModule {}
