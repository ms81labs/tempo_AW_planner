import { supabase } from "@/lib/supabase";
import { Tables, TablesInsert } from "@/lib/supabase-types";

type Alliance = Tables<"alliances">;
type Battlegroup = Tables<"battlegroups">;
type BattlegroupMember = Tables<"battlegroup_members">;

export async function createAlliance(alliance: TablesInsert<"alliances">) {
  const { data, error } = await supabase
    .from("alliances")
    .insert(alliance)
    .select();

  if (error) {
    console.error("Error creating alliance:", error);
    return { error };
  }

  return { data: data[0] as Alliance, error: null };
}

export async function getAlliances() {
  const { data, error } = await supabase
    .from("alliances")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching alliances:", error);
    return [];
  }

  return data as Alliance[];
}

export async function getAllianceById(allianceId: string) {
  const { data, error } = await supabase
    .from("alliances")
    .select("*")
    .eq("id", allianceId)
    .single();

  if (error) {
    console.error("Error fetching alliance:", error);
    return null;
  }

  return data as Alliance;
}

export async function updateAlliance(
  allianceId: string,
  updates: Partial<Alliance>,
) {
  const { data, error } = await supabase
    .from("alliances")
    .update(updates)
    .eq("id", allianceId)
    .select();

  if (error) {
    console.error("Error updating alliance:", error);
    return { error };
  }

  return { data: data[0] as Alliance, error: null };
}

export async function createBattlegroup(
  battlegroup: TablesInsert<"battlegroups">,
) {
  const { data, error } = await supabase
    .from("battlegroups")
    .insert(battlegroup)
    .select();

  if (error) {
    console.error("Error creating battlegroup:", error);
    return { error };
  }

  return { data: data[0] as Battlegroup, error: null };
}

export async function getBattlegroupsByAlliance(allianceId: string) {
  const { data, error } = await supabase
    .from("battlegroups")
    .select("*")
    .eq("alliance_id", allianceId)
    .order("name");

  if (error) {
    console.error("Error fetching battlegroups:", error);
    return [];
  }

  return data as Battlegroup[];
}

export async function getBattlegroupMembers(battlegroupId: string) {
  const { data, error } = await supabase
    .from("battlegroup_members")
    .select(
      `
      id,
      users:user_id(id, username, avatar_url, role)
    `,
    )
    .eq("battlegroup_id", battlegroupId);

  if (error) {
    console.error("Error fetching battlegroup members:", error);
    return [];
  }

  return data;
}

export async function addMemberToBattlegroup(
  battlegroupMember: TablesInsert<"battlegroup_members">,
) {
  const { data, error } = await supabase
    .from("battlegroup_members")
    .insert(battlegroupMember)
    .select();

  if (error) {
    console.error("Error adding member to battlegroup:", error);
    return { error };
  }

  return { data: data[0] as BattlegroupMember, error: null };
}

export async function removeMemberFromBattlegroup(battlegroupMemberId: string) {
  const { error } = await supabase
    .from("battlegroup_members")
    .delete()
    .eq("id", battlegroupMemberId);

  if (error) {
    console.error("Error removing member from battlegroup:", error);
    return { error };
  }

  return { error: null };
}
