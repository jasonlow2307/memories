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

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser(userCredential.user);
      enqueueSnackbar("Registration successful!", { variant: "success" });
    } catch (error) {
      let errorMessage = "Registration failed. Please try again.";

      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "This email is already registered.";
          break;
        case "auth/weak-password":
          errorMessage = "Password should be at least 6 characters.";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address.";
          break;
      }

      setError(errorMessage);
      enqueueSnackbar(errorMessage, { variant: "error" });
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
