import { getRegistry } from "./CommandRegistry";

export interface ParsedCommand {
  cmd: string;
  args: string[];
  exists: boolean;
}

export function parseCommand(
  input: string
): ParsedCommand {

  const trimmed = input.trim();

  if (!trimmed) {
    return {
      cmd: "",
      args: [],
      exists: false,
    };
  }

  const parts = trimmed.split(/\s+/);

  const cmd = parts[0].toLowerCase();

  const args = parts.slice(1);

  const commands = getRegistry();

  return {
    cmd,
    args,
    exists: cmd in commands,
  };
}