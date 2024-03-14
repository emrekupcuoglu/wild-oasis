import { ICabin, ICabinSupabaseUploadData } from "../types";
import supabase, { supabaseUrl } from "./supabase";

export async function getCabins(): Promise<ICabin[]> {
  const { data, error } = await supabase.from("cabins").select("*");
  if (error) {
    console.error(error);
    throw new Error("Cabins could not be loaded");
  }

  return data;
}

export async function deleteCabin(id: number, imageName?: string) {
  const { data, error } = await supabase.from("cabins").delete().eq("id", id);
  if (error) {
    console.error(error);
    throw new Error("Cabins could not be deleted");
  }

  if (imageName)
    await supabase.storage.from("cabin-images").remove([imageName]);

  return data;
}

export async function createEditCabin(
  newCabin: ICabinSupabaseUploadData,
  id?: number,
  curImg?: string
) {
  // https://ghatmracppzfxazityie.supabase.co/storage/v1/object/public/cabin-images/cabin-001.jpg

  // We need to replace all slashes ("/") with and empty string ("") because if there is any "/" then supabase will create folders based on that.

  let imageName: string;
  let imagePath: string;

  if (typeof newCabin.image === "object") {
    imageName = `${Math.random()}-${newCabin?.image?.name}`.replaceAll("/", "");
    imagePath = `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;
  } else if (newCabin.image) {
    imageName = `${Math.random()}-${newCabin.image}`.replaceAll("/", "");

    imagePath = newCabin.image;
  } else {
    return;
  }
  // 1. Create/Edit cabin

  let query;

  // A) CREATE
  if (!id)
    query = supabase
      .from("cabins")
      .insert([
        { ...newCabin, image: imagePath, discount: newCabin.discount || 0 },
      ]);

  // B) EDIT
  if (id) {
    console.log("edit", newCabin);
    query = supabase
      .from("cabins")
      .update({ ...newCabin, image: imagePath })
      .eq("id", id);
  }

  if (!query) throw new Error("Query error");
  const { data, error } = await query // We chain .select() because insert doesn't return that row, we need to chain select to get the row
    .select()
    // returns data as a single object instead of a array of objects
    .single();

  if (error) {
    console.error(error);
    throw new Error("Cabins could not be created");
  }

  // 2. Upload Image

  if (typeof newCabin.image === "string" || !newCabin.image) return;
  const { error: storageError } = await supabase.storage
    .from("cabin-images")
    .upload(imageName, newCabin.image);
  if (storageError) {
    deleteCabin(data.id);
    console.log(storageError);
    throw new Error(
      "Cabin image could not be uploaded, and cabin was not created"
    );
    // Handle error
  } else {
    // Handle success
  }

  // 3. Remove old images

  if (!curImg) return;

  console.log("curImg", curImg);

  await supabase.storage.from("cabin-images").remove([curImg]);

  return data;
}
