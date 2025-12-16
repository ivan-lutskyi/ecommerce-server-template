import {
  Controller,
  Get,
  Param,
  NotFoundException,
  Post,
  Body,
  HttpException,
} from '@nestjs/common';
import { CreatePromoDto } from './dto/create-promo.dto';
import { PromosService } from './promos.service';

@Controller('promos')
export class PromosController {
  constructor(private readonly promosService: PromosService) {}

  @Get(':code')
  async findOne(@Param('code') code: string) {
    // throw new NotFoundException('Promos are now unavailable');

    try {
      const res = await this.promosService.findOne(code);

      if (res) {
        return res;
      }

      throw new NotFoundException('Incorrect promo code');
    } catch (error) {
      throw new NotFoundException('Incorrect promo code');
    }
  }

  @Post()
  async createPromo(@Body() order: CreatePromoDto) {
    try {
      return await this.promosService.createPromo(order as CreatePromoDto);
    } catch (error) {
      const { message, status } = JSON.parse(error.message);

      throw new HttpException(message, status);
    }
  }
}
