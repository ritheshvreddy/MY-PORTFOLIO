import { supabase } from "../lib/supabase";

import type {
  AboutProfile,
  Hobby,
} from "../types/about";


/* =========================================================
   STORAGE
========================================================= */

const STORAGE_BUCKET = "portfolio";


/* =========================================================
   GET ABOUT PROFILE
========================================================= */

export async function getAboutProfile():
  Promise<AboutProfile | null> {

  const {
    data,
    error,
  } = await supabase
    .from("about_profile")
    .select("*")
    .maybeSingle();


  if (error) {

    console.error(
      "Error fetching about profile:",
      error
    );

    throw error;
  }


  return data as AboutProfile | null;
}


/* =========================================================
   SAVE ABOUT PROFILE
========================================================= */

export interface AboutProfileInput {
  title: string;

  subtitle: string | null;

  /*
    These are existing database columns,
    but they contain the two About paragraphs.
  */
  background_1: string;

  background_2: string | null;

  resume_url: string | null;
}


export async function saveAboutProfile(
  input: AboutProfileInput
): Promise<AboutProfile> {

  const existing =
    await getAboutProfile();


  /* =======================================================
     UPDATE EXISTING PROFILE
  ======================================================= */

  if (existing) {

    const {
      data,
      error,
    } = await supabase
      .from("about_profile")
      .update({

        title:
          input.title,

        subtitle:
          input.subtitle,

        background_1:
          input.background_1,

        background_2:
          input.background_2,

        resume_url:
          input.resume_url,

      })
      .eq(
        "id",
        existing.id
      )
      .select("*")
      .single();


    if (error) {

      console.error(
        "Error updating about profile:",
        error
      );

      throw error;
    }


    return data as AboutProfile;
  }


  /* =======================================================
     CREATE PROFILE
  ======================================================= */

  const {
    data,
    error,
  } = await supabase
    .from("about_profile")
    .insert({

      title:
        input.title,

      subtitle:
        input.subtitle,

      background_1:
        input.background_1,

      background_2:
        input.background_2,

      resume_url:
        input.resume_url,

    })
    .select("*")
    .single();


  if (error) {

    console.error(
      "Error creating about profile:",
      error
    );

    throw error;
  }


  return data as AboutProfile;
}


/* =========================================================
   GET PUBLISHED HOBBIES
========================================================= */

export async function getHobbies():
  Promise<Hobby[]> {

  const {
    data,
    error,
  } = await supabase
    .from("about_hobbies")
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
      "Error fetching hobbies:",
      error
    );

    return [];
  }


  return (data ?? []) as Hobby[];
}


/* =========================================================
   GET ALL HOBBIES - ADMIN
========================================================= */

export async function getAdminHobbies():
  Promise<Hobby[]> {

  const {
    data,
    error,
  } = await supabase
    .from("about_hobbies")
    .select("*")
    .order(
      "display_order",
      {
        ascending: true,
      }
    );


  if (error) {

    console.error(
      "Error fetching admin hobbies:",
      error
    );

    throw error;
  }


  return (data ?? []) as Hobby[];
}


/* =========================================================
   CREATE HOBBY
========================================================= */

export interface HobbyInput {
  name: string;

  icon_url: string;

  display_order: number;

  published: boolean;
}


export async function createHobby(
  input: HobbyInput
): Promise<Hobby> {

  const {
    data,
    error,
  } = await supabase
    .from("about_hobbies")
    .insert({

      name:
        input.name,

      icon_url:
        input.icon_url,

      display_order:
        input.display_order,

      published:
        input.published,

    })
    .select("*")
    .single();


  if (error) {

    console.error(
      "Error creating hobby:",
      error
    );

    throw error;
  }


  return data as Hobby;
}


/* =========================================================
   UPDATE HOBBY
========================================================= */

export async function updateHobby(
  id: string,
  input: Partial<HobbyInput>
): Promise<Hobby> {

  const {
    data,
    error,
  } = await supabase
    .from("about_hobbies")
    .update(input)
    .eq(
      "id",
      id
    )
    .select("*")
    .single();


  if (error) {

    console.error(
      "Error updating hobby:",
      error
    );

    throw error;
  }


  return data as Hobby;
}


/* =========================================================
   DELETE HOBBY
========================================================= */

export async function deleteHobby(
  id: string
): Promise<void> {

  const {
    error,
  } = await supabase
    .from("about_hobbies")
    .delete()
    .eq(
      "id",
      id
    );


  if (error) {

    console.error(
      "Error deleting hobby:",
      error
    );

    throw error;
  }
}


/* =========================================================
   UPLOAD RESUME
========================================================= */

export async function uploadResume(
  file: File
): Promise<string> {

  const allowedTypes = [
    "application/pdf",

    "application/msword",

    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];


  if (
    !allowedTypes.includes(
      file.type
    )
  ) {

    throw new Error(
      "Please select a PDF, DOC or DOCX file."
    );
  }


  const extension =
    file.name
      .split(".")
      .pop()
      ?.toLowerCase() ||
    "pdf";


  const fileName =
    `resume/${crypto.randomUUID()}.${extension}`;


  const {
    error,
  } =
    await supabase
      .storage
      .from(
        STORAGE_BUCKET
      )
      .upload(
        fileName,
        file,
        {
          cacheControl:
            "3600",

          upsert:
            false,
        }
      );


  if (error) {

    console.error(
      "Error uploading resume:",
      error
    );

    throw new Error(
      `Resume upload failed: ${error.message}`
    );
  }


  const {
    data,
  } =
    supabase
      .storage
      .from(
        STORAGE_BUCKET
      )
      .getPublicUrl(
        fileName
      );


  if (
    !data.publicUrl
  ) {

    throw new Error(
      "Unable to create resume URL."
    );
  }


  return data.publicUrl;
}


/* =========================================================
   UPLOAD HOBBY ICON
========================================================= */

export async function uploadHobbyIcon(
  file: File
): Promise<string> {

  if (
    !file.type.startsWith(
      "image/"
    )
  ) {

    throw new Error(
      "Please select an image file."
    );
  }


  const extension =
    file.name
      .split(".")
      .pop()
      ?.toLowerCase() ||
    "png";


  const fileName =
    `hobbies/${crypto.randomUUID()}.${extension}`;


  const {
    error,
  } =
    await supabase
      .storage
      .from(
        STORAGE_BUCKET
      )
      .upload(
        fileName,
        file,
        {
          cacheControl:
            "3600",

          upsert:
            false,
        }
      );


  if (error) {

    console.error(
      "Error uploading hobby icon:",
      error
    );

    throw new Error(
      `Hobby icon upload failed: ${error.message}`
    );
  }


  const {
    data,
  } =
    supabase
      .storage
      .from(
        STORAGE_BUCKET
      )
      .getPublicUrl(
        fileName
      );


  return data.publicUrl;
}


/* =========================================================
   DELETE STORAGE ASSET
========================================================= */

export async function deleteAboutAsset(
  fileUrl: string
): Promise<void> {

  if (!fileUrl) {
    return;
  }


  const marker =
    `/storage/v1/object/public/${STORAGE_BUCKET}/`;


  const index =
    fileUrl.indexOf(
      marker
    );


  if (
    index === -1
  ) {

    console.warn(
      "Could not determine storage path:",
      fileUrl
    );

    return;
  }


  const filePath =
    fileUrl.substring(
      index +
      marker.length
    );


  if (!filePath) {
    return;
  }


  const {
    error,
  } =
    await supabase
      .storage
      .from(
        STORAGE_BUCKET
      )
      .remove([
        filePath,
      ]);


  if (error) {

    console.error(
      "Error deleting storage asset:",
      error
    );

    throw error;
  }
}