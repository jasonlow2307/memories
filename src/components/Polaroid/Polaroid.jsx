import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./Polaroid.css";

const Polaroid = ({ imgSrc, caption = "", onDismiss, angle = 0, resetKey }) => {
  const dragPosition = useRef({ x: 0, y: 0 }); // Ref to store drag position
  const elementRef = useRef(null); // Ref for the draggable element
  const [dragging, setDragging] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const [isMobile, setIsMobile] = useState(
    window.matchMedia("(max-width: 1024px)").matches
  );

  // Reset position when the resetKey changes
  useEffect(() => {
    if (elementRef.current) {
      dragPosition.current = { x: 0, y: 0 };
      elementRef.current.style.transform = `translate(0px, 0px) rotate(${angle}deg)`;
    }
  }, [resetKey, angle]);

  const handlePointerDown = (e) => {
    if (isMobile) return; // Prevent desktop event if mobile
    setDragging(true);
    e.target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!dragging || isMobile) return; // Ignore if mobile

    dragPosition.current.x += e.movementX;
    dragPosition.current.y += e.movementY;

    if (elementRef.current) {
      elementRef.current.style.transform = `translate(${dragPosition.current.x}px, ${dragPosition.current.y}px) rotate(${angle}deg)`;
    }
  };

  const handlePointerUp = () => {
    if (isMobile) return; // Prevent desktop event if mobile
    setDragging(false);
    checkDismiss();
  };

  // Touch events for mobile
  const handleTouchStart = (e) => {
    setDragging(true);
    dragPosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchMove = (e) => {
    if (!dragging) return;

    const deltaX = e.touches[0].clientX - dragPosition.current.x;
    const deltaY = e.touches[0].clientY - dragPosition.current.y;

    if (elementRef.current) {
      elementRef.current.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(${angle}deg)`;
    }
  };

  const handleTouchEnd = () => {
    setDragging(false);
    checkDismiss();
  };

  // Function to check if the image should be dismissed
  const checkDismiss = () => {
    if (
      Math.abs(dragPosition.current.x) > 125 ||
      Math.abs(dragPosition.current.y) > 100
    ) {
      onDismiss(); // Dismiss if dragged far enough
    } else if (elementRef.current) {
      // Reset position if not dismissed
      dragPosition.current = { x: 0, y: 0 };
      elementRef.current.style.transform = `translate(0px, 0px) rotate(${angle}deg)`;
    }
  };

  return (
    <div
      ref={elementRef} // Reference to the draggable element
      className="polaroid-container"
      style={{
        transform: `rotate(${angle}deg)`,
        transition: dragging ? "none" : "transform 0.3s ease",
      }}
    >
      <div
        className="drag-overlay"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      ></div>

      <div
        className="polaroid"
        style={{
          width: isLandscape ? (isMobile ? "300px" : "350px") : "auto",
          height: isMobile ? (isLandscape ? "270px" : "350px") : "auto", // Adjust height for mobile
        }}
      >
        <img
          src={imgSrc}
          alt={caption}
          className="polaroid-image"
          onLoad={(e) => {
            const { naturalWidth, naturalHeight } = e.target;
            setIsLandscape(naturalWidth > naturalHeight);
          }}
          style={{
            height: isMobile ? (isLandscape ? "200px" : "270px") : "auto",
          }}
        />
        <div className="polaroid-caption">{caption}</div>
      </div>
    </div>
  );
};

Polaroid.propTypes = {
  imgSrc: PropTypes.string.isRequired,
  caption: PropTypes.string,
  onDismiss: PropTypes.func,
  angle: PropTypes.number,
  resetKey: PropTypes.any,
};

export default Polaroid;
