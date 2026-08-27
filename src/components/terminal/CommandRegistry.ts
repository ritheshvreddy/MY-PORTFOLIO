import type { Command } from "./types";
import type { TerminalCommand } from "../../types/terminal";

let registry: Record<string, Command> = {};

export function buildRegistry(
  commands: TerminalCommand[]
) {
  registry = {};

  commands.forEach((command) => {
    registry[command.command] = {
      description: command.description ?? "",

      execute: () => command.output,
    };
  });
}

export function getRegistry() {
  return registry;
}