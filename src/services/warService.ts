import { supabase } from "@/lib/supabase";
import { Tables, TablesInsert } from "@/lib/supabase-types";

type War = Tables<"wars">;
type WarSeason = Tables<"war_seasons">;
type DefenseNode = Tables<"defense_nodes">;
type AttackAssignment = Tables<"attack_assignments">;

export async function createWarSeason(warSeason: TablesInsert<"war_seasons">) {
  const { data, error } = await supabase
    .from("war_seasons")
    .insert(warSeason)
    .select();

  if (error) {
    console.error("Error creating war season:", error);
    return { error };
  }

  return { data: data[0] as WarSeason, error: null };
}

export async function getWarSeasons() {
  const { data, error } = await supabase
    .from("war_seasons")
    .select("*")
    .order("start_date", { ascending: false });

  if (error) {
    console.error("Error fetching war seasons:", error);
    return [];
  }

  return data as WarSeason[];
}

export async function getCurrentWarSeason() {
  const today = new Date().toISOString();
  const { data, error } = await supabase
    .from("war_seasons")
    .select("*")
    .lte("start_date", today)
    .gte("end_date", today)
    .single();

  if (error) {
    console.error("Error fetching current war season:", error);
    return null;
  }

  return data as WarSeason;
}

export async function createWar(war: TablesInsert<"wars">) {
  const { data, error } = await supabase.from("wars").insert(war).select();

  if (error) {
    console.error("Error creating war:", error);
    return { error };
  }

  return { data: data[0] as War, error: null };
}

export async function getWarsByAlliance(allianceId: string, seasonId?: string) {
  let query = supabase
    .from("wars")
    .select("*")
    .eq("alliance_id", allianceId)
    .order("war_date", { ascending: false });

  if (seasonId) {
    query = query.eq("season_id", seasonId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching wars:", error);
    return [];
  }

  return data as War[];
}

export async function updateWar(warId: string, updates: Partial<War>) {
  const { data, error } = await supabase
    .from("wars")
    .update(updates)
    .eq("id", warId)
    .select();

  if (error) {
    console.error("Error updating war:", error);
    return { error };
  }

  return { data: data[0] as War, error: null };
}

export async function createDefenseNode(
  defenseNode: TablesInsert<"defense_nodes">,
) {
  const { data, error } = await supabase
    .from("defense_nodes")
    .insert(defenseNode)
    .select();

  if (error) {
    console.error("Error creating defense node:", error);
    return { error };
  }

  return { data: data[0] as DefenseNode, error: null };
}

export async function getDefenseNodesByWar(
  warId: string,
  battlegroupId?: string,
) {
  let query = supabase
    .from("defense_nodes")
    .select(
      `
      *,
      assigned_champion:assigned_champion_id(id, user_id, rarity, rank, champion:champion_id(id, name, class)),
      assigned_by_user:assigned_by(id, username)
    `,
    )
    .eq("war_id", warId);

  if (battlegroupId) {
    query = query.eq("battlegroup_id", battlegroupId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching defense nodes:", error);
    return [];
  }

  return data;
}

export async function updateDefenseNode(
  nodeId: string,
  updates: Partial<DefenseNode>,
) {
  const { data, error } = await supabase
    .from("defense_nodes")
    .update(updates)
    .eq("id", nodeId)
    .select();

  if (error) {
    console.error("Error updating defense node:", error);
    return { error };
  }

  return { data: data[0] as DefenseNode, error: null };
}

export async function createAttackAssignment(
  attackAssignment: TablesInsert<"attack_assignments">,
) {
  const { data, error } = await supabase
    .from("attack_assignments")
    .insert(attackAssignment)
    .select();

  if (error) {
    console.error("Error creating attack assignment:", error);
    return { error };
  }

  return { data: data[0] as AttackAssignment, error: null };
}

export async function getAttackAssignmentsByWar(
  warId: string,
  battlegroupId?: string,
) {
  let query = supabase
    .from("attack_assignments")
    .select(
      `
      *,
      user:user_id(id, username, avatar_url),
      champion:champion_id(id, user_id, rarity, rank, champion:champion_id(id, name, class))
    `,
    )
    .eq("war_id", warId);

  if (battlegroupId) {
    query = query.eq("battlegroup_id", battlegroupId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching attack assignments:", error);
    return [];
  }

  return data;
}

export async function updateAttackAssignment(
  assignmentId: string,
  updates: Partial<AttackAssignment>,
) {
  const { data, error } = await supabase
    .from("attack_assignments")
    .update(updates)
    .eq("id", assignmentId)
    .select();

  if (error) {
    console.error("Error updating attack assignment:", error);
    return { error };
  }

  return { data: data[0] as AttackAssignment, error: null };
}
