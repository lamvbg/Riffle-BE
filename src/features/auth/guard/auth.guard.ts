import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { Request } from 'express';
  
  @Injectable()
  export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}
  
    // Guard logic to check for token and validate
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest<Request>();
      const token = this.extractTokenFromHeader(request);
      if (!token) {
        throw new UnauthorizedException('No token found');
      }
  
      try {
        // Verify the token
        const payload = await this.jwtService.verifyAsync(token, {
          secret: process.env.JWT_SECRET, // Use environment variables for security
        });
        (request as any).user = payload; // Attach the user data to the request
      } catch (error) {
        throw new UnauthorizedException('Invalid token');
      }
      return true;
    }
  
    // Extract token from Authorization header
    private extractTokenFromHeader(request: Request): string | undefined {
      const [type, token] = request.headers.authorization?.split(' ') ?? [];
      return type === 'Bearer' ? token : undefined;
    }
  }
  