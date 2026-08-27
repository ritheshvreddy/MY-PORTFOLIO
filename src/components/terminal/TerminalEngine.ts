import { getRegistry } from "./CommandRegistry";
import { parseCommand } from "./parser";

export interface TerminalResult {
  type: "output" | "error" | "clear" | "resume";
  output: string[];
}

export function runCommand(
  input: string
): TerminalResult {

  const { cmd, args, exists } =
    parseCommand(input);

  if (!cmd) {
    return {
      type: "output",
      output: [],
    };
  }

  if (cmd === "clear") {
    return {
      type: "clear",
      output: [],
    };
  }

  if (cmd === "resume") {
    return {
      type: "resume",
      output: [
        "Downloading resume...",
        "Download started successfully.",
      ],
    };
  }

  if (cmd === "date") {
    return {
      type: "output",
      output: [new Date().toString()],
    };
  }

  if (!exists) {
    return {
      type: "error",
      output: [
        `Command not found: ${cmd}`,
        "Type 'help' to see available commands.",
      ],
    };
  }

  const commands = getRegistry();

  const result =
    commands[cmd].execute(args);

  return {
    type: "output",
    output: Array.isArray(result)
      ? result
      : [result],
  };
}