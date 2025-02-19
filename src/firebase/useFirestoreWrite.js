import { useState } from "react";
import { db } from "./firebase"; // Make sure to import your firebase config
import { collection, addDoc, setDoc, doc } from "firebase/firestore";

const useFirestoreWrite = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const writeData = async (collectionName, data, docId = null) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (docId) {
        // If docId is provided, update or set the document
        await setDoc(doc(db, collectionName, docId), data);
      } else {
        // If no docId, create a new document
        await addDoc(collection(db, collectionName), data);
      }
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { writeData, loading, error, success };
};

export default useFirestoreWrite;
