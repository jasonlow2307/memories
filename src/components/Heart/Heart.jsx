import React, { useState } from "react";
import "./Heart.css";

// Import the SVGs as components (if using inline SVG or as an image)
import HeartIcon from "../../assets/heart.svg"; // Main heart icon
import SmallHeartIcon from "../../assets/small-hearts.svg"; // Small heart icon
import useFirestoreWrite from "../../firebase/useFirestoreWrite";

const Heart = ({ user }) => {
  const [hearts, setHearts] = useState([]);
  const { writeData } = useFirestoreWrite();

  const generateHearts = async (e) => {
    const data = {
      user,
      time: new Date(),
    };
    await writeData("hearts", data); // TODO add username

    // Get the position of the button
    const buttonRect = e.target.getBoundingClientRect();
    const buttonX = buttonRect.left + buttonRect.width / 2;
    const buttonY = buttonRect.top + buttonRect.height / 2;

    // Generate a number of smaller hearts to animate
    const newHearts = Array.from({ length: 20 }).map((_, index) => ({
      id: Date.now() + index,
      left: buttonX + Math.random() * 100 - 75, // Random spread around the button
      top: buttonY + Math.random() * 100 - 50,
      size: Math.random() * 20 + 10, // Random size for each small heart
      animationDuration: Math.random() * 1 + 1 + "s", // Random duration
    }));

    setHearts((prev) => [...prev, ...newHearts]);

    // Remove hearts after animation
    setTimeout(() => {
      setHearts([]);
    }, 2000);
  };

  return (
    <div>
      {/* Main heart button */}
      <div className="heart-container" onClick={generateHearts}>
        <img src={HeartIcon} className="heart-icon" />
      </div>

      {/* Render smaller hearts when clicked */}
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="small-heart"
          style={{
            left: `${heart.left}px`,
            top: `${heart.top}px`,
            width: `${heart.size}px`,
            height: `${heart.size}px`,
            animationDuration: heart.animationDuration,
          }}
        >
          <img src={SmallHeartIcon} className="small-heart-icon" />
        </div>
      ))}
    </div>
  );
};

export default Heart;
