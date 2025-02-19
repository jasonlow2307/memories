import React from "react";
import { Box, Typography } from "@mui/material";

const Header = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#A294F9", // Purple from the palette
        padding: "1rem",
        textAlign: "center",
        color: "#F5EFFF", // Light color for contrast
      }}
    >
      <Typography
        variant="h1"
        sx={{
          margin: 0,
          fontSize: "2rem", // Custom font size
          fontWeight: "bold", // Emphasized header text
          fontFamily: "'Poppins', sans-serif", // Modern font style
          my: "1rem",
        }}
      >
        My Event Countdown
      </Typography>
    </Box>
  );
};

export default Header;
