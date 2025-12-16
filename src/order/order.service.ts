import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';
import { sendOrderUaEmail, sendOrderWwEmail } from '../utils/sendEmail';
import { CreateOrderDto, OrderUADto } from './dto/order.dto';
import { OrderUA, OrderWW } from './schemas/order.schema';
import { WfpPaymentTransaction } from './dto/wfpPayment.dto';
import { IOrderRepository } from '../repositories/interfaces/order.repository.interface';
import { IShopItemV2Repository } from '../repositories/interfaces/shop-item-v2.repository.interface';
import { REPOSITORY_TOKENS } from '../repositories/repository.providers';

@Injectable()
export class OrderService {
  constructor(
    @Inject(REPOSITORY_TOKENS.ORDER)
    private orderRepository: IOrderRepository,
    @Inject(REPOSITORY_TOKENS.SHOP_ITEM_V2)
    private shopItemRepository: IShopItemV2Repository,
  ) {}

  async getAll(): Promise<(OrderUA | OrderWW)[]> {
    return this.orderRepository.findAll();
  }

  async deleteOrder(id: string): Promise<any> {
    return this.orderRepository.delete(id);
  }

  async createOrder(orderDto: CreateOrderDto): Promise<any> {
    const { items } = orderDto;

    try {
      // Validate inventory using ShopItem repository
      for (const item of items) {
        const shopItem = await this.shopItemRepository.findById(item.id);

        if (!shopItem) {
          throw new BadRequestException(`Shop item with ID ${item.id} not found`);
        }

        const amount = shopItem.amount[item.size];

        if (!!amount && amount <= 0) {
          throw new BadRequestException(
            `No ${item.size}-size items of item with ID ${item.id} left`,
          );
        }
      }

      const newOrder = await this.orderRepository.create(orderDto);

      if (orderDto.orderType === 'ukraine') {
        const {
          email,
          fullName,
          phone,
          city,
          novaPoshta,
          items,
          price,
          promo,
          currency,
        } = { ...orderDto, ...orderDto.orderData } as OrderUADto & CreateOrderDto;

        sendOrderUaEmail(
          {
            email,
            fullName,
            phone,
            city,
            novaPoshta,
            items,
            price,
            promo,
            currency,
          },
          true,
        );
      }

      return newOrder;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  testEmail() {
    sendOrderWwEmail(
      'test@example.com',
      'John Doe',
      '+1234567890',
      'New York',
      'United States',
      '10001',
      '123 Main Street',
      [
        {
          id: 'PROD-001',
          title: 'Example Product',
          size: 'M',
        },
      ],
      99.99,
      null,
      'eur',
    );
  }

  async approveOrder(paymentResponse: WfpPaymentTransaction) {
    if (paymentResponse.reasonCode !== 1100) {
      return null;
    }

    const order = await this.orderRepository.findById(
      paymentResponse.orderReference,
    );

    if (!order || order.approved) {
      return null;
    }

    // Update inventory for each item
    for (const item of order.items) {
      const shopItem = await this.shopItemRepository.findById(item.id);

      if (!shopItem) {
        throw new BadRequestException(`Shop item with ID ${item.id} not found`);
      }

      const amount = shopItem.amount[item.size];

      if (amount <= 0) {
        throw new BadRequestException(
          `No ${item.size}-size items of item with ID ${item.id} left`,
        );
      }

      // Decrement inventory
      const updatedAmount = { ...shopItem.amount };
      updatedAmount[item.size] = amount - 1;
      await this.shopItemRepository.update(item.id, { amount: updatedAmount });
    }

    // Mark order as approved
    await this.orderRepository.updateApproval(
      paymentResponse.orderReference,
      true,
    );

    // Send confirmation email
    if (order.orderType === 'ukraine') {
      sendOrderUaEmail(order as OrderUA);
    } else {
      const {
        email,
        fullName,
        phone,
        city,
        countryCityRegion,
        postalCode,
        address,
        items,
        price,
        promo,
        currency,
      } = order as OrderWW;
      sendOrderWwEmail(
        email,
        fullName,
        phone,
        city,
        countryCityRegion,
        postalCode,
        address,
        items,
        price,
        promo,
        currency,
      );
    }
  }
  async approveOrderAdmin(id: string) {
    const order = await this.orderRepository.findById(id);

    if (!order || order.approved) {
      return;
    }

    // Update inventory for each item
    for (const item of order.items) {
      const shopItem = await this.shopItemRepository.findById(item.id);

      if (!shopItem) {
        throw new BadRequestException(`Shop item with ID ${item.id} not found`);
      }

      const amount = shopItem.amount[item.size];

      if (amount <= 0) {
        throw new BadRequestException(
          `No ${item.size}-size items of item with ID ${item.id} left`,
        );
      }

      // Decrement inventory
      const updatedAmount = { ...shopItem.amount };
      updatedAmount[item.size] = amount - 1;
      await this.shopItemRepository.update(item.id, { amount: updatedAmount });
    }

    // Mark order as approved
    await this.orderRepository.updateApproval(id, true);

    // Send confirmation email
    if (order.orderType === 'ukraine') {
      sendOrderUaEmail(order as OrderUA);
    } else {
      const {
        email,
        fullName,
        phone,
        city,
        countryCityRegion,
        postalCode,
        address,
        items,
        price,
        promo,
        currency,
      } = order as OrderWW;
      sendOrderWwEmail(
        email,
        fullName,
        phone,
        city,
        countryCityRegion,
        postalCode,
        address,
        items,
        price,
        promo,
        currency,
      );
    }
  }

  async findAllByEmail(email: string): Promise<(OrderUA | OrderWW)[]> {
    return this.orderRepository.findByEmail(email);
  }
}
