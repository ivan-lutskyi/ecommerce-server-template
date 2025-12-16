import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IOrderRepository } from '../interfaces/order.repository.interface';
import {
  OrderUA,
  OrderWW,
  OrderUADocument,
  OrderWWDocument,
} from '../../order/schemas/order.schema';
import { CreateOrderDto } from '../../order/dto/order.dto';

/**
 * Real MongoDB repository for Orders.
 */
@Injectable()
export class MongoOrderRepository implements IOrderRepository {
  constructor(
    @InjectModel(OrderUA.name) private orderUaModel: Model<OrderUADocument>,
    @InjectModel(OrderWW.name) private orderWwModel: Model<OrderWWDocument>,
  ) {}

  async findAll(): Promise<(OrderUA | OrderWW)[]> {
    const ordersUa = await this.orderUaModel.find().exec();
    const ordersWw = await this.orderWwModel.find().exec();
    return [...ordersUa, ...ordersWw];
  }

  async findById(orderId: string): Promise<OrderUA | OrderWW | null> {
    const uaOrder = await this.orderUaModel.findOne({ orderId }).exec();
    if (uaOrder) return uaOrder;
    return this.orderWwModel.findOne({ orderId }).exec();
  }

  async findByEmail(email: string): Promise<(OrderUA | OrderWW)[]> {
    const emailRegex = new RegExp(email, 'i');
    const ordersUa = await this.orderUaModel.find({ email: emailRegex }).exec();
    const ordersWw = await this.orderWwModel.find({ email: emailRegex }).exec();
    return [...ordersUa, ...ordersWw];
  }

  async create(orderDto: CreateOrderDto): Promise<OrderUA | OrderWW> {
    const modelData = {
      ...orderDto,
      ...orderDto.orderData,
    };

    const newOrder =
      orderDto.orderType === 'ukraine'
        ? new this.orderUaModel(modelData)
        : new this.orderWwModel(modelData);

    return newOrder.save();
  }

  async delete(orderId: string): Promise<boolean> {
    const uaResult = await this.orderUaModel.findOneAndDelete({ orderId }).exec();
    if (uaResult) return true;
    const wwResult = await this.orderWwModel.findOneAndDelete({ orderId }).exec();
    return !!wwResult;
  }

  async updateApproval(
    orderId: string,
    approved: boolean,
  ): Promise<OrderUA | OrderWW | null> {
    const uaOrder = await this.orderUaModel
      .findOneAndUpdate({ orderId }, { approved }, { new: true })
      .exec();
    if (uaOrder) return uaOrder;
    return this.orderWwModel
      .findOneAndUpdate({ orderId }, { approved }, { new: true })
      .exec();
  }
}

