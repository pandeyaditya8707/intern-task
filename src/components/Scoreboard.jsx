import { useRecoilValue } from "recoil";
import { scoreState } from "../recoil/scoreAtom";

export default function Scoreboard() {
  const score = useRecoilValue(scoreState);

  return (
    <div className="max-w-lg mx-auto mt-6 p-4 bg-gray-100 shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold">📊 Scoreboard</h2>
      <p className="mt-2">Correct: {score.correctAnswers}</p>
      <p>Incorrect: {score.incorrectAnswers}</p>

      <h3 className="mt-4 font-medium">📝 Past Attempts:</h3>
      {score.pastAttempts && score.pastAttempts.length > 0 ? (
        <ul className="mt-2 text-left">
          {score.pastAttempts.map((attempt, index) => (
            <li key={index} className="border-b py-1">
              {attempt.question} - {attempt.correct ? "✅ Correct" : "❌ Incorrect"}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No past attempts yet.</p> // ✅ Prevents map error
      )}
    </div>
  );
}
