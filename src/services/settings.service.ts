import { supabase } from "../lib/supabase";

import type {
  SiteSettings,
} from "../types/settings";


/* =========================================================
   CONSTANTS
========================================================= */

const STORAGE_BUCKET = "portfolio";


/* =========================================================
   GET SITE SETTINGS
========================================================= */

export async function getSiteSettings():
  Promise<SiteSettings | null> {

  const {
    data,
    error,
  } =
    await supabase
      .from("site_settings")
      .select("*")
      .limit(1)
      .maybeSingle();


  if (error) {

    console.error(
      "Error fetching site settings:",
      error
    );

    throw error;
  }


  return data as SiteSettings | null;
}


/* =========================================================
   UPDATE SITE SETTINGS
========================================================= */

export interface SiteSettingsInput {
  portfolio_name: string;

  tagline: string | null;

  email: string | null;

  github_url: string | null;

  linkedin_url: string | null;

  resume_url: string | null;

  logo_url: string | null;

  favicon_url: string | null;

  phone: string | null;

  location: string | null;

  seo_title: string | null;

  seo_description: string | null;

  copyright: string | null;

  day_background_url: string | null;

  night_background_url: string | null;
}


export async function updateSiteSettings(
  id: string,
  input: Partial<SiteSettingsInput>
): Promise<SiteSettings> {

  const {
    data,
    error,
  } =
    await supabase
      .from("site_settings")
      .update(input)
      .eq(
        "id",
        id
      )
      .select("*")
      .single();


  if (error) {

    console.error(
      "Error updating site settings:",
      error
    );

    throw new Error(
      error.message
    );
  }


  return data as SiteSettings;
}


/* =========================================================
   UPLOAD SETTINGS ASSET
========================================================= */

export async function uploadSettingsAsset(
  file: File,
  folder: string
): Promise<string> {

  const isImage =
    file.type.startsWith(
      "image/"
    );


  const isResume =
    folder === "resume";


  if (
    !isImage &&
    !isResume
  ) {

    throw new Error(
      "Please select an image file."
    );
  }


  if (
    isResume
  ) {

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

  }


  const extension =
    file.name
      .split(".")
      .pop()
      ?.toLowerCase() ||
    "bin";


  const filePath =
    `settings/${folder}/${crypto.randomUUID()}.${extension}`;


  const {
    error,
  } =
    await supabase
      .storage
      .from(
        STORAGE_BUCKET
      )
      .upload(
        filePath,
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
      "Error uploading settings asset:",
      error
    );

    throw new Error(
      `Upload failed: ${error.message}`
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
        filePath
      );


  if (
    !data.publicUrl
  ) {

    throw new Error(
      "Unable to create public URL."
    );
  }


  return data.publicUrl;
}


/* =========================================================
   DELETE SETTINGS ASSET
========================================================= */

export async function deleteSettingsAsset(
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
      "Error deleting settings asset:",
      error
    );

    throw error;
  }
}