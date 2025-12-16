import { Injectable } from '@nestjs/common';
import { CloudinaryService, CloudinaryResponse } from '../cloudinary/cloudinary.service';
import { Express } from 'express';

export interface MediaUploadResult {
  url: string;
  publicId: string;
  type: 'image' | 'video';
  originalName: string;
}

@Injectable()
export class MediaService {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  async uploadShopItemMedia(
    files: Express.Multer.File[],
    shopItemId: string,
  ): Promise<MediaUploadResult[]> {
    const results: MediaUploadResult[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isVideo = file.mimetype.startsWith('video/');
      const folder = `shopItems/${isVideo ? 'videos' : 'images'}/${shopItemId}`;
      
      // Generate custom naming with full path: folder/filename
      // For example: shopItems/images/PROD-001/PROD-001_1
      const publicId = `${folder}/${shopItemId}_${i + 1}`;
      
      let cloudinaryResult: CloudinaryResponse;
      
      if (isVideo) {
        cloudinaryResult = await this.cloudinaryService.uploadVideo(file, folder, {
          public_id: publicId,
        });
      } else {
        cloudinaryResult = await this.cloudinaryService.uploadImage(file, folder, {
          public_id: publicId,
        });
      }

      results.push({
        url: cloudinaryResult.secure_url,
        publicId: cloudinaryResult.public_id,
        type: isVideo ? 'video' : 'image',
        originalName: file.originalname,
      });
    }

    return results;
  }

  async uploadBannerMedia(
    file: Express.Multer.File,
    bannerName: string,
  ): Promise<MediaUploadResult> {
    const isVideo = file.mimetype.startsWith('video/');
    const folder = `banners/${isVideo ? 'videos' : 'images'}`;
    const publicId = `${bannerName}_${Date.now()}`;

    let cloudinaryResult: CloudinaryResponse;
    
    if (isVideo) {
      cloudinaryResult = await this.cloudinaryService.uploadVideo(file, folder, {
        public_id: publicId,
      });
    } else {
      cloudinaryResult = await this.cloudinaryService.uploadImage(file, folder, {
        public_id: publicId,
      });
    }

    return {
      url: cloudinaryResult.secure_url,
      publicId: cloudinaryResult.public_id,
      type: isVideo ? 'video' : 'image',
      originalName: file.originalname,
    };
  }

  async deleteMedia(publicId: string): Promise<void> {
    await this.cloudinaryService.deleteFile(publicId);
  }

  // Generate URLs for existing media with optimization
  generateOptimizedImageUrl(
    publicId: string,
    width?: number,
    height?: number,
  ): string {
    return this.cloudinaryService.generateUrl(publicId, {
      width,
      height,
      crop: 'fill',
      quality: 'auto',
      format: 'auto',
    });
  }

  generateOptimizedVideoUrl(
    publicId: string,
    width?: number,
    height?: number,
  ): string {
    return this.cloudinaryService.generateVideoUrl(publicId, {
      width,
      height,
      quality: 'auto',
      format: 'auto',
    });
  }

  // Convert old URL to Cloudinary URL structure
  convertLegacyUrl(oldUrl: string): string {
    // Extract filename from old URL
    // Example: https://example-server.com/assets/shopItems/PROD-001_1.jpg
    const match = oldUrl.match(/\/([^\/]+)\.jpg$/);
    if (match) {
      const filename = match[1];
      // Convert to Cloudinary format
      return this.cloudinaryService.generateUrl(`shopItems/images/${filename}`, {
        quality: 'auto',
        format: 'auto',
      });
    }
    return oldUrl; // Return original if can't parse
  }
}
