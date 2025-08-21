import React, { useState, useEffect } from "react";
import { AiOutlineUser, AiOutlineMail, AiOutlinePhone } from "react-icons/ai";
import {
  HiOutlineUser,
  HiOutlineLocationMarker,
  HiOutlineBookOpen,
  HiArrowLeft,
} from "react-icons/hi";
import { FaCamera } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { auth, db } from "../../components/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const Profile = () => {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const storage = getStorage();

  const fetchUserDetails = async () => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          if (user.photoURL) {
            setPreviewImage(user.photoURL);
          }

          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setUserDetails(docSnap.data());
          } else {
            toast.error("User profile not found in database.");
          }
        } catch (error) {
          toast.error("Failed to fetch user data.");
          console.error("Firestore error:", error);
        } finally {
          setLoading(false);
        }
      } else {
        toast.error("Please login to view your profile.");
        navigate("/login");
      }
    });

    return () => unsubscribe();
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB");
      return;
    }

    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      const storageRef = ref(storage, `profilePictures/${user.uid}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      await updateProfile(user, {
        photoURL: downloadURL,
      });

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        photoURL: downloadURL,
      });

      setPreviewImage(downloadURL);
      toast.success("Profile picture updated successfully!");
    } catch (error) {
      console.error("Error updating profile picture:", error);
      toast.error("Failed to update profile picture");
    } finally {
      setLoading(false);
    }
  };

  const userData = userDetails
    ? {
        fullName:
          userDetails.fullName || auth.currentUser?.displayName || "N/A",
        email: auth.currentUser?.email || "N/A",
        username:
          userDetails.username ||
          auth.currentUser?.email?.split("@")[0] ||
          "user",
        mobile: userDetails.mobile || "N/A",
        bio: userDetails.bio || "Tell us about yourself...",
        location: userDetails.location || "N/A",
      }
    : {
        fullName: loading ? "Loading..." : "N/A",
        email: loading ? "Loading..." : "N/A",
        username: loading ? "Loading..." : "user",
        mobile: loading ? "Loading..." : "N/A",
        bio: loading ? "Loading..." : "Tell us about yourself...",
        location: loading ? "Loading..." : "N/A",
      };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Toaster position="top-right" />

      <div className="bg-white dark:bg-[#16213e] shadow-sm py-2.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto flex items-center">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-800 dark:text-gray-200 mr-4"
            disabled={loading}
          >
            <HiArrowLeft className="text-2xl" />
          </button>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">
            My Profile
          </h1>
        </div>
      </div>

      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-[#16213e] rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="h-32 w-32 rounded-full border-4 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={() => setPreviewImage(null)}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <AiOutlineUser className="w-16 h-16 text-gray-400 dark:text-gray-300" />
                      </div>
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-blue-700 transition flex items-center">
                    <FaCamera className="w-5 h-5" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={loading}
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  {
                    label: "Full Name",
                    value: userData.fullName,
                    icon: <HiOutlineUser className="w-5 h-5" />,
                  },
                  {
                    label: "Username",
                    value: `@${userData.username}`,
                    icon: <HiOutlineUser className="w-5 h-5" />,
                  },
                  {
                    label: "Email Address",
                    value: userData.email,
                    icon: <AiOutlineMail className="w-5 h-5" />,
                  },
                  {
                    label: "Mobile Number",
                    value: userData.mobile,
                    icon: <AiOutlinePhone className="w-5 h-5" />,
                  },
                  {
                    label: "Location",
                    value: userData.location,
                    icon: <HiOutlineLocationMarker className="w-5 h-5" />,
                  },
                ].map((field, index) => (
                  <div key={index} className="flex items-start">
                    <div className="text-gray-500 dark:text-gray-400 mt-1 mr-3">
                      {field.icon}
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        {field.label}
                      </label>
                      <p className="text-gray-700 dark:text-gray-300 break-words">
                        {field.value}
                      </p>
                    </div>
                  </div>
                ))}

                <div className="flex items-start">
                  <div className="text-gray-500 dark:text-gray-400 mt-1 mr-3">
                    <HiOutlineBookOpen className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Bio
                    </label>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                      {userData.bio}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => navigate("/edit-profile")}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  disabled={loading}
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
