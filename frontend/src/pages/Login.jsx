import React, { useState } from "react";
import { loginUser } from "../services/api";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const response = await loginUser(formData);
    if (response.error) {
      setMessage(`Error: ${response.error}`);
    } else {
      setMessage("Login Successful! Redirecting...");
      setTimeout(() => (window.location.href = "/dashboard"), 2000);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-center text-blue-900">Login</h2>
      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="border p-2 w-full rounded-md"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border p-2 w-full rounded-md"
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        >
          Log In
        </button>
      </form>
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}
