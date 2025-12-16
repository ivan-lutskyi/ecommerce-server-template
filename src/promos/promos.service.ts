import { Injectable, Inject } from '@nestjs/common';
import { CreatePromoDto } from './dto/create-promo.dto';
import { PromoItem } from './schemas/promo-item.schema';
import { IPromoRepository } from '../repositories/interfaces/promo.repository.interface';
import { REPOSITORY_TOKENS } from '../repositories/repository.providers';

@Injectable()
export class PromosService {
  constructor(
    @Inject(REPOSITORY_TOKENS.PROMO)
    private promoRepository: IPromoRepository,
  ) {}

  async findOne(code: string): Promise<PromoItem | null> {
    return this.promoRepository.findByCode(code);
  }

  async createPromo(promoDto: CreatePromoDto): Promise<PromoItem> {
    return this.promoRepository.create(promoDto);
  }
}
