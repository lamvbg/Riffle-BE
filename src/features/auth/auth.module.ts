import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthGuard } from './guard/auth.guard';
import { JwtStrategy } from './strategy/jwt.strategy';
import { PrismaService } from '../../cores/dao/prisma.service';
import { AuthController } from './auth.controller';
import { ProfileService } from '../profile/profile.service';
import { ProfileRepository } from '@cores/repositories/profile.repository';
import { ServerRepository } from '@cores/repositories/server.repository';
import { GoogleStrategy } from './strategy/google.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, JwtStrategy, PrismaService, ProfileService, ProfileRepository, ServerRepository, GoogleStrategy],
  exports: [AuthService],
})
export class AuthModule {}
