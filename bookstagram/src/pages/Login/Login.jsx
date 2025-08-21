import React, { useState, useCallback, memo } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaEye,
  FaEyeSlash,
  FaExclamationCircle,
  FaBook,
} from "react-icons/fa";
import { BeatLoader } from "react-spinners";
import bookmark from "../../assets/bookmark.gif";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../../components/firebase";
import { setDoc, doc } from "firebase/firestore";
import toast from "react-hot-toast";
import SignInWithGoogle from "./signInwithGoogle";

const Login = memo(({ setIsAuthenticated }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const isValidEmail = useCallback(
    (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    []
  );

  const isStrongPassword = useCallback((password) => password.length >= 8, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleFormSwitch = useCallback((login) => {
    setIsLogin(login);
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
    });
    setError("");
    setSuccessMessage("");
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const toggleConfirmPasswordVisibility = useCallback(() => {
    setShowConfirmPassword((prev) => !prev);
  }, []);

  const handleLogin = useCallback(
    async (e) => {
      e.preventDefault();
      setError("");
      setSuccessMessage("");

      if (!isValidEmail(formData.email)) {
        setError("Please enter a valid email address");
        return;
      }

      if (!formData.password) {
        setError("Please enter your password");
        return;
      }

      setIsLoading(true);

      try {
        await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        toast.success("Login successful!", { position: "top-center" });
        setIsAuthenticated(true);
        navigate("/home");
      } catch (err) {
        setError("Invalid credentials. Please try again.");
        toast.error("Invalid credentials. Please try again.", {
          position: "top-center",
        });
        console.error("Login error:", err.message);
      } finally {
        setIsLoading(false);
      }
    },
    [formData, isValidEmail, navigate, setIsAuthenticated]
  );

  const handleSignup = useCallback(
    async (e) => {
      e.preventDefault();
      setError("");
      setSuccessMessage("");

      if (!formData.fullName.trim()) {
        setError("Please enter your full name");
        return;
      }

      if (!isValidEmail(formData.email)) {
        setError("Please enter a valid email address");
        return;
      }

      if (!isStrongPassword(formData.password)) {
        setError("Password must be at least 8 characters long");
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      setIsLoading(true);

      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
          fullName: formData.fullName,
          email: formData.email,
          photoURL: user.photoURL || "",
        });

        toast.success("Account created successfully! Please login.", {
          position: "top-center",
        });

        setSuccessMessage("Account created successfully! Please login.");
        handleFormSwitch(true);
      } catch (err) {
        setError("Registration failed. Please try again.");
        toast.error("Registration failed. Please try again.", {
          position: "top-center",
        });
        console.error("Registration error:", err.message);
      } finally {
        setIsLoading(false);
      }
    },
    [formData, isValidEmail, isStrongPassword, handleFormSwitch]
  );

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900 p-0 sm:p-4">
      <div className="w-full h-screen sm:h-auto sm:max-w-md sm:rounded-xl sm:p-8 p-6 bg-white shadow-none sm:shadow-2xl flex flex-col justify-center">
        <div className="flex flex-col items-center mb-6">
          {isLogin ? (
            <img
              src={bookmark}
              alt="Books"
              className="w-40 h-40 sm:w-40 sm:h-40 object-contain"
              loading="lazy"
            />
          ) : (
            <div className="flex items-center gap-2">
              <FaBook className="text-3xl sm:text-4xl text-orange-500" />
              <h1 className="text-2xl sm:text-3xl font-bold text-orange-500">
                bo<span className="text-blue-800 font-serif">OK</span>stagram
              </h1>
            </div>
          )}
        </div>

        <div className="flex justify-center space-x-8 text-base sm:text-lg font-semibold mb-6">
          <button
            onClick={() => handleFormSwitch(true)}
            className={`pb-2 transition-colors duration-200 text-xl ${
              isLogin
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-400 hover:text-gray-600"
            }`}
            disabled={isLoading}
          >
            Login
          </button>
          <button
            onClick={() => handleFormSwitch(false)}
            className={`pb-2 transition-colors duration-200 text-xl ${
              !isLogin
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-400 hover:text-gray-600"
            }`}
            disabled={isLoading}
          >
            Signup
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm text-center mb-4">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-green-100 text-green-700 rounded-md text-sm text-center mb-4">
            {successMessage}
          </div>
        )}

        {isLogin ? (
          // Login Form
          <form className="space-y-4" onSubmit={handleLogin}>
            <InputField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              isValid={isValidEmail(formData.email)}
              disabled={isLoading}
            />

            <PasswordField
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              show={showPassword}
              toggleShow={togglePasswordVisibility}
              disabled={isLoading}
            />

            <SubmitButton text="Login" loading={isLoading} />

            <div className="text-center pt-2">
              <Link
                to="/reset-password"
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <SignInWithGoogle
              isLoading={isLoading}
            />
          </form>
        ) : (
          // Signup Form
          <form className="space-y-4" onSubmit={handleSignup}>
            <InputField
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              disabled={isLoading}
            />

            <InputField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              isValid={isValidEmail(formData.email)}
              disabled={isLoading}
            />

            <PasswordField
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              show={showPassword}
              toggleShow={togglePasswordVisibility}
              disabled={isLoading}
            />

            <PasswordField
              label="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              show={showConfirmPassword}
              toggleShow={toggleConfirmPasswordVisibility}
              disabled={isLoading}
            />

            <SubmitButton text="Create Account" loading={isLoading} />

            <p className="text-xs text-gray-500 text-center pt-2">
              By creating an account you agree to our{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Privacy Policy
              </a>
            </p>
          </form>
        )}
      </div>
    </div>
  );
});

const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  isValid,
  disabled,
}) => (
  <div className="space-y-1">
    <label className="block text-gray-700 font-medium">{label}</label>
    <div className="relative">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={`Enter your ${label.toLowerCase()}`}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition pr-10"
        required
        disabled={disabled}
      />
      {value && isValid !== undefined && (
        <div className="absolute top-3 right-3">
          {isValid ? (
            <FaCheckCircle className="text-green-500" />
          ) : (
            <FaExclamationCircle className="text-red-500" />
          )}
        </div>
      )}
    </div>
  </div>
);

const PasswordField = ({
  label,
  name,
  value,
  onChange,
  show,
  toggleShow,
  disabled,
}) => (
  <div className="space-y-1">
    <label className="block text-gray-700 font-medium">{label}</label>
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={`Enter your ${label.toLowerCase()}`}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition pr-10"
        required
        disabled={disabled}
      />
      <button
        type="button"
        onClick={toggleShow}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        disabled={disabled}
      >
        {show ? <FaEyeSlash /> : <FaEye />}
      </button>
    </div>
  </div>
);

const SubmitButton = ({ text, loading }) => (
  <button
    type="submit"
    className="w-full mt-6 bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg font-medium transition-colors duration-200 flex justify-center items-center disabled:opacity-70"
    disabled={loading}
  >
    {loading ? <BeatLoader color="#ffffff" size={8} /> : text}
  </button>
);

export default Login;
