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

    try {
      const result = await addUserChampion({
        user_id: user.id,
        champion_id: championId,
        rarity,
        rank,
      });

      if (!result.error) {
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
