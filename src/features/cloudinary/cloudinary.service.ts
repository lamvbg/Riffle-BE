import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import { Multer } from 'multer';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_KEY,
      api_secret: process.env.CLOUDINARY_SECRET,
    });
  }

  async uploadFile(
    file: Multer.File,
  ): Promise<{ result: string} | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const resourceType = this.getResourceType(file.mimetype);

      const upload = cloudinary.uploader.upload_stream(
        { resource_type: resourceType },
        (error, result: UploadApiResponse) => {
          if (error) return reject(error);
          resolve({ result: result.secure_url });
        },
      );

      Readable.from(file.buffer).pipe(upload);
    });
  }

  private getResourceType(mimeType: string): 'image' | 'raw' {
    return mimeType.startsWith('image/') ? 'image' : 'raw';
  }

  async deleteFile(publicId: string, resourceType: 'image' | 'raw' = 'raw'): Promise<any> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(
        publicId,
        { resource_type: resourceType },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        },
      );
    });
  }

  async deleteFileByUrl(fileUrl: string): Promise<any> {
    if (!fileUrl) {
      throw new Error('File URL is required for deletion');
    }
    const publicId = this.extractPublicIdFromUrl(fileUrl);
    const resourceType = this.getResourceTypeFromUrl(fileUrl);

    return this.deleteFile(publicId, resourceType);
  }

  getFileUrl(publicId: string, resourceType: 'image' | 'raw' = 'raw'): string {
    return cloudinary.url(publicId, { resource_type: resourceType, secure: true });
  }

  extractPublicIdFromUrl(fileUrl: string): string {
    const regex = /\/(?:v\d+\/)?([^\/]+?)(?:\.[a-zA-Z]+)?$/;
    const match = fileUrl.match(regex);
    if (match && match[1]) {
      return match[1];
    }
    throw new Error('Invalid file URL format');
  }

  private getResourceTypeFromUrl(fileUrl: string): 'image' | 'raw' {
    const extension = fileUrl.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'svg', 'webp'].includes(extension)) {
      return 'image';
    }
    return 'raw';
  }
}
