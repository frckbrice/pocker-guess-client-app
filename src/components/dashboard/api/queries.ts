type PlayerStorageKey = "home_player" | "guess_player";

const PENDING_GAME_KEY = "pending_game_id";

const EMPTY_PLAYER: User = {
    username: "",
    email: "",
    image: "",
};

/**
 * Reads a persisted player snapshot from local storage.
 */
export function getStoredPlayer(key: PlayerStorageKey): User | null {
    if (typeof window === "undefined") return null;

    const rawValue = localStorage.getItem(key);
    if (!rawValue || rawValue === "undefined") return null;

    try {
        return JSON.parse(rawValue);
    } catch {
        return key === "home_player" ? EMPTY_PLAYER : null;
    }
}

/**
 * Reads the stored room role for the current user session.
 */
export function getStoredRole(): string {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("status") || "";
}

/**
 * Checks whether a home player object has a usable identifier.
 */
export function hasValidHomePlayer(player: User | null): boolean {
    return Boolean(player?.id && Object.keys(player).length);
}

/**
 * Builds a shareable URL for a dashboard room.
 */
export function buildGameUrl(gameId: string): string {
    if (typeof window !== "undefined" && window.location?.origin) {
        return `${window.location.origin}/dashboard/${gameId}`;
    }

    const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL;
    const baseUrl = vercelUrl
        ? vercelUrl.startsWith("http")
            ? vercelUrl
            : `https://${vercelUrl}`
        : "http://localhost:3001";

    return `${baseUrl}/dashboard/${gameId}`;
}

/**
 * Computes if selected and guessed cards currently match.
 */
export function computeResultMatch(
    selectedCard: string,
    guessGuess: string,
    choiceReceived: boolean,
    generateStatus: string
): boolean {
    if (
        (selectedCard !== "?" && guessGuess !== "?") ||
        (selectedCard && guessGuess && guessGuess === selectedCard)
    ) {
        return selectedCard === guessGuess;
    }

    if (choiceReceived || !generateStatus) return false;
    return false;
}

/**
 * Persists the game id that should be opened after verification.
 */
export function setPendingGameId(gameId: string) {
    if (typeof window === "undefined") return;
    if (!gameId) return;
    localStorage.setItem(PENDING_GAME_KEY, gameId);
}

/**
 * Reads the pending game id saved before redirecting to verification.
 */
export function getPendingGameId(): string {
    if (typeof window === "undefined") return "";
    return localStorage.getItem(PENDING_GAME_KEY) || "";
}

/**
 * Clears any pending game id used by the verification flow.
 */
export function clearPendingGameId() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(PENDING_GAME_KEY);
}
