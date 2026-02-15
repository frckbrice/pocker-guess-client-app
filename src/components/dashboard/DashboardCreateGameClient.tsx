"use client";

import RoundLoader from "@/components/atoms/RoundLoader";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useDashboardCreateGame } from "./hooks/useDashboardCreateGame";

/**
 * Client UI for creating a new game session from the dashboard home route.
 */
export default function DashboardCreateGameClient() {
    const { isLoading, createNewGame } = useDashboardCreateGame();

    return (
        <main className="flex justify-center items-center p-4 m-auto min-h-[calc(100vh-120px)]">
            <Card className="w-[42vw] mobile:max-sm:w-full border-themecolor relative">
                <CardHeader>
                    <CardTitle className="text-xl text-themecolor">Game setup</CardTitle>
                    <CardDescription>
                        Start a new game session, share the link with a friend, and continue your
                        active rounds from the dashboard.
                    </CardDescription>
                </CardHeader>
                <CardContent />
                <CardFooter className="flex items-center justify-between gap-3">
                    <Button asChild variant="outline" className="border-themecolor text-themecolor">
                        <Link href="/">Back home</Link>
                    </Button>
                    <Button
                        className="bg-themecolor hover:bg-themecolor/90"
                        onClick={createNewGame}
                        disabled={isLoading}
                    >
                        New game
                    </Button>
                </CardFooter>
                {isLoading && (
                    <div className="absolute self-center top-28">
                        <RoundLoader />
                    </div>
                )}
            </Card>
        </main>
    );
}
