export interface Policy {
  id: string;
  productId: string;
  customerName: string;
  startDate: string;
  endDate: string;
  premium: number;
  status: 'active' | 'expired' | 'cancelled';
  createdAt: string;
}