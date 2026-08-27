export interface Role {
  title: string;
  organization: string;
  location: string;
  duration: string;

  responsibilities: string[];

  skills: string[];

  future?: boolean;
}