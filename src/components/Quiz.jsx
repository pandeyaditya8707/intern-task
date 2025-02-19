import { useRecoilState } from "recoil";
import { quizState } from "../recoil/quizAtom";
import { scoreState } from "../recoil/scoreAtom";
import Timer from "./Timer";
import { motion } from "framer-motion";
import { saveAttempt, getLastAttempt } from "../db";
import { useEffect } from "react";

export default function Quiz() {
  const [quiz, setQuiz] = useRecoilState(quizState);
  const [score, setScore] = useRecoilState(scoreState);

  // Load last attempt from IndexedDB on mount
  useEffect(() => {
    async function fetchLastAttempt() {
      const lastAttempt = await getLastAttempt();
      if (lastAttempt) {
        setScore((prev) => ({ ...prev, pastAttempts: [...prev.pastAttempts, lastAttempt] }));
      }
    }
    fetchLastAttempt();
  }, []);

  if (!quiz.questions.length) {
    return (
      <motion.h2
        className="text-center text-xl text-red-600"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        ⚠️ No Questions Found!
      </motion.h2>
    );
  }

  const currentQuestion = quiz.questions[quiz.currentQuestion];

  const handleOptionClick = async (selectedOption) => {
    const isCorrect = selectedOption === currentQuestion.correct;

    // Update score immediately with the correct result
    setScore((prev) => ({
      ...prev,
      correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
      incorrectAnswers: !isCorrect ? prev.incorrectAnswers + 1 : prev.incorrectAnswers,
      currentAttempt: [...prev.currentAttempt, { 
        question: currentQuestion.text, 
        selectedOption, 
        correct: isCorrect 
      }],
    }));

    moveToNextQuestion();
  };

  const moveToNextQuestion = () => {
    // For timer expiration case
    if (arguments.length === 0) {
      setScore((prev) => ({
        ...prev,
        incorrectAnswers: prev.incorrectAnswers + 1,
        currentAttempt: [...prev.currentAttempt, { 
          question: currentQuestion.text, 
          selectedOption: "No answer", 
          correct: false 
        }],
      }));
    }

    setQuiz((prev) => {
      const nextQuestion = prev.currentQuestion + 1;
      
      if (nextQuestion >= prev.questions.length) {
        return {
          ...prev,
          isCompleted: true
        };
      }
      
      return {
        ...prev,
        currentQuestion: nextQuestion,
        isCompleted: false
      };
    });
  };

  const restartQuiz = async () => {
    try {
      // Save the latest attempt before resetting
      await saveAttempt(score.currentAttempt);
      console.log("✅ Attempt saved successfully");

      setScore((prev) => ({
        correctAnswers: 0,
        incorrectAnswers: 0,
        pastAttempts: [...prev.pastAttempts, prev.currentAttempt],
        currentAttempt: [],
      }));

      setQuiz({ questions: quiz.questions, currentQuestion: 0, isCompleted: false });
    } catch (error) {
      console.error("Error saving attempt:", error);
    }
  };

  return (
    <motion.div
      className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg text-center relative"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Restart Quiz Button */}
      <motion.button
        className="absolute top-4 right-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={restartQuiz}
      >
        Restart Quiz 🔄
      </motion.button>

      {quiz.isCompleted ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <h2 className="text-2xl font-bold text-green-600">Quiz Completed! 🎉</h2>
          <p className="mt-2">Correct Answers: {score.correctAnswers}</p>
          <p>Incorrect Answers: {score.incorrectAnswers}</p>
          <h3 className="mt-4 font-semibold">📝 Summary of Current Quiz Attempt:</h3>
          <ul className="text-left">
            {score.currentAttempt.map((attempt, index) => (
              <motion.li
                key={index}
                className="border-b py-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {attempt.question} - {attempt.correct ? "✅ Correct" : "❌ Incorrect"}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      ) : (
        <>
          {/* Animated Timer */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Timer timeLimit={30} onTimeUp={moveToNextQuestion} currentQuestion={quiz.currentQuestion} />
          </motion.div>

          {/* Animated Question */}
          <motion.h2
            className="text-xl font-bold mt-4"
            key={currentQuestion.text}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {currentQuestion.text}
          </motion.h2>

          {/* Animated Options */}
          <motion.div className="mt-4 flex flex-col gap-2">
            {currentQuestion.options.map((option, index) => (
              <motion.button
                key={index}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </motion.button>
            ))}
          </motion.div>
        </>
      )}
    </motion.div>
  );
}