import { useEffect, useState } from "react";

export default function Timer({ timeLimit, onTimeUp, currentQuestion }) {
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  // Reset timer when question changes
  useEffect(() => {
    setTimeLeft(timeLimit);
  }, [timeLimit, currentQuestion]);

  // Handle countdown and time-up
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          onTimeUp(); // Trigger the next question
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Cleanup timer
    return () => clearInterval(timer);
  }, [currentQuestion, onTimeUp]);

  return (
    <p className="text-red-600 font-bold text-lg">
      ⏳ {timeLeft} seconds left
    </p>
  );
}
