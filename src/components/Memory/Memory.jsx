import React, { useState, useEffect } from "react";
import FlipCountdown from "../FlipCountdown";
import PolaroidStack from "../Polaroid/PolaroidStack";
import {
  db,
  firestore_collection_name,
  storage,
} from "../../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import "./Memory.css";
import "../../App.css";

const Memory = ({ setPage, user }) => {
  const [memories, setMemories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0); // Current page index
  const [images, setImages] = useState([]); // Images for the current page
  const [isAnimating, setIsAnimating] = useState(false); // Track if an animation is in progress
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);

    // Fetch memories data from Firestore
    const fetchMemories = async () => {
      const querySnapshot = await getDocs(
        collection(db, firestore_collection_name)
      );
      const fetchedMemories = querySnapshot.docs
        .map((doc) => doc.data())
        .filter((memory) => memory.userId === user.uid); // Filter by user ID

      const sortedMemories = fetchedMemories.sort((a, b) => a.index - b.index);
      setMemories(sortedMemories);
    };

    fetchMemories();

    // Add this cleanup function
    const cleanupImageCache = () => {
      const now = Date.now();
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("images-")) {
          const data = JSON.parse(localStorage.getItem(key));
          if (now - data.timestamp > 24 * 60 * 60 * 1000) {
            localStorage.removeItem(key);
          }
        }
      });
    };

    cleanupImageCache();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Shuffle function for randomizing images
  const shuffle = (array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  };

  // Helper function to load images for a folder index from Firebase Storage
  const loadImages = async (folderIndex) => {
    console.log("FOLDER INDEX", folderIndex);

    // Check if we have cached images for this folder
    const cachedData = localStorage.getItem(`images-${folderIndex}`);
    if (cachedData) {
      const { urls, timestamp } = JSON.parse(cachedData);
      // Check if cache is less than 3 minutes old
      if (Date.now() - timestamp < 3 * 60 * 1000) {
        console.log(
          "🎯 Cache hit! Using cached images for folder",
          folderIndex
        );
        console.log(
          "Cache age:",
          Math.round((Date.now() - timestamp) / (1000 * 60)),
          "minutes"
        );
        console.log("Using cached images for folder", folderIndex);
        return shuffle(urls);
      } else {
        console.log("🔄 Cache expired for folder", folderIndex);
      }
    } else {
      console.log("❌ No cache found for folder", folderIndex);
    }

    // If no cache or cache expired, load from Firebase
    let folderRef;
    if (user.uid === "default") {
      folderRef = ref(storage, `${folderIndex}`);
    } else {
      folderRef = ref(storage, `${user.uid}/${folderIndex}`);
    }
    console.log("FOLDER", folderRef);

    try {
      const res = await listAll(folderRef);
      console.log("ITEMS", res);

      const imageUrls = await Promise.all(
        res.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          console.log(url);
          return url;
        })
      );

      // Cache the results with timestamp
      const cacheData = {
        urls: imageUrls,
        timestamp: Date.now(),
      };
      localStorage.setItem(`images-${folderIndex}`, JSON.stringify(cacheData));

      return shuffle(imageUrls);
    } catch (error) {
      console.error("Error loading images:", error);
      return [];
    }
  };

  useEffect(() => {
    if (memories.length > 0 && !memories[currentIndex]?.special) {
      loadImages(currentIndex).then((loadedImages) => {
        setImages(loadedImages); // Set images with the Firebase URLs
      });
    } else {
      setImages([]); // Clear images for pages without images
    }
  }, [currentIndex, memories]);

  // Modify the handleNext function
  const handleNext = () => {
    if (currentIndex < memories.length - 1 && !isAnimating) {
      setIsAnimating(true); // Start animation
      setImages([]); // Clear images immediately
      setTimeout(() => {
        localStorage.setItem("index", currentIndex + 1);
        setCurrentIndex(currentIndex + 1);
        setIsAnimating(false); // End animation
      }, 500); // Animation duration
    }
  };

  // Modify the handlePrevious function
  const handlePrevious = () => {
    if (currentIndex > 0 && !isAnimating) {
      setIsAnimating(true); // Start animation
      setImages([]); // Clear images immediately
      setTimeout(() => {
        localStorage.setItem("index", currentIndex - 1);
        setCurrentIndex(currentIndex - 1);
        setIsAnimating(false); // End animation
      }, 500); // Animation duration
    }
  };

  // Check if memory exists before rendering
  const currentMemory = memories[currentIndex];

  return (
    <div className="hero-wrapper">
      {currentMemory && (
        <div
          className={`hero-section ${isAnimating ? "fade-out" : "fade-in"}`}
          style={{
            backgroundImage: currentMemory.gradient,
            color: currentMemory.text,
            fontFamily: "'Poppins', sans-serif",
            justifyContent: currentMemory.special ? "center" : "flex-start",
          }}
        >
          <h1
            className="title"
            style={{
              fontSize: currentMemory.special
                ? "auto"
                : isMobile
                ? "1.3rem"
                : "1.5rem",
            }}
          >
            {currentMemory.emoji} {currentMemory.description}
          </h1>
          {currentMemory.dateDisplay && (
            <h2
              className="date"
              style={{ fontSize: isMobile ? "0.8rem" : "1.15rem" }}
            >
              🕛 {currentMemory.dateDisplay || ""}
            </h2>
          )}
          {/* Show countdown and images only for index >= 3 */}
          {currentMemory.dateDisplay && (
            <FlipCountdown
              targetDate={currentMemory.date}
              sizeOption="default" // Pass the isMobile state
            />
          )}
          {currentMemory.dateDisplay && <PolaroidStack images={images} />}

          <div
            className="button-container"
            style={{
              marginTop: currentMemory.special
                ? "20px"
                : isMobile
                ? "80px"
                : "150px",
              zIndex: "1000",
            }}
          >
            {currentIndex > 0 && (
              <button onClick={handlePrevious} className="nav-button">
                ←
              </button>
            )}
            {currentIndex < memories.length - 1 && (
              <button onClick={handleNext} className="nav-button">
                →
              </button>
            )}
          </div>
        </div>
      )}
      {!currentMemory && (
        <div
          className={`hero-section ${isAnimating ? "fade-out" : "fade-in"}`}
          style={{
            backgroundImage: "linear-gradient(to right, #FFD700, #FFA500)",
            color: "#fff",
            fontFamily: "'Poppins', sans-serif",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <h1 style={{ marginBottom: 50, textAlign: "center" }}>
            No memories yet...
          </h1>
          <button onClick={() => setPage("form")} style={{ width: 300 }}>
            Add one now!
          </button>
        </div>
      )}
    </div>
  );
};

export default Memory;
