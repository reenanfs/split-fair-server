export interface Expense {
  pk: string;
  sk: string;
  entity: string;
  group_id: string;
  expense_id: string;
  description: string;
  total_amount: number;
  currency: string;
  created_by: string;
  paid_by: string;
  category?: string;
  created_at: string;
  updated_at: string;
}
