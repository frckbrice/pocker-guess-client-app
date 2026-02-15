"use client";

import { useAppContext } from "@/app/Context/AppContext";
import { notifyError, notifySuccess } from "@/utils/notifications";
import { socket } from "@/utils/service/constant";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    emitJoinGame,
    generateRoundMutation,
    requestMyDM,
    sendChoiceMutation,
    sendGuessMutation,
} from "../api/mutations";
import {
    buildGameUrl,
    computeResultMatch,
    getStoredPlayer,
    getStoredRole,
    hasValidHomePlayer,
} from "../api/queries";

type UseDashboardRoomProps = {
    gameId: string;
};

/**
 * Handles dashboard room orchestration: socket events, game state, and UI actions.
 */
export function useDashboardRoom({ gameId }: UseDashboardRoomProps) {
    const router = useRouter();
    const { setCurrentGame, currentGame, setIsGuess } = useAppContext();

    const clearRoomSession = useCallback(() => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("guess_player");
            localStorage.removeItem("status");
            localStorage.removeItem("conStatus");
            localStorage.removeItem("myDM");
        }
        setCurrentGame("");
        setIsGuess(false);
    }, [setCurrentGame, setIsGuess]);

    const [generatedData, setGenerataedData] = useState<Array<string>>([]);
    const [selectedCard, setSelectedCard] = useState<string>("?");
    const [score, setScore] = useState<Score>();
    const [homePlayer, setHomePlayer] = useState<User | null>(() =>
        getStoredPlayer("home_player")
    );
    const [guessPlayer, setGuessPlayer] = useState<User | null>(() =>
        getStoredPlayer("guess_player")
    );
    const [round, setRound] = useState<Round>();
    const [conClose, setConClose] = useState<boolean>(false);
    const [conStatus, setConStatus] = useState<string>("");
    const [playerChoice, setPlayerChoice] = useState<string>("");
    const [guessGuess, setGuessGuess] = useState<string>("?");
    const [generateStatus, setGenerateStatus] = useState<string>("");
    const [category, setCategory] = useState<string>("words");
    const [numberOfOptions, setNumberOfOptions] = useState<number>(5);
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [isCopied, setIsCopied] = useState<boolean>(false);
    const [messageHint, setMessageHint] = useState<string>("");
    const [gameUrl, setGameUrl] = useState<string>("");
    const [choiceReceived, setChoiceReceived] = useState<boolean>(false);
    const [game, setGame] = useState<GameSession>();
    const [role, setRole] = useState<string>(() => getStoredRole());
    const [choiceMadeId, setChoiceMadeId] = useState<string>("");
    const [isWinner, setIsWinner] = useState(false);
    const [isLooser, setIsLooser] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const [isEndOfRound, setIsEndOfRound] = useState(false);
    const [roundCounter, setRoundCounter] = useState<number>(0);
    const [whoPlays, setWhoPlays] = useState<string>("");
    const [stats, setStats] = useState<StatType[]>([]);
    const [showShareLink, setShowShareLink] = useState(true);
    const [guessPlayerSending, setGuessPlayerSending] = useState<string>("");

    const handleCopyToast = useCallback((message: string, toastId?: string) => {
        notifySuccess(message, {}, toastId ?? `copy:${message}`);
        setIsCopied(true);
    }, []);

    useEffect(() => {
        if (homePlayer?.id || guessPlayer?.id) return;

        notifyError(
            "Session missing or expired. Create a new game to continue.",
            {},
            "room:session:missing"
        );
        clearRoomSession();
        router.replace("/dashboard");
    }, [clearRoomSession, guessPlayer?.id, homePlayer?.id, router]);

    useEffect(() => {
        if (!hasValidHomePlayer(homePlayer)) {
            notifyError(
                "Game session expired. Start a new game from dashboard.",
                {},
                "room:session:expired"
            );
            clearRoomSession();
            router.replace("/dashboard");
            return;
        }

        if (!currentGame) {
            setGameUrl(buildGameUrl(gameId));
        }

        emitJoinGame(gameId, homePlayer?.id);
        requestMyDM(gameId, homePlayer?.id);

        let sessionExpiredTimer: ReturnType<typeof setTimeout>;

        const onConnection = () => {
            clearTimeout(sessionExpiredTimer);
            setConStatus("🟢 link open ");
            setConClose(false);
        };

        const onError = (error: Error) => {
            console.log("socket error", error);
        };

        let reconnectTimer: ReturnType<typeof setTimeout>;
        const onDisconnect = () => {
            setConClose(true);
            setGenerateStatus("🔴 connection close. retrying...");
            reconnectTimer = setTimeout(() => socket.connect(), 100);
            sessionExpiredTimer = setTimeout(() => {
                if (socket.connected) return;
                notifyError(
                    "Connection lost and session expired. Please start a new game.",
                    {},
                    "room:session:timeout"
                );
                clearRoomSession();
                router.replace("/dashboard");
            }, 5000);
        };

        socket.on("connect", onConnection);
        socket.on("connection", onConnection);
        socket.on("error", onError);
        socket.on("disconnect", onDisconnect);

        return () => {
            clearTimeout(reconnectTimer);
            clearTimeout(sessionExpiredTimer);
            socket.off("connect", onConnection);
            socket.off("connection", onConnection);
            socket.off("error", onError);
            socket.off("disconnect", onDisconnect);
        };
    }, [clearRoomSession, currentGame, gameId, homePlayer, router]);

    useEffect(() => {
        const onRound = (data: any) => {
            if (!data) return;

            setIsGenerating(false);
            setRound(data.round);
            if (data.proposals.length) {
                setGenerataedData(data.proposals);
                return;
            }

            setGenerateStatus("No data generated by the server. try again");
        };

        const onSending = (data: any) => {
            if (!data) return;
            if (data.role === role) {
                setGuessPlayerSending("");
                return;
            }
            setGuessPlayerSending(data.text);
        };

        const onNotify = (data: any) => {
            if (!data?.guessPlayer) return;

            handleCopyToast("Guess player connected", "game:guess-connected");

            if (data.homePlayer.id === homePlayer?.id) {
                localStorage.setItem("guess_player", JSON.stringify(data.guessPlayer));
                setGuessPlayer(data.guessPlayer);
                setRole("home_player");
                localStorage.setItem("status", "home_player");
                localStorage.setItem("conStatus", `${data.notify} guess_player connected`);
                return;
            }

            localStorage.setItem("home_player", JSON.stringify(data.guessPlayer));
            setHomePlayer(data.guessPlayer);
            localStorage.setItem("guess_player", JSON.stringify(data.homePlayer));
            setGuessPlayer(data.homePlayer);
            setRole("guess_player");
            localStorage.setItem("status", "guess_player");
            localStorage.setItem("conStatus", `${data.notify} home_player connected`);
        };

        const onReceiveGuess = (data: any) => {
            if (!data) return;

            if (data?.stats?.length) setStats(data.stats);
            if (data?.role === role) {
                setWhoPlays("home_player");
                setRoundCounter(2);
                setTimeout(() => setGuessGuess(playerChoice), 2000);
                setGuessPlayerSending("");
            } else {
                setTimeout(() => setGuessGuess(data.guess), 2000);
                setWhoPlays("guess_player");
                setGuessPlayerSending("");
            }
            setScore(data?.score);
            setCategory(data?.category);
        };

        const onReceiveChoice = (data: any) => {
            if (!data) return;

            if (data.role !== role) {
                setPlayerChoice(data.choiceData);
                setChoiceMadeId(data.choice);
                setChoiceReceived(true);
                setWhoPlays("home_player");
                setGuessPlayerSending("");
            } else {
                setRoundCounter(1);
                setWhoPlays("guess_player");
                setGuessPlayerSending("");
            }
            setRound(data.round);
            setGenerataedData(data.proposals);
            setCategory(data.category);
            setMessageHint(data.message);
        };

        const onMyDM = (data: any) => {
            if (data?.length) {
                localStorage.setItem("myDM", JSON.stringify(data));
            }
        };

        const onEndGame = (data: any) => {
            if (!data) return;

            if (data.role === "home_player") setSelectedCard(data.guess);
            if (data.role === "guess_player") setGuessGuess(data.guess);
            if (data.gameState === "END") setIsWinner(true);
            setGame(data.game);
        };

        socket.on("round", onRound);
        socket.on("sending", onSending);
        socket.on("notify", onNotify);
        socket.on("receive_guess", onReceiveGuess);
        socket.on("receive_choice", onReceiveChoice);
        socket.on("myDM", onMyDM);
        socket.on("endGame", onEndGame);

        return () => {
            socket.off("round", onRound);
            socket.off("sending", onSending);
            socket.off("notify", onNotify);
            socket.off("receive_guess", onReceiveGuess);
            socket.off("receive_choice", onReceiveChoice);
            socket.off("myDM", onMyDM);
            socket.off("endGame", onEndGame);
        };
    }, [handleCopyToast, homePlayer?.id, playerChoice, role]);

    const handleGenerate = useCallback(async () => {
        if (!homePlayer?.id) {
            notifyError("Missing player session", {}, "room:missing-player");
            return;
        }

        await generateRoundMutation(
            {
                home_player_id: homePlayer.id,
                gamesession_id: gameId,
                category,
                number_of_proposals: numberOfOptions,
                round_number: round && roundCounter === 2 ? round.round_number + 1 : 1,
            },
            {
                onOptimistic: () => {
                    setIsGenerating(true);
                    setGenerateStatus("");
                    setMessageHint("");
                    if (roundCounter === 2) setRoundCounter(0);
                },
                onError: () => {
                    setIsGenerating(false);
                    setGenerateStatus("Unable to generate a new round. Retry.");
                },
            }
        );
    }, [category, gameId, homePlayer?.id, numberOfOptions, round, roundCounter]);

    const sendChoiceOrGuess = useCallback(async () => {
        if (!role || !round || !homePlayer || !guessPlayer) {
            notifyError("Missing game context for this action", {}, "room:context:error");
            return;
        }

        const playerId = role === "home_player" ? homePlayer?.id : guessPlayer?.id;

        if (choiceMadeId || choiceReceived) {
            await sendGuessMutation(
                {
                    round_id: round?.id,
                    choice_id: choiceMadeId || "",
                    player_guess: selectedCard,
                    player_id: playerId,
                    role,
                    gamesession_id: gameId,
                    category,
                },
                {
                    onOptimistic: () => {
                        setGuessPlayerSending("Sending guess...");
                        setChoiceReceived(false);
                        setChoiceMadeId("");
                        setWhoPlays(role === "home_player" ? "guess_player" : "home_player");
                    },
                    onError: () => {
                        setGuessPlayerSending("");
                    },
                }
            );

            return;
        }

        if (!selectedCard || !generatedData.length) {
            notifyError("Choose a card before sending", {}, "room:choice:missing");
            return;
        }

        await sendChoiceMutation(
            {
                gamesession_id: gameId,
                round,
                message_hint: messageHint,
                player_choice: selectedCard,
                proposals: generatedData,
                role,
                player_id: playerId,
                category,
            },
            {
                onOptimistic: () => {
                    setGuessPlayerSending("Sending choice...");
                    setWhoPlays(role === "home_player" ? "guess_player" : "home_player");
                    setGuessGuess("");
                    setTimeout(() => {
                        setChoiceMadeId("");
                        setPlayerChoice("");
                    }, 1000);
                },
                onError: () => {
                    setGuessPlayerSending("");
                },
            }
        );
    }, [
        category,
        choiceMadeId,
        choiceReceived,
        gameId,
        generatedData,
        guessPlayer,
        homePlayer,
        messageHint,
        role,
        round,
        selectedCard,
    ]);

    const clearSpace = useCallback(() => {
        setSelectedCard("");
        setGuessGuess("");
        setGenerataedData([]);
        setGenerateStatus("");
        setMessageHint("");
        router.refresh();
    }, [router]);

    const copyShareLink = useCallback(async () => {
        if (!gameUrl) return;

        await navigator.clipboard.writeText(gameUrl);
        setShowShareLink(false);
        handleCopyToast("Copied!", "room:share-link");
    }, [gameUrl, handleCopyToast]);

    const endGameAndBack = useCallback(() => {
        const activePlayerId = role === "guess_player" ? guessPlayer?.id : homePlayer?.id;
        if (activePlayerId) {
            socket.emit("logout", { player_id: activePlayerId });
        }
        clearRoomSession();
        router.replace("/dashboard");
    }, [clearRoomSession, guessPlayer?.id, homePlayer?.id, role, router]);

    const isResultMatch = useMemo(
        () => computeResultMatch(selectedCard, guessGuess, choiceReceived, generateStatus),
        [selectedCard, guessGuess, choiceReceived, generateStatus]
    );

    return {
        generatedData,
        selectedCard,
        setSelectedCard,
        score,
        homePlayer,
        guessPlayer,
        round,
        conClose,
        conStatus,
        guessGuess,
        generateStatus,
        category,
        setCategory,
        numberOfOptions,
        setNumberOfOptions,
        isGenerating,
        isCopied,
        messageHint,
        setMessageHint,
        gameUrl,
        game,
        role,
        isWinner,
        isLooser,
        isGameOver,
        setIsGameOver,
        isEndOfRound,
        setIsEndOfRound,
        whoPlays,
        stats,
        showShareLink,
        guessPlayerSending,
        currentGame,
        handleGenerate,
        sendChoiceOrGuess,
        clearSpace,
        copyShareLink,
        isResultMatch,
        endGameAndBack,
    };
}
