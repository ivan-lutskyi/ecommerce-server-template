import { LiqpayCallbackDto } from '../order/dto/liqpayCallback.dto';

const decodeLiqpayData = (data: string): LiqpayCallbackDto => {
  return JSON.parse(Buffer.from(data, 'base64').toString('utf-8'));
};
export default decodeLiqpayData;
