export interface ExpenseSplit {
  pk: string;
  sk: string;
  entity: string;
  group_id: string;
  expense_id: string;
  user_id: string;
  amount_owed: number;
  percentage?: number;
  split_type: string;
  created_at: string;
  updated_at: string;
}
