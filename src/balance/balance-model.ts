export interface Balance {
  pk: string;
  sk: string;
  entity: string;
  group_id: string;
  user_id: string;
  currency: string;
  balance_map: Record<string, number>;
  created_at: string;
  updated_at: string;
}
