import { useRecoilValue } from "recoil";
import { scoreState } from "../recoil/scoreAtom";

export default function Scoreboard() {
  const score = useRecoilValue(scoreState);

  return (
    <div className="max-w-lg mx-auto mt-6 p-4 bg-gray-100 shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold">📊 Scoreboard</h2>
      <p className="mt-2 font-medium text-green-600">✅ Correct: {score.correctAnswers}</p>
      <p className="font-medium text-red-600">❌ Incorrect: {score.incorrectAnswers}</p>

      <h3 className="mt-4 font-medium">📝 Past Attempts:</h3>

      {score.currentAttempt && score.currentAttempt.length > 0 ? (
        <ul className="mt-2 text-left">
          {score.currentAttempt.map((attempt, index) => (
            <li key={index} className="border-b py-1">
              <span className="font-semibold">{attempt.question}:</span>
              <span className={attempt.correct ? "text-green-600" : "text-red-600"}>
                {attempt.correct ? " ✅ Correct" : " ❌ Incorrect"}
              </span>
              <p className="text-sm text-gray-500">
                Your Answer: {attempt.selectedOption}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 mt-2 italic">No attempts yet.</p>
      )}
    </div>
  );
}
