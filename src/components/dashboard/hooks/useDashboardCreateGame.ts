"use client";

import { notifyError, notifySuccess } from "@/utils/notifications";
import { runOptimisticMutation } from "@/utils/optimistic-mutation";
import { socket } from "@/utils/service/constant";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { getStoredPlayer } from "../api/queries";

/**
 * Encapsulates create-game state and socket workflow for dashboard setup.
 */
export function useDashboardCreateGame() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [homePlayer] = useState<User | null>(() => getStoredPlayer("home_player"));

    useEffect(() => {
        const onInit = (data: any) => {
            if (!data) return;

            if (data.state === "new game") {
                setIsLoading(false);
                notifySuccess("New game created", { hideProgressBar: false }, "game:new");
                router.push(`/dashboard/${data.game}`);
                return;
            }

            setIsLoading(false);
            notifyError("Failed to create game", {}, "game:new:error");
        };

        socket.on("init", onInit);
        return () => {
            socket.off("init", onInit);
        };
    }, [router]);

    const createNewGame = useCallback(async () => {
        if (!homePlayer?.id) {
            notifyError("Please sign in before creating a game", {}, "game:new:no-user");
            router.push(`/verification?reason=signin&next=${encodeURIComponent("/dashboard")}`);
            return;
        }

        await runOptimisticMutation({
            applyOptimistic: () => {
                setIsLoading(true);
                return true;
            },
            commit: () => {
                socket.emit("init", { home_player_id: homePlayer.id });
            },
            rollback: () => {
                setIsLoading(false);
            },
            onError: () => {
                notifyError("Unable to start a new game", {}, "game:new:emit");
            },
        });
    }, [homePlayer?.id, router]);

    return {
        isLoading,
        createNewGame,
    };
}
