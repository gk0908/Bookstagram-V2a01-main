import React, { useState } from "react";
import { auth } from "../../components/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Check your inbox.");
    } catch (err) {
      setError(err.message);
    }
  };
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/");
  };

  return (
    <>
      <nav className="bg-[#16213e] text-white shadow-lg">
        <div className="container mx-auto px-4 py-2.5 flex items-center">
          <button onClick={handleBackClick} className="p-2 rounded-full ">
            <HiArrowLeft className="text-2xl" />
          </button>
          <h1 className="text-2xl font-bold ml-4 md:text-center md:mx-auto">
            Reset Password
          </h1>
        </div>
      </nav>
      <div className="max-w-sm mx-auto p-4 shadow-lg rounded-lg bg-white mt-10">
        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-2 border border-gray-300 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Send Reset Link
          </button>
        </form>
        {message && (
          <p className="text-green-600 mt-4 text-center">{message}</p>
        )}
        {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
      </div>
    </>
  );
};

export default ResetPassword;
