export async function uploadImage(file: File): Promise<string> {
  // Here you would typically:
  // 1. Upload the file to a cloud storage service (e.g., AWS S3, Cloudinary)
  // 2. Return the URL of the uploaded image
  
  // For demo purposes, we'll create a data URL
  const buffer = await file.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');
  const mimeType = file.type;
  return `data:${mimeType};base64,${base64}`;
}