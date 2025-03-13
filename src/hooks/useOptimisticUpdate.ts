import { useState } from "react";

type OptimisticUpdateOptions<T> = {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  rollbackOnError?: boolean;
};

export function useOptimisticUpdate<T>(
  initialData: T[],
  options: OptimisticUpdateOptions<T> = {},
) {
  const [data, setData] = useState<T[]>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { onSuccess, onError, rollbackOnError = true } = options;

  // Add item optimistically
  const addItem = async (
    newItem: T,
    apiCall: () => Promise<{ data: T; error: any }>,
  ) => {
    setIsLoading(true);
    setError(null);

    // Optimistically update the UI
    const optimisticData = [...data, newItem];
    setData(optimisticData);

    try {
      // Make the actual API call
      const result = await apiCall();

      if (result.error) {
        throw result.error;
      }

      // Update with the actual data from the server
      setData((currentData) => {
        const updatedData = [...currentData];
        const optimisticIndex = updatedData.findIndex(
          (item) => item === newItem,
        );
        if (optimisticIndex !== -1) {
          updatedData[optimisticIndex] = result.data;
        }
        return updatedData;
      });

      if (onSuccess) {
        onSuccess(result.data);
      }

      return { data: result.data, error: null };
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("An unknown error occurred");
      setError(error);

      // Rollback the optimistic update if needed
      if (rollbackOnError) {
        setData((currentData) =>
          currentData.filter((item) => item !== newItem),
        );
      }

      if (onError) {
        onError(error);
      }

      return { data: null, error };
    } finally {
      setIsLoading(false);
    }
  };

  // Remove item optimistically
  const removeItem = async (
    itemToRemove: T,
    apiCall: () => Promise<{ error: any }>,
  ) => {
    setIsLoading(true);
    setError(null);

    // Store the current data for potential rollback
    const previousData = [...data];

    // Optimistically update the UI
    setData((currentData) =>
      currentData.filter((item) => item !== itemToRemove),
    );

    try {
      // Make the actual API call
      const result = await apiCall();

      if (result.error) {
        throw result.error;
      }

      return { error: null };
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("An unknown error occurred");
      setError(error);

      // Rollback the optimistic update if needed
      if (rollbackOnError) {
        setData(previousData);
      }

      if (onError) {
        onError(error);
      }

      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  // Update item optimistically
  const updateItem = async (
    itemToUpdate: T,
    updatedItem: T,
    apiCall: () => Promise<{ data: T; error: any }>,
  ) => {
    setIsLoading(true);
    setError(null);

    // Store the current data for potential rollback
    const previousData = [...data];

    // Optimistically update the UI
    setData((currentData) =>
      currentData.map((item) => (item === itemToUpdate ? updatedItem : item)),
    );

    try {
      // Make the actual API call
      const result = await apiCall();

      if (result.error) {
        throw result.error;
      }

      // Update with the actual data from the server
      setData((currentData) =>
        currentData.map((item) => (item === updatedItem ? result.data : item)),
      );

      if (onSuccess) {
        onSuccess(result.data);
      }

      return { data: result.data, error: null };
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("An unknown error occurred");
      setError(error);

      // Rollback the optimistic update if needed
      if (rollbackOnError) {
        setData(previousData);
      }

      if (onError) {
        onError(error);
      }

      return { data: null, error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data,
    setData,
    isLoading,
    error,
    addItem,
    removeItem,
    updateItem,
  };
}
