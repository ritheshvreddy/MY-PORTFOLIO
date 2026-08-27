export interface TerminalCommand {
  id: string;

  command: string;

  description: string | null;

  output: string[];

  display_order: number;

  published: boolean;

  created_at: string;

  updated_at: string;
}