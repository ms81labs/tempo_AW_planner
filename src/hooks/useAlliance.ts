import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  createAlliance,
  getAlliances,
  getAllianceById,
  updateAlliance,
  createBattlegroup,
  getBattlegroupsByAlliance,
  getBattlegroupMembers,
  addMemberToBattlegroup,
  removeMemberFromBattlegroup,
} from "@/services/allianceService";

export function useAlliance(allianceId?: string) {
  const { user, profile } = useAuth();
  const [alliance, setAlliance] = useState<any | null>(null);
  const [battlegroups, setBattlegroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!allianceId && profile?.alliance_id) {
        // If no allianceId is provided but user has an alliance_id in their profile
        fetchAllianceData(profile.alliance_id);
      } else if (allianceId) {
        // If allianceId is explicitly provided
        fetchAllianceData(allianceId);
      } else {
        // No alliance to fetch
        setLoading(false);
      }
    }

    async function fetchAllianceData(id: string) {
      try {
        setLoading(true);
        const allianceData = await getAllianceById(id);
        setAlliance(allianceData);

        const battlegroupsData = await getBattlegroupsByAlliance(id);
        setBattlegroups(battlegroupsData);

        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("An unknown error occurred"),
        );
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [allianceId, profile]);

  const createNewAlliance = async (allianceData: any) => {
    try {
      return await createAlliance(allianceData);
    } catch (err) {
      return {
        error:
          err instanceof Error ? err : new Error("An unknown error occurred"),
      };
    }
  };

  const updateAllianceDetails = async (updates: any) => {
    if (!alliance) return { error: new Error("No alliance selected") };

    try {
      const result = await updateAlliance(alliance.id, updates);
      if (!result.error) {
        setAlliance({ ...alliance, ...updates });
      }
      return result;
    } catch (err) {
      return {
        error:
          err instanceof Error ? err : new Error("An unknown error occurred"),
      };
    }
  };

  const createNewBattlegroup = async (name: string) => {
    if (!alliance) return { error: new Error("No alliance selected") };

    try {
      const result = await createBattlegroup({
        alliance_id: alliance.id,
        name,
      });

      if (!result.error) {
        setBattlegroups([...battlegroups, result.data]);
      }

      return result;
    } catch (err) {
      return {
        error:
          err instanceof Error ? err : new Error("An unknown error occurred"),
      };
    }
  };

  const getBattlegroupMembers = async (battlegroupId: string) => {
    try {
      return await getBattlegroupMembers(battlegroupId);
    } catch (err) {
      return {
        error:
          err instanceof Error ? err : new Error("An unknown error occurred"),
      };
    }
  };

  const addMemberToBattlegroup = async (
    battlegroupId: string,
    userId: string,
  ) => {
    try {
      return await addMemberToBattlegroup({
        battlegroup_id: battlegroupId,
        user_id: userId,
      });
    } catch (err) {
      return {
        error:
          err instanceof Error ? err : new Error("An unknown error occurred"),
      };
    }
  };

  const removeMember = async (battlegroupMemberId: string) => {
    try {
      return await removeMemberFromBattlegroup(battlegroupMemberId);
    } catch (err) {
      return {
        error:
          err instanceof Error ? err : new Error("An unknown error occurred"),
      };
    }
  };

  return {
    alliance,
    battlegroups,
    loading,
    error,
    createNewAlliance,
    updateAllianceDetails,
    createNewBattlegroup,
    getBattlegroupMembers,
    addMemberToBattlegroup: addMemberToBattlegroup,
    removeMemberFromBattlegroup: removeMember,
  };
}

export function useAlliances() {
  const [alliances, setAlliances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await getAlliances();
        setAlliances(data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("An unknown error occurred"),
        );
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { alliances, loading, error };
}
