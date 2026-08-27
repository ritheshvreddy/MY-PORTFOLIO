import { supabase } from "../lib/supabase";

import type {
  TerminalCommand,
} from "../types/terminal";


/* =========================================================
   INPUT TYPE
========================================================= */

export interface TerminalCommandInput {
  command: string;

  description: string | null;

  output: string[];

  display_order: number;

  published: boolean;
}


/* =========================================================
   GET PUBLISHED COMMANDS
========================================================= */

export async function getTerminalCommands():
  Promise<TerminalCommand[]> {

  const {
    data,
    error,
  } =
    await supabase
      .from("terminal_commands")
      .select("*")
      .eq(
        "published",
        true
      )
      .order(
        "display_order",
        {
          ascending: true,
        }
      );


  if (error) {

    console.error(
      "Error fetching terminal commands:",
      error
    );

    return [];

  }


  return (
    data ?? []
  ) as TerminalCommand[];

}


/* =========================================================
   GET ALL COMMANDS - ADMIN
========================================================= */

export async function getAdminTerminalCommands():
  Promise<TerminalCommand[]> {

  const {
    data,
    error,
  } =
    await supabase
      .from("terminal_commands")
      .select("*")
      .order(
        "display_order",
        {
          ascending: true,
        }
      );


  if (error) {

    console.error(
      "Error fetching admin terminal commands:",
      error
    );

    throw error;

  }


  return (
    data ?? []
  ) as TerminalCommand[];

}


/* =========================================================
   CREATE COMMAND
========================================================= */

export async function createTerminalCommand(
  input: TerminalCommandInput
): Promise<TerminalCommand> {

  const {
    data,
    error,
  } =
    await supabase
      .from("terminal_commands")
      .insert({
        command:
          input.command,

        description:
          input.description,

        output:
          input.output,

        display_order:
          input.display_order,

        published:
          input.published,
      })
      .select("*")
      .single();


  if (error) {

    console.error(
      "Error creating terminal command:",
      error
    );

    throw new Error(
      error.message
    );

  }


  return data as TerminalCommand;

}


/* =========================================================
   UPDATE COMMAND
========================================================= */

export async function updateTerminalCommand(
  id: string,
  input: Partial<TerminalCommandInput>
): Promise<TerminalCommand> {

  const {
    data,
    error,
  } =
    await supabase
      .from("terminal_commands")
      .update(
        input
      )
      .eq(
        "id",
        id
      )
      .select("*")
      .single();


  if (error) {

    console.error(
      "Error updating terminal command:",
      error
    );

    throw new Error(
      error.message
    );

  }


  return data as TerminalCommand;

}


/* =========================================================
   DELETE COMMAND
========================================================= */

export async function deleteTerminalCommand(
  id: string
): Promise<void> {

  const {
    error,
  } =
    await supabase
      .from("terminal_commands")
      .delete()
      .eq(
        "id",
        id
      );


  if (error) {

    console.error(
      "Error deleting terminal command:",
      error
    );

    throw new Error(
      error.message
    );

  }

}