export enum GroupRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  VIEWER = 'VIEWER',
}

export interface GroupMembership {
  pk: string;
  sk: string;
  entity: string;
  user_id: string;
  group_id: string;
  role: GroupRole;
  created_at: string;
  updated_at: string;
}
