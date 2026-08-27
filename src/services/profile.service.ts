import { supabase } from "../lib/supabase";

/* ================= TYPES ================= */

export interface Profile {
  id: string;

  greeting: string;

  full_name: string;

  description: string;

  profile_image: string;

  resume_file: string;

  contact_button_text: string;
}

const BUCKET = "portfolio";

/* ================= HELPERS ================= */

/*
  Converts a public Supabase storage URL back
  into the actual storage path.

  Example:

  https://xyz.supabase.co/storage/v1/object/public/portfolio/profile/image.jpg

  becomes:

  profile/image.jpg
*/

function getStoragePath(value: string): string {
  if (!value) return "";

  // If it is already a storage path
  if (!value.startsWith("http")) {
    return value;
  }

  const marker = `/storage/v1/object/public/${BUCKET}/`;

  const index = value.indexOf(marker);

  if (index === -1) {
    return value;
  }

  return value.substring(
    index + marker.length
  );
}

/* ================= GET PROFILE ================= */

export async function getProfile(): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profile")
    .select("*")
    .single();

  if (error) {
    console.error(
      "Failed to get profile:",
      error
    );

    return null;
  }

  if (!data) {
    return null;
  }

  let imageUrl = "";
  let resumeUrl = "";

  if (data.profile_image) {
    const imagePath = getStoragePath(
      data.profile_image
    );

    const {
      data: imageData,
    } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(imagePath);

    imageUrl =
      imageData.publicUrl;
  }

  if (data.resume_file) {
    const resumePath = getStoragePath(
      data.resume_file
    );

    const {
      data: resumeData,
    } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(resumePath);

    resumeUrl =
      resumeData.publicUrl;
  }

  return {
    ...data,
    profile_image: imageUrl,
    resume_file: resumeUrl,
  };
}

/* ================= UPDATE PROFILE ================= */

export async function updateProfile(
  profile: Partial<Profile>
) {
  if (!profile.id) {
    throw new Error(
      "Profile ID is required"
    );
  }

  const { id, ...updates } =
    profile;

  /*
    IMPORTANT:

    Do not accidentally save public URLs
    into the database.

    We only update normal profile fields here.
  */

  const cleanUpdates = {
    ...updates,
  };

  delete cleanUpdates.profile_image;
  delete cleanUpdates.resume_file;

  const {
    data,
    error,
  } = await supabase
    .from("profile")
    .update(cleanUpdates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(
      "Profile update error:",
      error
    );

    throw error;
  }

  return data;
}

/* ================= UPLOAD PROFILE IMAGE ================= */

export async function uploadProfileImage(
  file: File,
  profileId: string
): Promise<string> {

  if (!file) {
    throw new Error(
      "No file selected"
    );
  }

  if (!file.type.startsWith("image/")) {
    throw new Error(
      "Only image files are allowed"
    );
  }

  const fileExtension =
    file.name
      .split(".")
      .pop()
      ?.toLowerCase() || "jpg";

  const fileName =
    `profile-${profileId}-${Date.now()}.${fileExtension}`;

  const filePath =
    `profile/${fileName}`;

  console.log(
    "Uploading profile image:",
    {
      bucket: BUCKET,
      filePath,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    }
  );

  /* ---------- UPLOAD ---------- */

  const {
    data: uploadData,
    error: uploadError,
  } = await supabase.storage
    .from(BUCKET)
    .upload(
      filePath,
      file,
      {
        cacheControl: "3600",
        upsert: true,
        contentType: file.type,
      }
    );

  if (uploadError) {

    console.error(
      "Storage upload error:",
      uploadError
    );

    throw new Error(
      `Image upload failed: ${uploadError.message}`
    );
  }

  console.log(
    "Upload successful:",
    uploadData
  );

  /* ---------- SAVE PATH IN DATABASE ---------- */

  const {
    error: updateError,
  } = await supabase
    .from("profile")
    .update({
      profile_image: filePath,
    })
    .eq(
      "id",
      profileId
    );

  if (updateError) {

    console.error(
      "Database update error:",
      updateError
    );

    /*
      Remove uploaded file if DB update fails
    */

    await supabase.storage
      .from(BUCKET)
      .remove([
        filePath,
      ]);

    throw new Error(
      `Profile database update failed: ${updateError.message}`
    );
  }

  /* ---------- GET PUBLIC URL ---------- */

  const {
    data: publicUrlData,
  } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(
      filePath
    );

  console.log(
    "Profile image uploaded successfully:",
    publicUrlData.publicUrl
  );

  return publicUrlData.publicUrl;
}

/* ================= DELETE PROFILE IMAGE ================= */

export async function deleteProfileImage(
  fileValue: string,
  profileId: string
) {

  const filePath =
    getStoragePath(
      fileValue
    );

  console.log(
    "Deleting profile image:",
    filePath
  );

  if (filePath) {

    const {
      error: deleteError,
    } = await supabase.storage
      .from(BUCKET)
      .remove([
        filePath,
      ]);

    if (deleteError) {

      console.error(
        "Profile image delete error:",
        deleteError
      );

      throw deleteError;
    }
  }

  const {
    error: updateError,
  } = await supabase
    .from("profile")
    .update({
      profile_image: "",
    })
    .eq(
      "id",
      profileId
    );

  if (updateError) {

    console.error(
      "Profile database delete update error:",
      updateError
    );

    throw updateError;
  }
}

/* ================= UPLOAD RESUME ================= */

export async function uploadResume(
  file: File,
  profileId: string
): Promise<string> {

  if (!file) {
    throw new Error(
      "No file selected"
    );
  }

  const isPdf =
    file.type ===
      "application/pdf" ||
    file.name
      .toLowerCase()
      .endsWith(".pdf");

  if (!isPdf) {
    throw new Error(
      "Only PDF files are allowed"
    );
  }

  const filePath =
    `resume/resume-${profileId}-${Date.now()}.pdf`;

  console.log(
    "Uploading resume:",
    {
      bucket: BUCKET,
      filePath,
      fileName: file.name,
    }
  );

  /* ---------- UPLOAD ---------- */

  const {
    data: uploadData,
    error: uploadError,
  } = await supabase.storage
    .from(BUCKET)
    .upload(
      filePath,
      file,
      {
        cacheControl: "3600",
        upsert: true,
        contentType:
          "application/pdf",
      }
    );

  if (uploadError) {

    console.error(
      "Resume upload error:",
      uploadError
    );

    throw new Error(
      `Resume upload failed: ${uploadError.message}`
    );
  }

  console.log(
    "Resume upload successful:",
    uploadData
  );

  /* ---------- SAVE PATH ---------- */

  const {
    error: updateError,
  } = await supabase
    .from("profile")
    .update({
      resume_file:
        filePath,
    })
    .eq(
      "id",
      profileId
    );

  if (updateError) {

    console.error(
      "Resume database update error:",
      updateError
    );

    await supabase.storage
      .from(BUCKET)
      .remove([
        filePath,
      ]);

    throw new Error(
      `Resume database update failed: ${updateError.message}`
    );
  }

  /* ---------- PUBLIC URL ---------- */

  const {
    data: publicUrlData,
  } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(
      filePath
    );

  return publicUrlData.publicUrl;
}

/* ================= DELETE RESUME ================= */

export async function deleteResume(
  fileValue: string,
  profileId: string
) {

  const filePath =
    getStoragePath(
      fileValue
    );

  console.log(
    "Deleting resume:",
    filePath
  );

  if (filePath) {

    const {
      error: deleteError,
    } = await supabase.storage
      .from(BUCKET)
      .remove([
        filePath,
      ]);

    if (deleteError) {

      console.error(
        "Resume delete error:",
        deleteError
      );

      throw deleteError;
    }
  }

  const {
    error: updateError,
  } = await supabase
    .from("profile")
    .update({
      resume_file: "",
    })
    .eq(
      "id",
      profileId
    );

  if (updateError) {

    console.error(
      "Resume database update error:",
      updateError
    );

    throw updateError;
  }
}