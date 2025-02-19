import { atom } from "recoil";
import questions from "../utils/questions"; // ✅ Import from questions.js

export const quizState = atom({
  key: "quizState",
  default: {
    questions: questions, // ✅ Load from external file
    currentQuestion: 0,
    isCompleted: false,
  },
});
