import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../cores/dao/prisma.service';
import { ProfileService } from '../profile/profile.service';
import * as jwt from 'jsonwebtoken';
import { GoogleProfile } from 'passport-google-oauth20';
import { ProfileRepository } from '@cores/repositories/profile.repository';

@Injectable()
export class AuthService {
  private hmsAccessKey = '6744186b33ce74ab9be948d4';
  private hmsSecret = 'jrDt3AG4wa9uEa9zswzPDYQAZmZH-5N5ZnfM2GPK0EuPC-N87bJWLsHOa3gFEIBycErrjqXMcXJeNH0B8QYtQRDKLlvEfF-Ehj5-6W2-_7pV94xyYH5-W264cLfeICYSVgJ4CkMvJKimbmN9KCgIMaCqEEuBbNtbWLvnzRqgqnk=';

  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private profileService: ProfileService,
    private profileRepository: ProfileRepository
  ) {}

  async signIn(email: string, password: string): Promise<{ access_token: string; profile: any }> {
    const profile = await this.prisma.profile.findUnique({
      where: { email },
    });

    if (!profile) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const [storedHash, storedSalt] = profile.password.split('.');
    const inputPasswordHash = this.profileService.hashPassword(password, storedSalt);

    if (storedHash !== inputPasswordHash.split('.')[0]) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: profile.id,
      email: profile.email,
      userId: profile.userId,
      name: profile.name,
    };

    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
      profile: {
        profileId: profile.id,
        profileName: profile.name,
        profileUserId: profile.userId,
        profileEmail: profile.email,
      },
    };
  }

  async validateUserFromGoogle(profile: GoogleProfile): Promise<{ access_token: string; profile: any }> {
    const { emails, displayName } = profile;
    const email = emails[0].value;

    let user = await this.profileRepository.getOne({ where: { email } });

    if (!user) {
      user = await this.profileRepository.createUser({
        email,
        userId: `${displayName}Google`,
        name: displayName,
        imageUrl: 'https://res.cloudinary.com/ds7udoemg/image/upload/v1732779178/lufyvfdbb24zhtloali7.png',
        password: '123456789', 
      });
    }

    const payload = {
      sub: user.id,
      email: user.email,
      userId: user.userId,
      name: user.name,
    };

    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
      profile: {
        profileId: user.id,
        profileName: user.name,
        profileUserId: user.userId,
        profileEmail: user.email,
      },
    };
  }

  async validateUserFromToken(token: string): Promise<any> {
    try {
      const decodedToken = this.jwtService.verify(token);

      if (!decodedToken || !decodedToken.sub) {
        throw new UnauthorizedException('Invalid token');
      }

      const profile = await this.prisma.profile.findUnique({
        where: { id: decodedToken.sub },
      });

      if (!profile) {
        throw new UnauthorizedException('Profile not found');
      }

      return profile;
    } catch (error) {
      throw new UnauthorizedException('Token validation failed');
    }
  }

  async generateHmsToken(roomId: string, userId: string, role: string): Promise<string> {
    try {
      const payload = {
        access_key: this.hmsAccessKey,
        room_id: roomId,
        user_id: userId,
        role,
      };

      const options: jwt.SignOptions = {
        algorithm: 'HS256',
        expiresIn: '2h',
      };

      return jwt.sign(payload, this.hmsSecret, options);
    } catch (error) {
      throw new Error('Failed to generate 100ms token');
    }
  }
}
