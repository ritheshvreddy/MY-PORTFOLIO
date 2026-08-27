export interface ContactMessage {
  id: string;

  full_name: string;

  email: string;

  subject: string;

  message: string;

  is_read: boolean;

  replied: boolean;

  created_at: string;
}

export interface ContactInput {
  full_name: string;

  email: string;

  subject: string;

  message: string;
}