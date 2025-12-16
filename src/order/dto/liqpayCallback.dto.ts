export type LiqpayCallbackDto = {
  action: 'pay';
  version: 3;
  type: 'buy';
  public_key: 'sandbox_i97219028684';
  currency: 'UAH';
  payment_id: number; // 1981741424
  status: string; // 'success'
  paytype: string; // 'card'
  acq_id: number; // 414963
  order_id: string; // 'e580ce1b-8c43-43fe-b8e7-2d7f4c24c4c7'
  liqpay_order_id: string; // 'ZH3UMVXZ1652446165618288'
  description: string; // Order description with product IDs and sizes (e.g., 'PROD-001 [Size: M]; PROD-002 [Size: L]')
  sender_first_name: string; // '123'
  sender_card_mask2: string; // '444111*26'
  sender_card_bank: string; // 'JSC UNIVERSAL BANK'
  sender_card_type: string; // 'visa'
  sender_card_country: number; // 804
  ip: string; // '176.104.57.235'
  amount: number; // 1
  sender_commission: number; // 0
  receiver_commission: number; // 0.01
  agent_commission: number; // 0.01
  amount_debit: number; // 1
  amount_credit: number; // 1
  commission_debit: number; // 0
  commission_credit: number; // 0.01
  currency_debit: 'UAH';
  currency_credit: 'UAH';
  sender_bonus: number; // 0
  amount_bonus: number; // 0
  mpi_eci: string; // '7'
  is_3ds: boolean; // false
  language: string; // 'ru'
  create_date: number; // 1652446165622
  end_date: number; // 1652446165723
  transaction_id: number; // 1981741424
};
