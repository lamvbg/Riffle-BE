import { Injectable } from '@nestjs/common';
import { ProfileRepository } from '../../cores/repositories/profile.repository';
import { Prisma, Profile } from '@prisma/client';
import { ServerRepository } from '../../cores/repositories/server.repository';
import * as crypto from 'crypto';

@Injectable()
export class ProfileService {
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly serverRepository: ServerRepository,
  ) {}

  async getProfiles(
    pagination?: { skip?: number; take?: number },
    where?: Prisma.ProfileWhereInput,
  ) {
    return this.profileRepository.get({
      pagination: { skip: pagination?.skip, take: pagination?.take },
      where,
    });
  }

  async getProfileById(profileId: string) {
    return this.profileRepository.getOne({
      where: { id: profileId },
      include: { settings: true },
    });
  }

  async createProfile(data: Prisma.ProfileCreateInput): Promise<Profile> {
    const salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = this.hashPassword(data.password, salt);
    return this.profileRepository.createUser({
      ...data,
      password: hashedPassword,
      settings: {
        create: {
          color: '#ffffff',
          displayName: data.name,
          bio: 'Nothing',
          status: 'meeting',
        },
      },
    });
  }

  async updateProfile(profileId: string, data: Prisma.ProfileUpdateInput) {
    if (data.password) {
      const salt = crypto.randomBytes(16).toString('hex');
      data.password = this.hashPassword(data.password as string, salt);
    }
    return this.profileRepository.updateUser({
      where: { id: profileId },
      data,
    });
  }

  async deleteProfile(profileId: string) {
    return this.profileRepository.deleteUser({ id: profileId });
  }

  async getServersForProfile(profileId: string) {
    return this.serverRepository.get({
      where: {
        members: {
          some: {
            profileId: profileId,
          },
        },
      },
      include: {
        members: true
      },
    });
  }
  

  public hashPassword(password: string, salt: string): string {
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return `${hash}.${salt}`; 
  }
}
