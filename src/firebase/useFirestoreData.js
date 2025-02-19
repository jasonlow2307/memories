import { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import firebase_collection_name from "./firebase";

const useFirestoreData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextIndex, setNextIndex] = useState(null); // State to store next index

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch documents from Firestore collection
        const querySnapshot = await getDocs(
          collection(db, firebase_collection_name)
        );
        const fetchedData = [];
        let maxIndex = 0;

        querySnapshot.forEach((doc) => {
          const docData = doc.data();
          fetchedData.push({ id: doc.id, ...docData });
        });

        // Calculate next index as max index + 1 for non-special memories
        setNextIndex(fetchedData.length);

        setData(fetchedData);
      } catch (error) {
        console.error("Error fetching data from Firestore: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Only run this once when the component mounts

  return { data, loading, nextIndex };
};

export default useFirestoreData;
