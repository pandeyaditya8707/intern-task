import { atom } from "recoil";

export const scoreState = atom({
  key: "scoreState",
  default: {
    correctAnswers: 0,
    incorrectAnswers: 0,
    currentAttempt: [], // ✅ Stores the current quiz attempt
    pastAttempts: [], // ✅ Ensure this is always an array
  },
});
