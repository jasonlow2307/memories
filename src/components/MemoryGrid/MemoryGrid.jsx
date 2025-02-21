import React, { useState, useEffect } from "react";
import FlipCountdown from "../FlipCountdown";
import { db } from "../../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import { firestore_collection_name } from "../../firebase/firebase";
import "./MemoryGrid.css";
import maximizeIcon from "../../assets/maximize.png";

const MemoryGrid = ({ user }) => {
  const [memories, setMemories] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const memoriesPerPage = 4;
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [maximizedMemory, setMaximizedMemory] = useState(null); // Track which memory is maximized

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);

    const fetchMemories = async () => {
      const querySnapshot = await getDocs(
        collection(db, firestore_collection_name)
      );
      const fetchedMemories = querySnapshot.docs
        .map((doc) => doc.data())
        .filter((doc) => doc.userId === user.uid);
      const sortedMemories = fetchedMemories.sort((a, b) => a.index - b.index);

      const filteredMemories = sortedMemories.filter(
        (document) => !document.special
      );

      setMemories(filteredMemories);
    };

    fetchMemories();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const displayedMemories = memories.slice(
    currentPage * memoriesPerPage,
    (currentPage + 1) * memoriesPerPage
  );

  const handleNextPage = () => {
    if ((currentPage + 1) * memoriesPerPage < memories.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const toggleMaximize = (index) => {
    if (maximizedMemory === index) {
      setMaximizedMemory(null); // Unmaximize if the same card is clicked
    } else {
      setMaximizedMemory(index); // Maximize the clicked card
    }
  };

  return (
    <div className="grid-wrapper">
      {/* Wrap the grid with CSSTransition to animate page change */}
      <div
        className="memory-grid"
        style={{
          gridTemplateColumns: isMobile
            ? "1fr"
            : displayedMemories.length > 2
            ? "repeat(2, 1fr)"
            : "auto",
        }}
      >
        {displayedMemories.map((memory, index) => (
          <div
            className={`memory-card ${
              maximizedMemory === index ? "maximized" : ""
            }`}
            key={index}
            style={{
              backgroundImage: memory.gradient,
              color: memory.text,
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            {/* Maximize button */}
            <button
              className="maximize-button"
              onClick={() => toggleMaximize(index)}
            >
              <img
                src={maximizeIcon}
                style={{
                  width: "30px",
                }}
              />
            </button>
            <h1 className="title">
              {memory.emoji} {memory.description}
            </h1>
            {memory.dateDisplay && (
              <h2 className="date">{memory.dateDisplay}</h2>
            )}
            {memory.date && (
              <FlipCountdown targetDate={memory.date} sizeOption="grid" />
            )}
          </div>
        ))}
      </div>
      {/* Pagination Controls */}
      <div className="pagination-controls">
        {currentPage != 0 && (
          <button
            className="pagination-button"
            onClick={handlePreviousPage}
            disabled={currentPage === 0}
          >
            ← Previous
          </button>
        )}
        {(currentPage + 1) * memoriesPerPage < memories.length && (
          <button
            className="pagination-button"
            onClick={handleNextPage}
            disabled={(currentPage + 1) * memoriesPerPage >= memories.length}
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
};

export default MemoryGrid;
