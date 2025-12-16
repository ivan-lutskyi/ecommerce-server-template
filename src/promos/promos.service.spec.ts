import { Test, TestingModule } from '@nestjs/testing';
import { PromosService } from './promos.service';
import { IPromoRepository } from '../repositories/interfaces/promo.repository.interface';
import { REPOSITORY_TOKENS } from '../repositories/repository.providers';
import { PromoItem } from './schemas/promo-item.schema';
import { CreatePromoDto } from './dto/create-promo.dto';

describe('PromosService', () => {
  let service: PromosService;
  let repository: jest.Mocked<IPromoRepository>;

  const mockPromo: PromoItem = {
    name: 'SUMMER10',
    discount: 10,
  } as PromoItem;

  beforeEach(async () => {
    const mockRepository = {
      findByCode: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PromosService,
        {
          provide: REPOSITORY_TOKENS.PROMO,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PromosService>(PromosService);
    repository = module.get(REPOSITORY_TOKENS.PROMO);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return promo by code', async () => {
      repository.findByCode.mockResolvedValue(mockPromo);

      const result = await service.findOne('SUMMER10');

      expect(result).toEqual(mockPromo);
      expect(repository.findByCode).toHaveBeenCalledWith('SUMMER10');
    });

    it('should return null if promo not found', async () => {
      repository.findByCode.mockResolvedValue(null);

      const result = await service.findOne('INVALID');

      expect(result).toBeNull();
    });
  });

  describe('createPromo', () => {
    const createPromoDto: CreatePromoDto = {
      name: 'WINTER20',
      discount: 20,
    };

    it('should create a promo', async () => {
      const createdPromo = { ...createPromoDto } as PromoItem;
      repository.create.mockResolvedValue(createdPromo);

      const result = await service.createPromo(createPromoDto);

      expect(result).toEqual(createdPromo);
      expect(repository.create).toHaveBeenCalledWith(createPromoDto);
    });
  });
});
