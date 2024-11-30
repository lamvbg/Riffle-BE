import { Injectable } from "@nestjs/common";
import { BaseRepoAbstraction } from "./base-repo.abstraction";
import { Prisma, Setting } from "@prisma/client";
import { PrismaService } from "../../cores/dao/prisma.service";

@Injectable()
export class SettingRepository extends BaseRepoAbstraction<
    Setting,
    Prisma.SettingDelegate,
    Prisma.SettingCreateInput,
    Prisma.SettingWhereInput,
    Prisma.SettingOrderByWithRelationInput,
    Prisma.SettingWhereUniqueInput,
    Prisma.SettingUpdateInput
> {
    public constructor(private prismaService: PrismaService) {
        super();
        this.collection = prismaService.setting;
    }
}