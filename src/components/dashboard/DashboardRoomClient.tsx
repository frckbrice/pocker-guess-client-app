"use client";

import Card from "@/components/atoms/Card";
import CardGuess from "@/components/atoms/CardGuess";
import Overlay from "@/components/atoms/Overlay";
import Popups from "@/components/atoms/Popups";
import RoundLoader from "@/components/atoms/RoundLoader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card as ShadcnCard,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Statistics from "@/components/organisms/Insights/Statistcs";
import Scores from "@/components/organisms/Scores";
import type { ReactNode } from "react";
import { FcCloseUpMode } from "react-icons/fc";
import { GrClose } from "react-icons/gr";
import { useDashboardRoom } from "./hooks/useDashboardRoom";

type DashboardRoomClientProps = {
    gameId: string;
};

type SelectControlProps = {
    placeholder: string;
    defaultValue: string;
    options: Array<{ label: string; value: string }>;
    onChange: (value: string) => void;
};

function SelectControl({
    placeholder,
    defaultValue,
    options,
    onChange,
}: SelectControlProps) {
    return (
        <Select
            defaultValue={defaultValue}
            onValueChange={onChange}
        >
            <SelectTrigger className="w-[120px] mobile:max-sm:w-[96px] border-themecolor text-themecolor focus:ring-themecolor">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

type ActionButtonProps = {
    onClick: () => void;
    children: ReactNode;
};

function ActionButton({ onClick, children }: ActionButtonProps) {
    return (
        <Button
            onClick={onClick}
            variant="outline"
            className="border-themecolor text-themecolor hover:bg-themecolor hover:text-white"
        >
            {children}
        </Button>
    );
}

type PlayerCardPanelProps = {
    roleName: "home_player" | "guess_player";
    whoPlays: string;
    image: string;
    category: string;
    username: string;
    statusText?: string;
};

function PlayerCardPanel({
    roleName,
    whoPlays,
    image,
    category,
    username,
    statusText,
}: PlayerCardPanelProps) {
    const isHomePlayer = roleName === "home_player";

    return (
        <div className="flex flex-col justify-center items-center w-fit">
            {whoPlays === roleName ? (
                <span className="text-themecolor">
                    <span className="wave text-[30px]">👇🏿</span>
                    {isHomePlayer ? "you play" : "turn to play"}
                </span>
            ) : (
                ""
            )}

            {isHomePlayer ? (
                <Card
                    image={image}
                    text={image}
                    className="w-[80px] h-[80px]"
                    category={category}
                />
            ) : (
                <CardGuess
                    image={image}
                    text={image}
                    className="w-[80px] h-[80px]"
                    category={category}
                />
            )}

            <span>{username}</span>
            {statusText ? <span>{statusText}</span> : null}
        </div>
    );
}

const CATEGORY_OPTIONS = [
    { label: "Words", value: "words" },
    { label: "Images", value: "images" },
];

const NUMBER_OPTIONS = [
    { label: "5", value: "5" },
    { label: "6", value: "6" },
    { label: "7", value: "7" },
    { label: "8", value: "8" },
    { label: "9", value: "9" },
    { label: "10", value: "10" },
];

/**
 * UI shell for the dashboard game room.
 * Business logic is delegated to useDashboardRoom.
 */
export default function DashboardRoomClient({ gameId }: DashboardRoomClientProps) {
    const {
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
    } = useDashboardRoom({ gameId });

    if (game) return <Statistics data={stats} game={game} />;

    return (
        <main className="flex mobile:max-sm:flex-col-reverse relative justify-between bg-bgGray mobile:max-sm:h-auto bigScreen:h-[calc(100vh-50px)] h-[calc(100vh-49px)] overflow-hidden">
            <div className="py-4 px-8 w-full min-w-0 mobile:max-sm:px-2 mobile:max-sm:h-[calc(100vh-180px)] flex flex-col gap-5">
                <div className="flex justify-between w-full">
                    <div className="flex gap-2 mobile:max-sm:h-[4rem]">
                        <SelectControl
                            placeholder="Category"
                            defaultValue="words"
                            options={CATEGORY_OPTIONS}
                            onChange={setCategory}
                        />

                        <SelectControl
                            placeholder="Count"
                            defaultValue="5"
                            options={NUMBER_OPTIONS}
                            onChange={(value) => setNumberOfOptions(+value)}
                        />
                    </div>
                    <div className="mx-auto">
                        {conClose ? (
                            <Badge variant="destructive" className="text-[11px]">
                                {generateStatus || "Disconnected"}
                            </Badge>
                        ) : (
                            <Badge className="text-[11px] bg-themecolor">{conStatus || "Connected"}</Badge>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {isGenerating && <RoundLoader />}
                        <ActionButton onClick={clearSpace}>Clear</ActionButton>
                        <ActionButton onClick={handleGenerate}>🃏 Generate</ActionButton>
                        <Button
                            onClick={endGameAndBack}
                            variant="destructive"
                        >
                            End game
                        </Button>
                    </div>
                </div>

                <div className="flex justify-between items-center w-full">
                    <PlayerCardPanel
                        roleName="home_player"
                        whoPlays={whoPlays}
                        image={selectedCard}
                        category={category}
                        username={homePlayer?.username?.split(" ")[0] ?? "You"}
                    />

                    <div className="flex gap-3 items-center justify-center">
                        <section
                            className={`${(currentGame || role === "guess_player" || guessPlayer?.id || !showShareLink) &&
                                "hidden"
                                }`}
                        >
                            <Button
                                onClick={copyShareLink}
                                variant="ghost"
                                className="flex gap-1 items-center text-green-600 hover:text-green-700"
                            >
                                <span className="text-green-600">{gameUrl ? gameUrl : ""}</span>
                            </Button>
                        </section>

                        <div className={isCopied ? "block" : "hidden"}>
                            {isResultMatch ? (
                                <span>
                                    <FcCloseUpMode size={50} className="text-green-800 w-full mx-auto" />
                                </span>
                            ) : (
                                <GrClose size={50} className="text-red-800 w-full mx-auto" />
                            )}
                        </div>
                    </div>

                    <PlayerCardPanel
                        roleName="guess_player"
                        whoPlays={whoPlays}
                        image={guessGuess}
                        category={category}
                        username={guessPlayer?.username?.split(" ")[0] ?? "Guess"}
                        statusText={guessPlayerSending || ""}
                    />
                </div>

                <ShadcnCard className="w-full h-[40vh] bigScreen:h-[60vh] border-themecolor overflow-y-auto bg-white">
                    <CardContent className="flex items-center justify-center gap-2 p-2 flex-wrap">
                        {generatedData.map((data, index) => (
                            <Card
                                key={index}
                                image={data}
                                text={data}
                                onClick={() => setSelectedCard(data)}
                                className="w-[100px] h-[100px] bigScreen:w-[250px] bigScreen:h-[250px]"
                                category={category}
                            />
                        ))}
                    </CardContent>
                </ShadcnCard>

                <Textarea
                    className="h-[10vh] text-xs"
                    placeholder="enter a hint message..."
                    value={messageHint}
                    onChange={(event) => setMessageHint(event.target.value)}
                />
                <Button className="bg-themecolor hover:bg-themecolor/90" onClick={sendChoiceOrGuess}>
                    Play
                </Button>
            </div>

            <ShadcnCard className="bg-white flex flex-col w-[280px] min-w-[220px] max-w-[420px] mobile:max-sm:w-full mobile:max-sm:max-w-full mobile:max-sm:min-w-full mobile:max-sm:resize-none resize-x overflow-auto shadow-md h-full px-2 py-4 gap-5 shrink-0 rounded-none border-y-0 border-r-0">
                <Scores
                    homePlayer={homePlayer ?? { username: "You" }}
                    guessPlayer={guessPlayer ?? { username: "Guess" }}
                    score={score}
                />
                <CardHeader className="p-0">
                    <CardTitle className="text-sm text-themecolor">Round Progress</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="flex border border-themecolor rounded-[5px] p-2 justify-center gap-4 font-extrabold text-themecolor">
                        <span>{`${round?.round_number ? round?.round_number : 1}/5`}</span>
                        <span>Rounds</span>
                    </div>
                </CardContent>
            </ShadcnCard>

            {isGameOver && (
                <div
                    style={{
                        backgroundImage:
                            "url(https://png2.cleanpng.com/sh/932b0a95c4c25dc288841e425028b56e/L0KzQYm3U8AzN5p6iZH0aYP2gLBuTgJmbF5qhuhubHBzdX7qjPlxNZJ3jJ9CaX7xebBuTgJmbF53edt3LUXkSYrtVsdmOWM4T9UDLka0SIa5UcQ0OWY3SKI8OUW4QIGAVMYveJ9s/kisspng-red-envelope-clip-art-winning-red-rain-5a99f67e1237c8.6185214315200395500746.png)",
                    }}
                    className="absolute z-40 h-full w-full mobile:max-sm:w-[80vw] bg-white"
                >
                    <div className="flex flex-col justify-center items-center w-full h-full">
                        {isWinner && (
                            <Popups
                                title="CONGRATULATIONS"
                                content="you won 🌞👏👏👏"
                                actionText="NEW GAME"
                                onCancel={() => setIsGameOver((prev) => !prev)}
                                onAction={endGameAndBack}
                                styles="border rounded"
                                actionBTNStyle="border text-themecolor"
                            />
                        )}

                        {!isLooser && (
                            <Popups
                                title="GAME OVER"
                                content="you loose "
                                actionText="NEW GAME"
                                onCancel={() => setIsGameOver((prev) => !prev)}
                                onAction={endGameAndBack}
                                styles="border rounded"
                                actionBTNStyle="border text-themecolor"
                            />
                        )}
                    </div>
                </div>
            )}

            {isEndOfRound && (
                <>
                    <Overlay onClick={() => setIsEndOfRound((prev) => !prev)} transparent />
                    <Popups
                        title="Round end"
                        content="you won"
                        actionText="NEXT ROUND"
                        onCancel={() => setIsEndOfRound((prev) => !prev)}
                        onAction={() => setIsEndOfRound((prev) => !prev)}
                        styles="bg-themecolor text-white"
                        actionBTNStyle=""
                    />
                </>
            )}
        </main>
    );
}
