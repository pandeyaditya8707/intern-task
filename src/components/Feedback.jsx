export default function Feedback({ isCorrect }) {
    return (
      <p className={`mt-3 text-lg font-bold ${isCorrect ? "text-green-500" : "text-red-500"}`}>
        {isCorrect ? "✅ Correct!" : "❌ Wrong Answer!"}
      </p>
    );
  }
  