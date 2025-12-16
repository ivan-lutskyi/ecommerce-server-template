export interface WfpPaymentTransaction {
  merchantAccount: string;
  orderReference: string;
  merchantSignature: string;
  amount: number;
  currency: string;
  authCode: string;
  email: string;
  phone: string;
  createdDate: number;
  processingDate: number;
  cardPan: string;
  cardType: string;
  issuerBankCountry: string;
  issuerBankName: string;
  recToken: string;
  transactionStatus: string;
  reason: string;
  reasonCode: number;
  fee: number;
  paymentSystem: string;
  acquirerBankName?: string;
  cardProduct?: string;
  clientName?: string;
}
