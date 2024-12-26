// SignupForm.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"
const SignupForm = () => {
  const [formData, setFormData] = useState({
    Username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { Username, email, password } = formData;

    // Simple validation
    if (!Username || !email || !password) {
      setErrors("All fields are required.");
      setSuccessMessage("");
      return;
    }

    if (password.length < 6) {
      setErrors("Password must be at least 6 characters long.");
      setSuccessMessage("");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/User", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Username, email, password }),
      });

      if (!response.ok) {
        throw new Error("Failed to sign up. Please try again later.");
      }

      const data = await response.json();
      setErrors("");
      setSuccessMessage(data.message || "Sign up successful!");

      
    } catch (error) {
      setErrors(error.message);
      setSuccessMessage("");
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="Username"
            value={formData.Username}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
        </div>
        {errors && <p style={{ color: "red" }}>{errors}</p>}
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
        <button type="submit">Sign Up</button>
      </form>
      <br />
            <p>OR</p>
            <br />

            <Link to="/">Login Page</Link>
    </div>
  );
};

export default SignupForm;