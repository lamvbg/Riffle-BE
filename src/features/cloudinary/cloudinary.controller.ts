import {
    Controller,
    Post,
    Delete,
    Body,
    UploadedFile,
    UseInterceptors,
    Param,
  } from '@nestjs/common';
  import { CloudinaryService } from './cloudinary.service';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { Multer } from 'multer';
  
  @Controller('cloudinary')
  export class CloudinaryController {
    constructor(private readonly cloudinaryService: CloudinaryService) {}
  
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Multer.File) {
      if (!file) {
        throw new Error('File not found');
      }
      const result = await this.cloudinaryService.uploadFile(file);
      return result;
    }
  
    @Delete('delete')
    async deleteFileByUrl(@Body('fileUrl') fileUrl: string) {
      const result = await this.cloudinaryService.deleteFileByUrl(fileUrl);
      return result;
    }
  }
  