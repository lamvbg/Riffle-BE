import { Controller, Post, Body, Req, UnauthorizedException, Get, Query, UseGuards, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { GoogleAuthGuard } from './guard/google.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('sign-in')
  async signIn(
    @Body('email') email: string,
    @Body('password') password: string,
  ): Promise<{ access_token: string }> {
    return this.authService.signIn(email, password);
  }

  @Get('hms-token')
  async getHmsToken(
    @Query('roomId') roomId: string,
    @Query('userId') userId: string,
    @Query('role') role: string,
  ) {
    if (!roomId || !userId || !role) {
      throw new UnauthorizedException('Missing required parameters');
    }

    const token = await this.authService.generateHmsToken(roomId, userId, role);
    return { token };
  }

  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  handleGoogleLogin() {
    return { message: 'Redirecting to Google login...' };
  }

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const { access_token, profile } = req.user;

    const frontendUrl = 'http://localhost:4200/login/callback';
    res.redirect(
      `${frontendUrl}?token=${access_token}&profileId=${profile.profileId}`,
    );
  }
}
