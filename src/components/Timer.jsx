import { useEffect, useState } from "react";

export default function Timer({ timeLimit, onTimeUp, currentQuestion }) {
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  useEffect(() => {
    setTimeLeft(timeLimit); // ✅ Reset timer when a new question appears
  }, [currentQuestion]);

  useEffect(() => {
    if (timeLeft === 0) {
      onTimeUp(); // ✅ Move to the next question when time runs out
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, onTimeUp]);

  return <p className="text-red-600 font-bold text-lg">⏳ {timeLeft} seconds left</p>;
}
