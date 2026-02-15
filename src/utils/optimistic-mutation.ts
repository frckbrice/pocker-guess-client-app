type OptimisticMutationOptions<TResult, TSnapshot = unknown> = {
    applyOptimistic?: () => TSnapshot;
    commit: () => Promise<TResult> | TResult;
    rollback?: (snapshot: TSnapshot | undefined) => void;
    onError?: (error: unknown) => void;
    onSettled?: () => void;
};

export const runOptimisticMutation = async <TResult, TSnapshot = unknown>({
    applyOptimistic,
    commit,
    rollback,
    onError,
    onSettled,
}: OptimisticMutationOptions<TResult, TSnapshot>): Promise<TResult> => {
    let snapshot: TSnapshot | undefined;

    try {
        snapshot = applyOptimistic?.();
        return await commit();
    } catch (error) {
        rollback?.(snapshot);
        onError?.(error);
        throw error;
    } finally {
        onSettled?.();
    }
};
