import { supabase } from "./supabaseClient";

export async function uploadFacilityPhoto(
  userId: string,
  file: File,
  folder: "avatar" | "gallery"
): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${userId}/${folder}/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from("facility-photos")
    .upload(path, file, { upsert: true });
  if (error) throw error;

  const { data } = supabase.storage.from("facility-photos").getPublicUrl(path);
  return data.publicUrl;
}
