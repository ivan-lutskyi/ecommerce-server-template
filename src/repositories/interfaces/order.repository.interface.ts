import { OrderUA, OrderWW } from '../../order/schemas/order.schema';
import { CreateOrderDto } from '../../order/dto/order.dto';
import { WfpPaymentTransaction } from '../../order/dto/wfpPayment.dto';

export interface IOrderRepository {
  findAll(): Promise<(OrderUA | OrderWW)[]>;
  findById(orderId: string): Promise<OrderUA | OrderWW | null>;
  findByEmail(email: string): Promise<(OrderUA | OrderWW)[]>;
  create(orderDto: CreateOrderDto): Promise<OrderUA | OrderWW>;
  delete(orderId: string): Promise<boolean>;
  updateApproval(orderId: string, approved: boolean): Promise<OrderUA | OrderWW | null>;
}

