import React, { useEffect, useRef, useState } from "react";
import Tick from "@pqina/flip";
import "@pqina/flip/dist/flip.min.css";
import { Box } from "@mui/material";

const FlipCountdown = ({ targetDate, sizeOption }) => {
  const flipRef = useRef(null);
  const tickInstance = useRef(null); // Store Tick instance
  const [timeRemaining, setTimeRemaining] = useState(null); // Store time remaining state
  const targetTimestamp = new Date(
    targetDate || "2025-01-08T23:30:00"
  ).getTime();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
  }, []);

  const calculateTimeRemaining = () => {
    const now = new Date().getTime();
    const elapsed = now - targetTimestamp;

    // Calculate days, hours, minutes, and seconds
    const days = Math.max(Math.floor(elapsed / (1000 * 60 * 60 * 24)), 0);
    const hours = Math.max(
      Math.floor((elapsed % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      0
    );
    const minutes = Math.max(
      Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60)),
      0
    );
    const seconds = Math.max(Math.floor((elapsed % (1000 * 60)) / 1000), 0);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  useEffect(() => {
    if (!flipRef.current) return;

    // Initialize Tick instance if it doesn't exist
    if (!tickInstance.current) {
      try {
        tickInstance.current = Tick.DOM.create(flipRef.current);
      } catch (error) {
        console.error("Failed to initialize Tick:", error);
        return;
      }
    }

    const updateCountdown = () => {
      const remaining = calculateTimeRemaining();
      setTimeRemaining(remaining);
    };

    // Update countdown immediately on mount
    updateCountdown();

    // Setup a throttled interval to update the countdown every second
    const intervalId = setInterval(updateCountdown, 1000);

    // Cleanup function to clear the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, [targetDate]); // Only re-run effect if `targetDate` changes

  // Update Tick instance with the current time remaining
  useEffect(() => {
    if (tickInstance.current && timeRemaining !== null) {
      tickInstance.current.value = timeRemaining;
    }
  }, [timeRemaining]);

  const scales = {
    grid: 0.7,
    default: 1.2,
  };

  return (
    <Box
      ref={flipRef}
      sx={{
        "--scale": scales[sizeOption] || scales.default,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "1.75rem", // Smaller font for mobile
        transform: isMobile ? "scale(0.55)" : "scale(var(--scale))",
        width: "1000px",
        height: "auto",
        textAlign: "center",
        padding: isMobile ? "0.5rem" : "1rem", // Adjust padding for mobile
        borderRadius: "16px", // Rounded corners
      }}
    >
      <Box data-repeat="true" aria-hidden="true">
        <span data-view="flip"></span>
      </Box>
    </Box>
  );
};

export default FlipCountdown;
