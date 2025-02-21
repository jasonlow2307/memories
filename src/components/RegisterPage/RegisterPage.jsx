import React, { useState } from "react";
import "./RegisterPage.css";
import { useSnackbar } from "notistack";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebase";

const RegisterPage = ({ setUser, switchToLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    console.log("📝 Starting registration process");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      enqueueSnackbar("Passwords do not match", { variant: "error" });
      return;
    }

    if (password.length < 6) {
      setError("Password should be at least 6 characters");
      enqueueSnackbar("Password should be at least 6 characters", {
        variant: "error",
      });
      return;
    }

    try {
      console.log("🔐 Creating account with:", { email });
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("✅ Registration successful:", userCredential.user);

      setUser(userCredential.user);
      localStorage.setItem("user", JSON.stringify(userCredential.user.email));
      switchToLogin();

      enqueueSnackbar("Registration successful!", {
        variant: "success",
        autoHideDuration: 2000,
      });
    } catch (error) {
      console.error("❌ Registration error:", error.code, error.message);

      let errorMessage = "Registration failed";
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "This email is already registered";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address";
          break;
        case "auth/weak-password":
          errorMessage = "Password is too weak";
          break;
        default:
          errorMessage = error.message;
      }

      setError(errorMessage);
      enqueueSnackbar(errorMessage, {
        variant: "error",
        autoHideDuration: 3000,
      });
    }
  };

  return (
    <div className="login-form-container">
      <div className="form-section">
        <h1 className="login-form-title">Create Account</h1>
        <form onSubmit={handleSubmit} className="loginForm">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            required
          />
          <input
            type="password"
            placeholder="Create password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            required
          />
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input-field"
            required
          />
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button">
            Register
          </button>
          <p className="switch-auth">
            Already have an account?{" "}
            <span onClick={switchToLogin} className="switch-link">
              Login here
            </span>
          </p>
        </form>
      </div>
      <div className="background-section">
        <div className="content-overlay">
          <h2 className="background-title">Join Memories 📸</h2>
          <p className="background-text">
            Create an account to start saving your memories
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
