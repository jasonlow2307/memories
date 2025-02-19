import React, { useState, useEffect } from "react";
import Polaroid from "./Polaroid";
import PropTypes from "prop-types";

const PolaroidStack = ({ images, captions = [] }) => {
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [angles, setAngles] = useState([]);
  const [resetKey, setResetKey] = useState(0); // Key to reset Polaroid positions

  useEffect(() => {
    // Generate random angles between -15 and 15 ensuring no angles are closer than 3 degrees
    const generateAngles = () => {
      const newAngles = [];
      images.forEach(() => {
        let angle;
        do {
          angle = Math.random() * 30 - 15; // Generate a random angle between -15 and 15
        } while (newAngles.some((a) => Math.abs(a - angle) < 3)); // Check if it's within 3 degrees of any existing angle
        newAngles.push(angle);
      });
      return newAngles;
    };

    setAngles(generateAngles());
  }, [images]);

  const handleDismiss = () => {
    if (visibleIndex < images.length - 1) {
      setVisibleIndex((prev) => prev + 1);
    } else {
      // Reset the stack after all polaroids are dismissed
      setVisibleIndex(0);
      setResetKey((prev) => prev + 1); // Increment resetKey to trigger position reset
    }
  };

  return (
    <div
      style={{
        position: "relative",
        width: "250px",
        height: "350px",
        marginTop: "40px",
      }}
    >
      {images.map((img, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: images.length - index,
            transition: "opacity 0.3s ease",
            opacity: index >= visibleIndex ? 1 : 0,
            pointerEvents: index === visibleIndex ? "auto" : "none",
          }}
        >
          <Polaroid
            imgSrc={img}
            caption={captions[index]}
            onDismiss={handleDismiss}
            angle={angles[index] || 0}
            resetKey={resetKey} // Pass the resetKey
          />
        </div>
      ))}
    </div>
  );
};

PolaroidStack.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  captions: PropTypes.arrayOf(PropTypes.string),
};

export default PolaroidStack;
