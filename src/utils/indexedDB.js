export function saveAttempt(question, correct) {
    const dbRequest = indexedDB.open("quizDB", 1);
  
    dbRequest.onupgradeneeded = (event) => {
      let db = event.target.result;
      if (!db.objectStoreNames.contains("attempts")) {
        db.createObjectStore("attempts", { keyPath: "id", autoIncrement: true });
      }
    };
  
    dbRequest.onsuccess = () => {
      let db = dbRequest.result;
      let tx = db.transaction("attempts", "readwrite");
      let store = tx.objectStore("attempts");
      store.add({ question, correct, timestamp: Date.now() });
    };
  }
  