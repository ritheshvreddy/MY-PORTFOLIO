export async function downloadFile(
  url: string,
  filename: string
) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to download file.");
    }

    const blob = await response.blob();

    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = blobUrl;
    link.download = filename;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error(error);

    window.open(url, "_blank");
  }
}