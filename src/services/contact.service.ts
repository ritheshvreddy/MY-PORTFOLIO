import { supabase } from "../lib/supabase";

import type {
  ContactInput,
  ContactMessage,
} from "../types/contact";


/* ==========================================
   CREATE MESSAGE
========================================== */

export async function createContactMessage(
  input: ContactInput
): Promise<ContactMessage> {

  const { data, error } =
    await supabase
      .from("contact_messages")
      .insert(input)
      .select("*")
      .single();

  if (error) {

    throw new Error(
      error.message
    );

  }

  return data as ContactMessage;

}


/* ==========================================
   GET ALL MESSAGES
========================================== */

export async function getContactMessages():
  Promise<ContactMessage[]> {

  const { data, error } =
    await supabase
      .from("contact_messages")
      .select("*")
      .order(
        "created_at",
        {
          ascending: false,
        }
      );

  if (error) {

    throw new Error(
      error.message
    );

  }

  return (
    data ?? []
  ) as ContactMessage[];

}


/* ==========================================
   GET RECENT MESSAGES
========================================== */

export async function getRecentMessages():
  Promise<ContactMessage[]> {

  const { data, error } =
    await supabase
      .from("contact_messages")
      .select("*")
      .order(
        "created_at",
        {
          ascending: false,
        }
      )
      .limit(5);

  if (error) {

    throw new Error(
      error.message
    );

  }

  return (
    data ?? []
  ) as ContactMessage[];

}


/* ==========================================
   MARK AS READ
========================================== */

export async function markMessageAsRead(
  id: string
): Promise<void> {

  const { error } =
    await supabase
      .from("contact_messages")
      .update({
        is_read: true,
      })
      .eq(
        "id",
        id
      );

  if (error) {

    throw new Error(
      error.message
    );

  }

}


/* ==========================================
   MARK AS REPLIED
========================================== */

export async function markMessageAsReplied(
  id: string
): Promise<void> {

  const { error } =
    await supabase
      .from("contact_messages")
      .update({
        replied: true,
      })
      .eq(
        "id",
        id
      );

  if (error) {

    throw new Error(
      error.message
    );

  }

}


/* ==========================================
   DELETE MESSAGE
========================================== */

export async function deleteContactMessage(
  id: string
): Promise<void> {

  const { error } =
    await supabase
      .from("contact_messages")
      .delete()
      .eq(
        "id",
        id
      );

  if (error) {

    throw new Error(
      error.message
    );

  }

}


/* ==========================================
   GET UNREAD MESSAGE COUNT
========================================== */

export async function getUnreadMessageCount():
  Promise<number> {

  const { count, error } =
    await supabase
      .from("contact_messages")
      .select(
        "*",
        {
          count: "exact",
          head: true,
        }
      )
      .eq(
        "is_read",
        false
      );

  if (error) {

    throw new Error(
      error.message
    );

  }

  return count ?? 0;

}