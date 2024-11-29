import { Injectable } from '@nestjs/common';
import { PrismaService } from '../dao/prisma.service';
import { BaseRepoAbstraction } from '../repositories/base-repo.abstraction';

import {
  Member,
  Prisma,
  Server,
  Profile,
} from '@prisma/client'; // Chỉ định các loại của Prisma từ schema

@Injectable()
export class MemberRepository extends BaseRepoAbstraction<
  Member,
  Prisma.MemberDelegate,
  Prisma.MemberCreateInput,
  Prisma.MemberWhereInput,
  Prisma.MemberOrderByWithRelationInput,
  Prisma.MemberWhereUniqueInput,
  Prisma.MemberUpdateInput
> {
  constructor(protected readonly prisma: PrismaService) {
    super();
    this.collection = prisma.member;
  }
}
