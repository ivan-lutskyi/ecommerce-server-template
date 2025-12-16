import { Test, TestingModule } from '@nestjs/testing';
import { MediaController } from './media.controller';
import { MediaService, MediaUploadResult } from './media.service';
import { BadRequestException } from '@nestjs/common';
import { Express } from 'express';

describe('MediaController', () => {
  let controller: MediaController;
  let service: jest.Mocked<MediaService>;

  const mockFile: Express.Multer.File = {
    fieldname: 'file',
    originalname: 'test.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    size: 1024,
    buffer: Buffer.from('test'),
    destination: '',
    filename: '',
    path: '',
    stream: null as any,
  };

  const mockUploadResult: MediaUploadResult = {
    url: 'https://example.com/image.jpg',
    publicId: 'shopItems/images/PROD-001/PROD-001_1',
    type: 'image',
    originalName: 'test.jpg',
  };

  beforeEach(async () => {
    const mockService = {
      uploadShopItemMedia: jest.fn(),
      uploadBannerMedia: jest.fn(),
      deleteMedia: jest.fn(),
      generateOptimizedImageUrl: jest.fn(),
      generateOptimizedVideoUrl: jest.fn(),
      convertLegacyUrl: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MediaController],
      providers: [
        {
          provide: MediaService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<MediaController>(MediaController);
    service = module.get(MediaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadShopItemMedia', () => {
    it('should upload shop item media files', async () => {
      const files = [mockFile];
      const results = [mockUploadResult];
      service.uploadShopItemMedia.mockResolvedValue(results);

      const result = await controller.uploadShopItemMedia('PROD-001', files);

      expect(result).toEqual(results);
      expect(service.uploadShopItemMedia).toHaveBeenCalledWith(files, 'PROD-001');
    });

    it('should throw BadRequestException if no files provided', async () => {
      await expect(controller.uploadShopItemMedia('PROD-001', [])).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if file type is invalid', async () => {
      const invalidFile = { ...mockFile, mimetype: 'application/pdf' };

      await expect(
        controller.uploadShopItemMedia('PROD-001', [invalidFile]),
      ).rejects.toThrow(BadRequestException);
    });

    it('should accept video files', async () => {
      const videoFile = { ...mockFile, mimetype: 'video/mp4' };
      const results: MediaUploadResult[] = [{ ...mockUploadResult, type: 'video' as const }];
      service.uploadShopItemMedia.mockResolvedValue(results);

      const result = await controller.uploadShopItemMedia('PROD-001', [videoFile]);

      expect(result).toEqual(results);
    });
  });

  describe('uploadBannerMedia', () => {
    it('should upload banner media file', async () => {
      service.uploadBannerMedia.mockResolvedValue(mockUploadResult);

      const result = await controller.uploadBannerMedia('banner-name', mockFile);

      expect(result).toEqual(mockUploadResult);
      expect(service.uploadBannerMedia).toHaveBeenCalledWith(mockFile, 'banner-name');
    });

    it('should throw BadRequestException if no file provided', async () => {
      await expect(
        controller.uploadBannerMedia('banner-name', null as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if file type is invalid', async () => {
      const invalidFile = { ...mockFile, mimetype: 'application/pdf' };

      await expect(
        controller.uploadBannerMedia('banner-name', invalidFile),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteMedia', () => {
    it('should delete media by publicId', async () => {
      service.deleteMedia.mockResolvedValue(undefined);

      const result = await controller.deleteMedia('shopItems/images/PROD-001/PROD-001_1');

      expect(result).toEqual({ message: 'Media deleted successfully' });
      expect(service.deleteMedia).toHaveBeenCalledWith(
        'shopItems/images/PROD-001/PROD-001_1',
      );
    });
  });
});

