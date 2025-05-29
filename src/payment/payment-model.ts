export interface Payment {
  pk: string;
  sk: string;
  entity: string;
  payment_id: string;
  group_id: string;
  from_user: string;
  to_user: string;
  amount: number;
  currency: string;
  created_at: string;
  updated_at: string;
}
