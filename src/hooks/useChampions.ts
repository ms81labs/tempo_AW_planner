import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  getAllChampions,
  getChampionsByClass,
  getUserChampions,
  addUserChampion,
  removeUserChampion,
  updateUserChampion,
  ChampionWithDetails,
} from "@/services/championService";

export function useChampions(championClass?: string) {
  const { user } = useAuth();
  const [champions, setChampions] = useState<ChampionWithDetails[]>([]);
  const [userChampions, setUserChampions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        let championsData;

        if (championClass) {
          championsData = await getChampionsByClass(championClass);
        } else {
          championsData = await getAllChampions();
        }

        setChampions(championsData);

        if (user) {
          const userChampionsData = await getUserChampions(user.id);
          setUserChampions(userChampionsData);
        }

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
  }, [championClass, user]);

  const addChampion = async (
    championId: string,
    rarity: string,
    rank: string,
  ) => {
    if (!user) return { error: new Error("User not authenticated") };

    // Find the champion details from the champions list
    const championDetails = champions.find((champ) => champ.id === championId);
    if (!championDetails) {
      return { error: new Error("Champion not found") };
    }

    // Create an optimistic user champion object
    const optimisticChampion = {
      id: `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      user_id: user.id,
      champion_id: championId,
      rarity,
      rank,
      // Include champion details for UI rendering
      champions: championDetails,
    };

    // Optimistically update the UI
    setUserChampions((prev) => [...prev, optimisticChampion]);

    try {
      const result = await addUserChampion({
        user_id: user.id,
        champion_id: championId,
        rarity,
        rank,
      });

      if (result.error) {
        // Revert optimistic update on error
        setUserChampions((prev) =>
          prev.filter((champ) => champ.id !== optimisticChampion.id),
        );
        throw result.error;
      }

      // Replace the optimistic champion with the real one
      setUserChampions((prev) =>
        prev.map((champ) =>
          champ.id === optimisticChampion.id
            ? {
                ...result.data,
                champions: championDetails,
              }
            : champ,
        ),
      );

      return result;
    } catch (err) {
      // Ensure optimistic update is reverted on any error
      setUserChampions((prev) =>
        prev.filter((champ) => champ.id !== optimisticChampion.id),
      );

      return {
        error:
          err instanceof Error ? err : new Error("An unknown error occurred"),
      };
    }
  };

  const removeChampion = async (userChampionId: string) => {
    try {
      const result = await removeUserChampion(userChampionId);

      if (!result.error && user) {
        // Refresh user champions
        const updatedUserChampions = await getUserChampions(user.id);
        setUserChampions(updatedUserChampions);
      }

      return result;
    } catch (err) {
      return {
        error:
          err instanceof Error ? err : new Error("An unknown error occurred"),
      };
    }
  };

  const updateChampion = async (userChampionId: string, updates: any) => {
    try {
      const result = await updateUserChampion(userChampionId, updates);

      if (!result.error && user) {
        // Refresh user champions
        const updatedUserChampions = await getUserChampions(user.id);
        setUserChampions(updatedUserChampions);
      }

      return result;
    } catch (err) {
      return {
        error:
          err instanceof Error ? err : new Error("An unknown error occurred"),
      };
    }
  };

  return {
    champions,
    userChampions,
    loading,
    error,
    addChampion,
    removeChampion,
    updateChampion,
  };
}
