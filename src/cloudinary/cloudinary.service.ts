import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Express } from 'express';

export interface CloudinaryResponse {
  public_id: string;
  secure_url: string;
  format: string;
  resource_type: string;
  bytes: number;
  width?: number;
  height?: number;
  duration?: number; // For videos
}

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
    folder: string = 'shopItems/images',
    options?: any,
  ): Promise<CloudinaryResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          // Don't pass folder if public_id already contains full path
          ...(options?.public_id?.includes('/') ? {} : { folder }),
          resource_type: 'image',
          quality: 'auto',
          ...options,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result as CloudinaryResponse);
          }
        },
      ).end(file.buffer);
    });
  }

  async uploadVideo(
    file: Express.Multer.File,
    folder: string = 'shopItems/videos',
    options?: any,
  ): Promise<CloudinaryResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          // Don't pass folder if public_id already contains full path
          ...(options?.public_id?.includes('/') ? {} : { folder }),
          resource_type: 'video',
          quality: 'auto',
          format: 'auto',
          ...options,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result as CloudinaryResponse);
          }
        },
      ).end(file.buffer);
    });
  }

  async deleteFile(publicId: string): Promise<any> {
    return cloudinary.uploader.destroy(publicId);
  }

  // Generate optimized URL for existing files
  generateUrl(
    publicId: string,
    options: {
      width?: number;
      height?: number;
      crop?: string;
      quality?: string;
      format?: string;
    } = {},
  ): string {
    return cloudinary.url(publicId, {
      secure: true,
      quality: options.quality || 'auto',
      format: options.format || 'auto',
      ...options,
    });
  }

  // Generate video URL with transformations
  generateVideoUrl(
    publicId: string,
    options: {
      width?: number;
      height?: number;
      quality?: string;
      format?: string;
    } = {},
  ): string {
    return cloudinary.url(publicId, {
      resource_type: 'video',
      secure: true,
      quality: options.quality || 'auto',
      format: options.format || 'auto',
      ...options,
    });
  }
}
