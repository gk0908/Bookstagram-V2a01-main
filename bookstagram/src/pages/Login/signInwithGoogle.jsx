import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "../../components/firebase";
import { setDoc, doc } from "firebase/firestore";
import React from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Google_Icon from "../../assets/google-icon.svg"; // Adjust the path as necessary

const SignInWithGoogle = ({ isLoading }) => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user) {
        await setDoc(doc(db, "users", user.uid), {
          fullName: user.displayName || "",
          email: user.email || "",
          photoURL: user.photoURL || "",
        });

        localStorage.setItem("isAuthenticated", "true"); 

        toast.success("Login successful!", {
          position: "top-center",
        });

        navigate("/"); 
      }
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Login failed. Please try again.", {
        position: "top-center",
      });
    }
  };

  return (
    <div>
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">or</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 transition duration-200 disabled:opacity-50"
      >
        <img
          src={Google_Icon}
          alt="Google"
          className="w-5 h-5"
        />
        <span>Login with Google</span>
      </button>
    </div>
  );
};

export default SignInWithGoogle;
