import { supabase } from "@/lib/supabase";
import { Tables, TablesInsert } from "@/lib/supabase-types";

type Champion = Tables<"champions">;
type UserChampion = Tables<"user_champions">;

export type ChampionWithDetails = Champion & {
  user_champions?: UserChampion[];
};

export async function getAllChampions() {
  const { data, error } = await supabase
    .from("champions")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching champions:", error);
    return [];
  }

  return data as Champion[];
}

export async function getChampionsByClass(championClass: string) {
  const { data, error } = await supabase
    .from("champions")
    .select("*")
    .eq("class", championClass.toLowerCase())
    .order("name");

  if (error) {
    console.error(`Error fetching ${championClass} champions:`, error);
    return [];
  }

  return data as Champion[];
}

export async function getUserChampions(userId: string) {
  const { data, error } = await supabase
    .from("user_champions")
    .select(
      `
      id,
      rarity,
      rank,
      champions:champion_id(id, name, class)
    `,
    )
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching user champions:", error);
    return [];
  }

  return data;
}

export async function addUserChampion(userChampion: {
  user_id: string;
  champion_id: string;
  rarity: string;
  rank: string;
}) {
  const { data, error } = await supabase
    .from("user_champions")
    .insert(userChampion)
    .select();

  if (error) {
    console.error("Error adding user champion:", error);
    return { error };
  }

  return { data: data[0] as UserChampion, error: null };
}

export async function removeUserChampion(userChampionId: string) {
  const { error } = await supabase
    .from("user_champions")
    .delete()
    .eq("id", userChampionId);

  if (error) {
    console.error("Error removing user champion:", error);
    return { error };
  }

  return { error: null };
}

export async function updateUserChampion(
  userChampionId: string,
  updates: Partial<UserChampion>,
) {
  const { data, error } = await supabase
    .from("user_champions")
    .update(updates)
    .eq("id", userChampionId)
    .select();

  if (error) {
    console.error("Error updating user champion:", error);
    return { error };
  }

  return { data: data[0] as UserChampion, error: null };
}
