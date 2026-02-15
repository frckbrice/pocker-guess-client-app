"use client";
import { useState } from "react";
import { CiLogout } from "react-icons/ci";
import Link from "next/link";
import { socket } from "@/utils/service/constant";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/app/Context/AppContext";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

type SideNavProps = {
  compact?: boolean;
  onNavigate?: () => void;
};

export default function SideNav({ compact = false, onNavigate }: SideNavProps) {
  const router = useRouter();
  const { currentGame, setCurrentGame } = useAppContext();
  const [openLogout, setOpenLogout] = useState(false);
  if (typeof localStorage === "undefined") return;
  const myDms = JSON.parse(localStorage.getItem("myDM")!) || [];

  const handleNewGame = () => {
    localStorage.removeItem("guess_player");
    localStorage.removeItem("status");
    localStorage.removeItem("conStatus");
    localStorage.removeItem("myDM");
    setCurrentGame("");
    onNavigate?.();
    router.push("/dashboard");
  };

  const handleLogout = () => {
    const me =
      typeof localStorage !== "undefined" && localStorage.getItem("home_player")
        ? JSON.parse(localStorage.getItem("home_player")!)
        : { username: "", id: "" };

    if (me?.id) {
      socket.emit("logout", { player_id: me.id });
    }

    localStorage.clear();
    setOpenLogout(false);
    onNavigate?.();
    router.replace("/");
  };

  return (
    <div className={`flex flex-col justify-between bg-themecolor ${compact ? "w-full" : "w-[240px]"} h-[100vh] items-center py-2`}>
      <div className="flex flex-col w-full gap-30">
        <div className="text-white flex justify-center items-center font-bold mb-[40px]">
          <Link href={"/"}>
            <Image
              src={"/POCKERPLAY-LOGO-white.png"}
              alt=""
              width={200}
              height={100}
            />
          </Link>
        </div>
        <div>
          <div>
            <Button
              onClick={handleNewGame}
              variant="ghost"
              className="bg-white text-slate-600 border-b border-b-1 border-b-slate-400 duration-300  w-full p-2 rounded-none hover:text-themecolor"
            >
              New Game
            </Button>
          </div>
          <div className=" px-2 flex flex-col justify-center items-center">
            <h2 className="text-xl text-green-500 font-boldtext-center">Players</h2>
            {myDms.length
              ? myDms?.map((user: Partial<User>, i: number) => (
                <span
                  key={i}
                  className=" text-center text-[#f5f6f8] text-[11px]"
                >
                  {user?.username}
                </span>
              ))
              : null}
          </div>
        </div>
      </div>



      <Dialog open={openLogout} onOpenChange={setOpenLogout}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave game</DialogTitle>
            <DialogDescription>
              Are you sure you want to logout and leave the current game session?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenLogout(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleLogout} >
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* <Button
        onClick={() => {
          setOpenLogout((prev) => !prev);
        }}
        className="flex items-center justify-center  py-1 bg-white/25 duration-300  hover:text-themecolor w-full text-white gap-3 px-4"
      >
        <CiLogout /> <span>logout</span>
      </Button> */}
      {currentGame ? (
        <span className="text-[11px] text-white/80 mb-2 px-3 text-center">
          Active room: {currentGame}
        </span>
      ) : null}
    </div>
  );
}
