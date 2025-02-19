import { useRecoilState } from "recoil";
import { quizState } from "../recoil/quizAtom";
import { scoreState } from "../recoil/scoreAtom";
import Timer from "./Timer";
import { motion } from "framer-motion";
import { openDB } from "idb";
import { useEffect } from "react";

// Function to initialize IndexedDB
async function initDB() {
  return openDB("QuizDB", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("attempts")) {
        db.createObjectStore("attempts", { keyPath: "id", autoIncrement: true });
      }
    },
  });
}

// Function to save quiz attempt to IndexedDB
async function saveAttempt(attempt) {
  const db = await initDB();
  const tx = db.transaction("attempts", "readwrite");
  const store = tx.objectStore("attempts");
  await store.add({ timestamp: Date.now(), attempt });
}

// Function to get last attempt from IndexedDB
async function getLastAttempt() {
  const db = await initDB();
  const tx = db.transaction("attempts", "readonly");
  const store = tx.objectStore("attempts");
  const allAttempts = await store.getAll();
  return allAttempts.length ? allAttempts[allAttempts.length - 1].attempt : null;
}

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

    setScore((prev) => ({
      ...prev,
      correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
      incorrectAnswers: isCorrect ? prev.incorrectAnswers : prev.incorrectAnswers + 1,
      currentAttempt: [...prev.currentAttempt, { question: currentQuestion.text, selectedOption, correct: isCorrect }],
    }));

    moveToNextQuestion();
  };

  const moveToNextQuestion = () => {
    setQuiz((prev) => {
      if (prev.currentQuestion + 1 < prev.questions.length) {
        return { ...prev, currentQuestion: prev.currentQuestion + 1 };
      } else {
        return { ...prev, isCompleted: true };
      }
    });
  };

  const restartQuiz = async () => {
    // Save the latest attempt before resetting
    await saveAttempt(score.currentAttempt);

    setScore((prev) => ({
      correctAnswers: 0,
      incorrectAnswers: 0,
      pastAttempts: [...prev.pastAttempts, prev.currentAttempt],
      currentAttempt: [],
    }));

    setQuiz({ questions: quiz.questions, currentQuestion: 0, isCompleted: false });
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