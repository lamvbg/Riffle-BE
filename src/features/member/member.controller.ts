import {
    Controller,
    Delete,
    Patch,
    Param,
    Query,
    Body,
    UseGuards,
    HttpException,
    HttpStatus,
    Get,
  } from '@nestjs/common';
  import { MemberService } from './member.service';
  
  @Controller('members')  
  export class MemberController {
    constructor(private readonly memberService: MemberService) {}
  
    @Get(':serverId')
    async getMembers(
      @Param('serverId') serverId: string,
    ) {
      return this.memberService.getAllMembersByServerId(serverId);
    }

    @Get('detail/:id')
    async getMember(@Param('id') memberId: string) {
      return this.memberService.getMember(memberId);
    }

    @Patch('role/:memberId')
    async updateMemberRole(
      @Param('memberId') memberId: string,
      @Query('serverId') serverId: string,
      @Body('role') role: string,

    ) {
      try {
        if (!role) {
          throw new HttpException('Role is required', HttpStatus.BAD_REQUEST);
        }
  
        const updatedServer = await this.memberService.updateMemberRole(
          serverId,
          memberId,
          role
        );
  
        return {
          status: 'success',
          message: 'Member role updated successfully',
          data: updatedServer,
        };
      } catch (error) {
        throw new HttpException(
          error.message || 'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }

    @Patch('isOnline/:memberId')
    async updateMemberOnline(
      @Param('memberId') memberId: string,
      @Query('serverId') serverId: string,
      @Body('isOnline') isOnline: boolean,

    ) {
      try {
  
        const updatedServer = await this.memberService.updateMemberOnline(
          serverId,
          memberId,
          isOnline
        );
  
        return {
          status: 'success',
          message: 'Member online successfully',
          data: updatedServer,
        };
      } catch (error) {
        throw new HttpException(
          error.message || 'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }
  
    @Delete(':memberId')
    async deleteMember(
      @Param('memberId') memberId: string,
      @Query('serverId') serverId: string,
    ) {
      try {
        const deletedServer = await this.memberService.deleteMember(
          serverId,
          memberId
        );
  
        return {
          status: 'success',
          message: 'Member deleted successfully',
          data: deletedServer,
        };
      } catch (error) {
        throw new HttpException(
          error.message || 'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }
  }
  