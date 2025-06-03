import { ExpenseSplit } from 'src/expense-split/expense-split-model';

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

export interface ExpenseWithSplit {
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
  splits: ExpenseSplit[];
}
