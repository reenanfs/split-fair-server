export interface Payment {
  pk: string;
  sk: string;
  group_id: string;
  user_id: string;
  currency: string;
  balance_map: { [key: string]: number };
  created_at: string;
  updated_at: string;
}
