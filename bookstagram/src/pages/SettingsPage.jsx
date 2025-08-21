import { useState, useEffect } from "react";
import {
  FiUser,
  FiBell,
  FiBook,
  FiLock,
  FiGlobe,
  FiHelpCircle,
  FiLogOut,
  FiEye,
  FiBookmark,
  FiShare2,
} from "react-icons/fi";
import { HiArrowLeft } from "react-icons/hi";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const SettingsPage = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [readingProgressEnabled, setReadingProgressEnabled] = useState(true);
  const [userEmail, setUserEmail] = useState("Loading...");
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        setUserEmail("Not logged in");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleSignOut = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      localStorage.removeItem("isAuthenticated"); // Optional: clear auth flag
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <nav className="bg-[#16213e] text-white shadow-lg">
        <div className="container mx-auto px-4 py-2.5 flex items-center">
          <button onClick={handleBackClick} className="p-2 rounded-full">
            <HiArrowLeft className="text-2xl" />
          </button>
          <h1 className="text-2xl font-bold ml-4 md:text-center md:mx-auto">
            Settings
          </h1>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-6 pt-4 space-y-8">
        {/* Reading Preferences */}
        <SettingsCard icon={<FiBook />} title="Reading Preferences">
          <SettingItem label="Default Reading View" value="Page by Page" />
          <ToggleItem
            label="Show Reading Progress"
            value={readingProgressEnabled}
            onToggle={() => setReadingProgressEnabled(!readingProgressEnabled)}
          />
          <SettingItem label="Text Size" value="Medium" />
        </SettingsCard>

        {/* Privacy */}
        <SettingsCard icon={<FiEye />} title="Privacy">
          <SettingItem label="Show Recently Read" value="Enabled" />
          <SettingItem label="Reading Activity" value="Private" />
          <button className="w-full flex justify-between py-2 text-left text-red-600 hover:text-red-700 transition">
            <span>Clear Reading History</span>
            <span>Clear All</span>
          </button>
        </SettingsCard>

        {/* Bookmarks */}
        <SettingsCard icon={<FiBookmark />} title="Bookmarks">
          <SettingItem label="Auto-sync Bookmarks" value="Enabled" />
          <SettingItem label="Backup Frequency" value="Daily" />
          <button className="w-full flex justify-between py-2 text-left">
            <span>Export Bookmarks</span>
            <FiShare2 className="text-gray-500" />
          </button>
        </SettingsCard>

        {/* Notifications */}
        <SettingsCard icon={<FiBell />} title="Notifications">
          <ToggleItem
            label="Enable Notifications"
            value={notificationsEnabled}
            onToggle={() => setNotificationsEnabled(!notificationsEnabled)}
          />
          <SettingItem label="New Book Alerts" value="Weekly" />
          <SettingItem label="Reading Reminders" value="Daily at 8 PM" />
        </SettingsCard>

        {/* Account */}
        <SettingsCard icon={<FiUser />} title="Account">
          <SettingItem label="Email" value={userEmail} />
          <button
            onClick={() => navigate("/reset-password")}
            className="w-full flex justify-between py-2 text-left"
          >
            <span>Change Password</span>
            <FiLock className="text-gray-500" />
          </button>
          <button
            className="w-full flex justify-between py-2 text-left text-red-600 hover:text-red-700"
            onClick={() => alert("Feature not yet implemented")}
          >
            <span>Delete Account</span>
            <span>Permanent</span>
          </button>
        </SettingsCard>

        {/* Support */}
        <SettingsCard icon={<FiHelpCircle />} title="Support">
          <SettingItem label="Help Center" icon={<FiHelpCircle />} />
          <SettingItem label="Contact Us" icon={<FiGlobe />} />
          <SettingItem label="About BookApp" value="v1.1.1" />
        </SettingsCard>

        {/* Logout */}
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
        >
          <FiLogOut className="mr-2" />
          Log Out
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;

const SettingsCard = ({ icon, title, children }) => (
  <div className="p-6 rounded-lg bg-white shadow">
    <div className="flex items-center mb-4">
      <span className="mr-3 text-xl">{icon}</span>
      <h2 className="text-xl font-semibold">{title}</h2>
    </div>
    <div className="space-y-4">{children}</div>
  </div>
);

const SettingItem = ({ label, value, icon }) => (
  <div className="flex items-center justify-between">
    <span>{label}</span>
    {value ? <span className="text-gray-500">{value}</span> : icon}
  </div>
);

const ToggleItem = ({ label, value, onToggle }) => (
  <div className="flex items-center justify-between">
    <span>{label}</span>
    <button
      onClick={onToggle}
      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
        value ? "bg-indigo-600" : "bg-gray-200"
      }`}
    >
      <span
        className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${
          value ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  </div>
);
