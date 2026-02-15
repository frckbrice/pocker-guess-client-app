"use client";
import { useAppContext } from "@/app/Context/AppContext";
import { socket } from "@/utils/service/constant";
import { useRouter } from "next/navigation";
import Avatar from "../atoms/Avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
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
  if (typeof localStorage === "undefined") return;

  const homePlayer = JSON.parse(localStorage.getItem("home_player") || "{}");
  const conStatus = localStorage.getItem("conStatus");

  const handleLogout = () => {
    const me = localStorage.getItem("home_player")
      ? JSON.parse(localStorage.getItem("home_player")!)
      : { id: "" };

    if (me?.id) {
      socket.emit("logout", { player_id: me.id });
    }

    localStorage.clear();
    setCurrentGame("");
    router.replace("/");
  };

  return (
    <div>
      <nav className="flex items-center bg-white w-full justify-between border-b px-2 py-1 border-gray-200">
        <Button
          onClick={onClick}
          variant="ghost"
          size="icon"
          className="text-themecolor font-bold hidden mobile:max-sm:inline-flex"
        >
          <RiMenu2Fill size={24} />
        </Button>

        <div className="mx-auto">
          <Badge className="bg-themecolor text-[11px]">
            {conStatus || "Ready"}
          </Badge>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-full">
              <Avatar profilePicture={homePlayer.image} size={4} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push("/dashboard")}>New game</DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/")}>Home</DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </div>
  );
}
