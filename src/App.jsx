import { useEffect, useState } from "react";
import Memory from "./components/Memory/Memory";
import { Box } from "@mui/material";
import "./App.css";
import MemoryForm from "./components/MemoryForm/MemoryForm";
import Nav from "./components/Nav/Nav";
import { SnackbarProvider } from "notistack";
import MemoryGrid from "./components/MemoryGrid/MemoryGrid";
import React from "react";
import LoginPage from "./components/LoginPage/LoginPage";
import { auth } from "./firebase/firebase";
import RegisterPage from "./components/RegisterPage/RegisterPage";

const App = () => {
  const [page, setPage] = useState("form");
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    const storedPage = localStorage.getItem("page");
    if (storedPage) {
      setPage(storedPage);
    }

    return () => unsubscribe();
  }, []);

  if (!user) {
    return isLogin ? (
      <LoginPage
        setUser={setUser}
        setPage={setPage}
        switchToRegister={() => setIsLogin(false)}
      />
    ) : (
      <RegisterPage setUser={setUser} switchToLogin={() => setIsLogin(true)} />
    );
  }
  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={2500}>
      <Nav setPage={setPage} page={page} user={user} />
      <Box>
        {page === "memories" ? (
          <Memory setPage={setPage} user={user} />
        ) : page === "form" ? (
          <MemoryForm user={user} setPage={setPage} />
        ) : page === "login" ? (
          <LoginPage
            setPage={setPage}
            setUser={setUser}
            switchToRegister={() => setIsLogin(false)}
          />
        ) : page === "memory-grid" ? (
          <MemoryGrid user={user} setPage={setPage} />
        ) : null}
        ;
      </Box>
    </SnackbarProvider>
  );
};

export default App;
