"use client";
import { useAppContext } from "@/app/Context/AppContext";
import { socket } from "@/utils/service/constant";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Avatar from "../atoms/Avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { RiMenu2Fill } from "react-icons/ri";

type Props = {
  onClick: () => void;
};

export default function TopNav({ onClick }: Props) {
  const router = useRouter();
  const { setCurrentGame } = useAppContext();
  const [homePlayer, setHomePlayer] = useState<Partial<User>>({});
  const [conStatus, setConStatus] = useState("Ready");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const syncSession = () => {
      try {
        const storedHomePlayer = JSON.parse(localStorage.getItem("home_player") || "{}");
        setHomePlayer(storedHomePlayer || {});
      } catch {
        setHomePlayer({});
      }

      setConStatus(localStorage.getItem("conStatus") || "Ready");
    };

    syncSession();
    window.addEventListener("storage", syncSession);
    return () => {
      window.removeEventListener("storage", syncSession);
    };
  }, []);

  const handleLogout = () => {
    const me = homePlayer?.id ? homePlayer : { id: "" };

    if (me?.id) {
      socket.emit("logout", { player_id: me.id });
    }

    localStorage.clear();
    setCurrentGame("");
    router.replace("/");
  };

  return (
    <div className="sticky top-0 z-30">
      <nav className="flex items-center w-full justify-between border-b border-gray-200/80 bg-white/95 px-3 py-2 backdrop-blur mobile:max-sm:px-2">
        <Button
          onClick={onClick}
          variant="ghost"
          size="icon"
          className="text-themecolor font-bold hidden mobile:max-sm:inline-flex hover:bg-themecolor/10"
        >
          <RiMenu2Fill size={24} />
        </Button>

        <div className="mx-auto flex items-center gap-2">
          <Badge className="bg-themecolor text-[11px] font-medium px-2.5 py-1">
            {conStatus || "Ready"}
          </Badge>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar
              profilePicture={homePlayer.image || ""}
              size={4}
              aria-label="Open profile menu"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-52 rounded-xl border border-gray-200 bg-white p-1 shadow-lg"
          >
            <DropdownMenuLabel className="text-xs font-medium text-gray-600 px-2">
              {homePlayer?.username || "Player"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => router.push("/dashboard")}
              className="rounded-md cursor-pointer"
            >
              New game
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push("/")}
              className="rounded-md cursor-pointer"
            >
              Home
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="rounded-md cursor-pointer text-red-600 focus:text-red-600"
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </div>
  );
}
