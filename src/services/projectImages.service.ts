import { supabase } from "../lib/supabase";

export type ProjectImageType = "cover" | "gallery";

export interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  alt_text: string | null;
  caption: string | null;
  display_order: number;
  created_at: string;
  image_type: ProjectImageType;
}

interface UploadProjectImageOptions {
  projectId: string;
  file: File;
  imageType: ProjectImageType;
  altText?: string;
  caption?: string;
  displayOrder?: number;
}

const BUCKET_NAME = "portfolio-media";

/**
 * Get all images belonging to a project.
 */
export async function getProjectImages(
  projectId: string,
): Promise<ProjectImage[]> {
  const { data, error } = await supabase
    .from("project_images")
    .select("*")
    .eq("project_id", projectId)
    .order("display_order", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as ProjectImage[];
}

/**
 * Upload an image to Supabase Storage and create
 * the corresponding project_images database record.
 */
export async function uploadProjectImage({
  projectId,
  file,
  imageType,
  altText = "",
  caption = "",
  displayOrder = 0,
}: UploadProjectImageOptions): Promise<ProjectImage> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files can be uploaded.");
  }

  // 10 MB limit
  const maxFileSize = 10 * 1024 * 1024;

  if (file.size > maxFileSize) {
    throw new Error("Image must be smaller than 10 MB.");
  }

  const extension =
    file.name.split(".").pop()?.toLowerCase() || "jpg";

  const uniqueName = `${crypto.randomUUID()}.${extension}`;

  const folder =
    imageType === "cover" ? "cover" : "gallery";

  const storagePath =
    `projects/${projectId}/${folder}/${uniqueName}`;

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(storagePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(storagePath);

  const imageUrl = publicUrlData.publicUrl;

  // Save image metadata
  const { data, error: insertError } = await supabase
    .from("project_images")
    .insert({
      project_id: projectId,
      image_url: imageUrl,
      alt_text: altText || null,
      caption: caption || null,
      display_order: displayOrder,
      image_type: imageType,
    })
    .select()
    .single();

  if (insertError) {
    // Clean up uploaded file if DB insert fails
    await supabase.storage
      .from(BUCKET_NAME)
      .remove([storagePath]);

    throw new Error(insertError.message);
  }

  return data as ProjectImage;
}

/**
 * Update image metadata.
 */
export async function updateProjectImage(
  imageId: string,
  updates: Partial<
    Pick<
      ProjectImage,
      "alt_text" | "caption" | "display_order" | "image_type"
    >
  >,
): Promise<ProjectImage> {
  const { data, error } = await supabase
    .from("project_images")
    .update(updates)
    .eq("id", imageId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as ProjectImage;
}

/**
 * Delete an image from both Storage and the database.
 */
export async function deleteProjectImage(
  image: ProjectImage,
): Promise<void> {
  const marker = `/storage/v1/object/public/${BUCKET_NAME}/`;

  const markerIndex = image.image_url.indexOf(marker);

  if (markerIndex !== -1) {
    const encodedPath = image.image_url.substring(
      markerIndex + marker.length,
    );

    const storagePath = decodeURIComponent(encodedPath);

    const { error: storageError } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([storagePath]);

    if (storageError) {
      throw new Error(storageError.message);
    }
  }

  const { error } = await supabase
    .from("project_images")
    .delete()
    .eq("id", image.id);

  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Make one existing image the cover image.
 */
export async function setProjectCover(
  projectId: string,
  imageId: string,
): Promise<void> {
  // Existing cover becomes gallery image
  const { error: resetError } = await supabase
    .from("project_images")
    .update({ image_type: "gallery" })
    .eq("project_id", projectId)
    .eq("image_type", "cover");

  if (resetError) {
    throw new Error(resetError.message);
  }

  const { error } = await supabase
    .from("project_images")
    .update({ image_type: "cover" })
    .eq("id", imageId)
    .eq("project_id", projectId);

  if (error) {
    throw new Error(error.message);
  }
}