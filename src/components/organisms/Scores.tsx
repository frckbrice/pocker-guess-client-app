import Avatar from "../atoms/Avatar";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type Props = {
  homePlayer: User;
  guessPlayer: User;
  score?: Score;
};

export default function Scores(props: Props) {
  return (
    <Card className="bg-themecolor border-themecolor text-white">
      <CardHeader className="pb-2">
        <CardTitle className="font-bold uppercase text-xs tracking-wide text-white">Scores</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between w-full items-center">
          <div className="flex flex-col items-center justify-center">
            <Avatar profilePicture={""} size={3} />
            <span className="text-xs">{props.homePlayer?.username?.split(" ")[0] ?? "You"}</span>
          </div>
          <Badge className="rounded-md bg-white/10 px-3 py-2 font-bold text-lg text-white hover:bg-white/10">
            {props.score?.home_player_score ?? "0"} :
            {props.score?.guess_player_score ?? "0"}
          </Badge>
          <div className="flex flex-col items-center justify-center">
            <Avatar profilePicture={""} size={3} />
            <span className="text-xs"> {props.guessPlayer?.username?.split(" ")[0] ?? "Guess"}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
