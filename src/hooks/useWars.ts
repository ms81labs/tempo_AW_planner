import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  createWarSeason,
  getWarSeasons,
  getCurrentWarSeason,
  createWar,
  getWarsByAlliance,
  updateWar,
  createDefenseNode,
  getDefenseNodesByWar,
  updateDefenseNode,
  createAttackAssignment,
  getAttackAssignmentsByWar,
  updateAttackAssignment,
} from "@/services/warService";

export function useWarSeasons() {
  const [seasons, setSeasons] = useState<any[]>([]);
  const [currentSeason, setCurrentSeason] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const seasonsData = await getWarSeasons();
        setSeasons(seasonsData);

        const currentSeasonData = await getCurrentWarSeason();
        setCurrentSeason(currentSeasonData);

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

  const createNewWarSeason = async (warSeasonData: any) => {
    try {
      const result = await createWarSeason(warSeasonData);
      if (!result.error) {
        setSeasons([...seasons, result.data]);
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
    seasons,
    currentSeason,
    loading,
    error,
    createNewWarSeason,
  };
}

export function useWars(allianceId?: string, seasonId?: string) {
  const { profile } = useAuth();
  const [wars, setWars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      try {
        if (!isMounted) return;
        setLoading(true);

        // Use profile.alliance_id if allianceId is not provided
        const effectiveAllianceId = allianceId || profile?.alliance_id;

        if (!effectiveAllianceId) {
          if (isMounted) {
            setWars([]);
            setError(null);
            setLoading(false);
          }
          return;
        }

        const warsData = await getWarsByAlliance(effectiveAllianceId, seasonId);

        // Batch state updates to avoid race conditions
        if (isMounted) {
          // Use functional updates to ensure we're working with the latest state
          setWars(() => warsData);
          setError(null);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          // Use functional updates to ensure we're working with the latest state
          setWars([]);
          setError(
            err instanceof Error ? err : new Error("An unknown error occurred"),
          );
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [allianceId, seasonId, profile]);

  const createNewWar = async (warData: any) => {
    try {
      const result = await createWar(warData);
      if (!result.error) {
        setWars([result.data, ...wars]);
      }
      return result;
    } catch (err) {
      return {
        error:
          err instanceof Error ? err : new Error("An unknown error occurred"),
      };
    }
  };

  const updateWarDetails = async (warId: string, updates: any) => {
    try {
      const result = await updateWar(warId, updates);
      if (!result.error) {
        setWars(
          wars.map((war) => (war.id === warId ? { ...war, ...updates } : war)),
        );
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
    wars,
    loading,
    error,
    createNewWar,
    updateWarDetails,
  };
}

export function useDefenseNodes(warId: string, battlegroupId?: string) {
  const { user } = useAuth();
  const [nodes, setNodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!warId) return;

      try {
        setLoading(true);
        const nodesData = await getDefenseNodesByWar(warId, battlegroupId);
        setNodes(nodesData);
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
  }, [warId, battlegroupId]);

  const createNode = async (nodeData: any) => {
    try {
      const result = await createDefenseNode({
        ...nodeData,
        war_id: warId,
        assigned_by: user?.id,
      });

      if (!result.error) {
        setNodes([...nodes, result.data]);
      }

      return result;
    } catch (err) {
      return {
        error:
          err instanceof Error ? err : new Error("An unknown error occurred"),
      };
    }
  };

  const updateNode = async (nodeId: string, updates: any) => {
    try {
      const result = await updateDefenseNode(nodeId, {
        ...updates,
        assigned_by: user?.id,
      });

      if (!result.error) {
        setNodes(
          nodes.map((node) =>
            node.id === nodeId ? { ...node, ...updates } : node,
          ),
        );
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
    nodes,
    loading,
    error,
    createNode,
    updateNode,
  };
}

export function useAttackAssignments(warId: string, battlegroupId?: string) {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!warId) return;

      try {
        setLoading(true);
        const assignmentsData = await getAttackAssignmentsByWar(
          warId,
          battlegroupId,
        );
        setAssignments(assignmentsData);
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
  }, [warId, battlegroupId]);

  const createAssignment = async (assignmentData: any) => {
    try {
      const result = await createAttackAssignment({
        ...assignmentData,
        war_id: warId,
      });

      if (!result.error) {
        setAssignments([...assignments, result.data]);
      }

      return result;
    } catch (err) {
      return {
        error:
          err instanceof Error ? err : new Error("An unknown error occurred"),
      };
    }
  };

  const updateAssignment = async (assignmentId: string, updates: any) => {
    try {
      const result = await updateAttackAssignment(assignmentId, updates);

      if (!result.error) {
        setAssignments(
          assignments.map((assignment) =>
            assignment.id === assignmentId
              ? { ...assignment, ...updates }
              : assignment,
          ),
        );
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
    assignments,
    loading,
    error,
    createAssignment,
    updateAssignment,
  };
}
