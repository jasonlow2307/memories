import { useEffect, useState } from "react";
import Memory from "./components/Memory/Memory";
import { Box } from "@mui/material";
import "./App.css";
import MemoryForm from "./components/MemoryForm/MemoryForm";
import Nav from "./components/Nav/Nav";
import { SnackbarProvider } from "notistack";
import MemoryGrid from "./components/MemoryGrid/MemoryGrid";
import React from "react";

const App = () => {
  const [page, setPage] = useState("form");

  useEffect(() => {
    const storedPage = localStorage.getItem("page");
    if (storedPage) {
      setPage(storedPage);
    }
  }, []);

  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={2500}>
      <Nav setPage={setPage} page={page} />
      <Box>
        {page === "memories" ? (
          <Memory setPage={setPage} />
        ) : page === "form" ? (
          <MemoryForm />
        ) : page === "memory-grid" ? (
          <MemoryGrid />
        ) : null}
        ;{/* <MemoryForm/> */}
      </Box>
    </SnackbarProvider>
  );
};

export default App;
