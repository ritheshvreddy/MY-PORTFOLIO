export interface TerminalLine {
  type: "command" | "output" | "error";
  text: string;
}

export interface Command {
  description: string;
  execute: (args: string[]) => string | string[];
}