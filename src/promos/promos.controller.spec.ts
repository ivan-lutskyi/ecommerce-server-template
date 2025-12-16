import { Test, TestingModule } from '@nestjs/testing';
import { PromosController } from './promos.controller';
import { PromosService } from './promos.service';
import { PromoItem } from './schemas/promo-item.schema';
import { CreatePromoDto } from './dto/create-promo.dto';
import { NotFoundException, HttpException } from '@nestjs/common';
import { IPromoRepository } from '../repositories/interfaces/promo.repository.interface';
import { REPOSITORY_TOKENS } from '../repositories/repository.providers';

describe('PromosController', () => {
  let controller: PromosController;
  let service: jest.Mocked<PromosService>;

  const mockPromo: PromoItem = {
    name: 'SUMMER10',
    discount: 10,
  } as PromoItem;

  beforeEach(async () => {
    const mockRepository = {
      findByCode: jest.fn(),
      create: jest.fn(),
    };

    const mockService = {
      findOne: jest.fn(),
      createPromo: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PromosController],
      providers: [
        {
          provide: PromosService,
          useValue: mockService,
        },
        {
          provide: REPOSITORY_TOKENS.PROMO,
          useValue: mockRepository,
        },
      ],
    }).compile();

    controller = module.get<PromosController>(PromosController);
    service = module.get(PromosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne', () => {
    it('should return promo by code', async () => {
      service.findOne.mockResolvedValue(mockPromo);

      const result = await controller.findOne('SUMMER10');

      expect(result).toEqual(mockPromo);
      expect(service.findOne).toHaveBeenCalledWith('SUMMER10');
    });

    it('should throw NotFoundException if promo not found', async () => {
      service.findOne.mockResolvedValue(null);

      await expect(controller.findOne('INVALID')).rejects.toThrow(NotFoundException);
    });
  });

  describe('createPromo', () => {
    const createPromoDto: CreatePromoDto = {
      name: 'WINTER20',
      discount: 20,
    };

    it('should create a promo', async () => {
      const createdPromo = { ...createPromoDto } as PromoItem;
      service.createPromo.mockResolvedValue(createdPromo);

      const result = await controller.createPromo(createPromoDto);

      expect(result).toEqual(createdPromo);
      expect(service.createPromo).toHaveBeenCalledWith(createPromoDto);
    });

    it('should throw HttpException on error', async () => {
      service.createPromo.mockRejectedValue(
        new Error(JSON.stringify({ message: 'Duplicate promo', status: 400 })),
      );

      await expect(controller.createPromo(createPromoDto)).rejects.toThrow(
        HttpException,
      );
    });
  });
});
