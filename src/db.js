import { openDB } from "idb";

const DB_NAME = "quizDB";
const STORE_NAME = "attempts";
const DB_VERSION = 1;

// ✅ Initialize Database (Only Once)
export async function initDB() {
  console.log("🚀 Initializing IndexedDB...");

  try {
    const db = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
          console.log("✅ Object store 'attempts' created!");
        }
      },
    });

    console.log("✅ IndexedDB initialized successfully!");
    return db;
  } catch (error) {
    console.error("❌ IndexedDB Initialization Failed:", error);
  }
}

// ✅ Save Quiz Attempt in IndexedDB
export async function saveAttempt(attempt) {
  try {
    console.log("📥 Saving quiz attempt:", attempt);
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    await store.add({ timestamp: Date.now(), attempt });
    await tx.done; // ✅ Ensure transaction completes
    console.log("✅ Quiz attempt saved successfully!");
  } catch (error) {
    console.error("❌ Error saving quiz attempt:", error);
  }
}

// ✅ Get Last Attempt from IndexedDB
export async function getLastAttempt() {
  try {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const allAttempts = await store.getAll();

    if (allAttempts.length === 0) {
      console.log("ℹ️ No past attempts found in IndexedDB.");
      return null; // ✅ Return null if no data
    }

    console.log("📂 Retrieved last attempt:", allAttempts[allAttempts.length - 1]);
    return allAttempts[allAttempts.length - 1].attempt;
  } catch (error) {
    console.error("❌ Error retrieving attempts:", error);
  }
}
