import { Injectable } from '@nestjs/common';
import { Prisma, Profile, Server } from '@prisma/client';
import { PrismaService } from '../dao/prisma.service';
import { BaseRepoAbstraction } from '../repositories/base-repo.abstraction';

@Injectable()
export class ProfileRepository extends BaseRepoAbstraction<
  Profile,
  Prisma.ProfileDelegate,
  Prisma.ProfileCreateInput,
  Prisma.ProfileWhereInput,
  Prisma.ProfileOrderByWithRelationInput,
  Prisma.ProfileWhereUniqueInput,
  Prisma.ProfileUpdateInput 
> {
  public constructor(private prismaService: PrismaService) {
    super();
    this.collection = prismaService.profile;
  }

}

