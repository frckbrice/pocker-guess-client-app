"use client";

import React, { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

import { signupFn } from "@/utils/service/api-call";
import RoundLoader from "@/components/atoms/RoundLoader";
import { useRouter, useSearchParams } from "next/navigation";

import HomeNav from "@/components/organisms/HomeNav";
import { useAppContext } from "../Context/AppContext";
import { notifyError } from "@/utils/notifications";
import { runOptimisticMutation } from "@/utils/optimistic-mutation";
import {
  clearPendingGameId,
  getPendingGameId,
  setPendingGameId,
} from "@/components/dashboard/api/queries";

export default function Verification() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState<string>("");

  const { currentGame, setCurrentGame } = useAppContext();
  const [redirectGameId, setRedirectGameId] = useState<string>("");

  const [isLoading, setIsLoading] = useState(false);

  const reason = searchParams.get("reason") || "";
  const inviteGameId = searchParams.get("game") || "";
  const nextPath = searchParams.get("next") || "";

  const pageHint = useMemo(() => {
    if (reason === "invite") {
      return "Join this shared game by creating your profile first.";
    }
    if (reason === "signin") {
      return "Please create your profile before starting a new game.";
    }
    return "Excited to have fun?";
  }, [reason]);

  useEffect(() => {
    const pendingGameId = inviteGameId || currentGame || getPendingGameId();
    if (!pendingGameId) return;

    setRedirectGameId(pendingGameId);
    setCurrentGame(pendingGameId);
    setPendingGameId(pendingGameId);
  }, [currentGame, inviteGameId, setCurrentGame]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedHomePlayer = localStorage.getItem("home_player");
    if (!storedHomePlayer) return;

    try {
      const parsedHomePlayer = JSON.parse(storedHomePlayer);
      if (!parsedHomePlayer?.id) return;

      if (redirectGameId) {
        clearPendingGameId();
        router.replace(`/dashboard/${redirectGameId}`);
        return;
      }

      if (nextPath.startsWith("/")) {
        router.replace(nextPath);
      }
    } catch {
      localStorage.removeItem("home_player");
    }
  }, [nextPath, redirectGameId, router]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const snapshot = isLoading;

    try {
      await runOptimisticMutation({
        applyOptimistic: () => {
          setIsLoading(true);
          return snapshot;
        },
        commit: async () => {
          if (!name?.trim()) {
            throw new Error("missing-name");
          }

          const data = { username: name };
          const user = await signupFn(data);
          if (!user) {
            throw new Error("signup-failed");
          }

          localStorage.setItem("home_player", JSON.stringify(user));
          const pendingGameId = redirectGameId || currentGame || getPendingGameId();
          if (pendingGameId) {
            setCurrentGame(pendingGameId);
            clearPendingGameId();
            router.push(`/dashboard/${pendingGameId}`);
            return;
          }

          if (nextPath.startsWith("/")) {
            router.push(nextPath);
            return;
          }

          router.push("/dashboard");
        },
        rollback: (previous) => {
          setIsLoading(Boolean(previous));
        },
      });
    } catch {
      notifyError("Unable to continue. Check your username and retry.", {}, "auth:verify:error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = async (event: any) => {
    if (event.key === "Enter") {
      await submit(event);
    }
  };

  return (
    <main className="flex min-h-screen relative">
      <HomeNav hidden={false} />

      <div className="flex items-center mobile:max-sm:flex-col mobile:max-sm:justify-center mobile:max-sm:text-center mobile:max-sm:w-[95vw] px-24  w-full h-[80vh] justify-between mobile:max-sm:mt-10  mt-[10vh] m-auto">
        <div className="">
          <p className="text-gray-500"></p>
          <h2 className="text-[40px] font-bold text-themecolor bigScreen:text-[60px]  mobile:max-sm:w-full ">
            Welcome To PockerPlay
          </h2>
          <p className="text-gray-500">{pageHint}</p>
          <form
            className="border border-themecolor mobile:max-sm:border-none flex justify-between mobile:max-sm:flex-col mobile:max-sm:gap-2"
            onSubmit={submit}
          >
            <input
              className="w-full px-2 outline-none mobile:max-sm:mt-5 mobile:max-sm:border mobile:max-sm:border-themecolor mobile:max-sm:py-2"
              placeholder="Enter your username"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <button
              className="bg-themecolor bigScreen:text-[40px] text-white py-2 px-8 mobile:max-sm:w-full"
              onKeyDown={handleKeyDown}
            >
              Continue
            </button>
          </form>
        </div>
        <div className="mobile:max-sm:hidden">
          <Image
            src={"/cardpic.png"}
            alt="cards image"
            width={500}
            height={500}
            className="bigScreen:hidden"
          />

          <Image
            src={"/cardpic.png"}
            alt="cards image"
            width={700}
            height={700}
            className="hidden bigScreen:block"
          />
        </div>
      </div>
      {isLoading && (
        <div className="w-full h-full absolute flex items-center justify-center">
          <RoundLoader />
        </div>
      )}
    </main>
  );
}
