import { notifyError } from "@/utils/notifications";
import { runOptimisticMutation } from "@/utils/optimistic-mutation";
import { socket } from "@/utils/service/constant";

type GenerateRoundPayload = {
    home_player_id: string;
    gamesession_id: string;
    category: string;
    number_of_proposals: number;
    round_number: number;
};

type ChoicePayload = {
    gamesession_id: string;
    round: Round;
    message_hint: string;
    player_choice: string;
    proposals: string[];
    role: string;
    player_id?: string;
    category: string;
};

type GuessPayload = {
    round_id?: string;
    choice_id: string;
    player_guess: string;
    player_id?: string;
    role: string;
    gamesession_id: string;
    category: string;
};

/**
 * Emits join-game event for a room and player.
 */
export function emitJoinGame(gamesessionId: string, playerId?: string) {
    socket.emit("joingame", {
        gamesession_id: gamesessionId,
        playerId,
    });
}

/**
 * Requests direct-message history/stream bootstrap for a room.
 */
export function requestMyDM(gamesessionId: string, playerId?: string) {
    socket.emit("myDM", {
        id: playerId,
        gamesession_id: gamesessionId,
    });
}

/**
 * Sends a generate-round request with optimistic UI handling.
 */
export async function generateRoundMutation(
    payload: GenerateRoundPayload,
    handlers: {
        onOptimistic: () => void;
        onError: () => void;
    }
) {
    await runOptimisticMutation({
        applyOptimistic: handlers.onOptimistic,
        commit: () => socket.emit("generate", payload),
        onError: () => {
            handlers.onError();
            notifyError("Could not generate a round", {}, "room:generate:error");
        },
    });
}

/**
 * Sends guess payload with optimistic UI lifecycle.
 */
export async function sendGuessMutation(
    payload: GuessPayload,
    handlers: {
        onOptimistic: () => void;
        onError: () => void;
    }
) {
    await runOptimisticMutation({
        applyOptimistic: handlers.onOptimistic,
        commit: () => socket.emit("send_guess", payload),
        onError: () => {
            handlers.onError();
            notifyError("Failed to send guess", {}, "room:guess:error");
        },
    });
}

/**
 * Sends choice payload with optimistic UI lifecycle.
 */
export async function sendChoiceMutation(
    payload: ChoicePayload,
    handlers: {
        onOptimistic: () => void;
        onError: () => void;
    }
) {
    await runOptimisticMutation({
        applyOptimistic: handlers.onOptimistic,
        commit: () => socket.emit("send_choice", payload),
        onError: () => {
            handlers.onError();
            notifyError("Failed to send choice", {}, "room:choice:error");
        },
    });
}
