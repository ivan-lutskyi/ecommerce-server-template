import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  Param,
  BadRequestException,
  Delete,
  UploadedFile,
} from '@nestjs/common';
import { FilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { MediaService, MediaUploadResult } from './media.service';
import { Express } from 'express';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('shop-items/:id/upload')
  @UseInterceptors(FilesInterceptor('files', 10)) // Allow up to 10 files
  async uploadShopItemMedia(
    @Param('id') shopItemId: string,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<MediaUploadResult[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    // Validate file types
    for (const file of files) {
      const isValidImage = file.mimetype.startsWith('image/');
      const isValidVideo = file.mimetype.startsWith('video/');
      
      if (!isValidImage && !isValidVideo) {
        throw new BadRequestException(`Invalid file type: ${file.mimetype}`);
      }
    }

    return this.mediaService.uploadShopItemMedia(files, shopItemId);
  }

  @Post('banners/upload/:bannerName')
  @UseInterceptors(FileInterceptor('file'))
  async uploadBannerMedia(
    @Param('bannerName') bannerName: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<MediaUploadResult> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const isValidImage = file.mimetype.startsWith('image/');
    const isValidVideo = file.mimetype.startsWith('video/');
    
    if (!isValidImage && !isValidVideo) {
      throw new BadRequestException(`Invalid file type: ${file.mimetype}`);
    }

    return this.mediaService.uploadBannerMedia(file, bannerName);
  }

  @Delete(':publicId')
  async deleteMedia(@Param('publicId') publicId: string): Promise<{ message: string }> {
    await this.mediaService.deleteMedia(publicId);
    return { message: 'Media deleted successfully' };
  }
}
