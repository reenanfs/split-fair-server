export interface User {
  pk: string;
  sk: string;
  entity: string;
  user_id: string;
  email: string;
  name?: string;
  phone?: number;
  profile_picture_url?: string;
  created_at: string;
  updated_at: string;
}
