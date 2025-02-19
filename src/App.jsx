import { RecoilRoot } from "recoil";
import Quiz from "./components/Quiz";
import Scoreboard from "./components/Scoreboard";

export default function App() {
  return (
    <RecoilRoot>
      <div className="container mx-auto p-5">
        <h1 className="text-2xl font-bold text-center">Quiz Platform</h1>
        <Quiz />
        <Scoreboard />
      </div>
    </RecoilRoot>
  );
}
