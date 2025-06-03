import { Balance } from 'src/balance/balance-model';
import { ExpenseWithSplit } from 'src/expense/expense-model';
import { Payment } from 'src/payment/payment-model';
import { User } from 'src/user/user-model';

export interface Group {
  pk: string;
  sk: string;
  entity: string;
  group_id: string;
  name: string;
  profile_picture_url?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface GroupDetails {
  group: Group;
  members: User[];
  balances: Balance[];
  payments: Payment[];
  expenses: ExpenseWithSplit[];
}
