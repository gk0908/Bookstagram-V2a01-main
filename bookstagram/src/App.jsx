import { Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./components/firebase";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import Search from "./pages/FooterPages/Search";
import Profile from "./pages/FooterPages/Profile";
import Favourite from "./pages/FooterPages/Favourite";
import UploadPDF from "./components/PDF/UploadPDF";
import PdfView from "./components/PDF/PdfView";
import YourBooks from "./pages/Books/YourBooks";
import SettingsPage from "./pages/Setting/SettingsPage";
import ResetPassword from "./components/ResetPassword/ResetPassword";
// import BookUpload from "./components/upload/BookUpload"
const ProtectedRoute = ({ isAuthenticated }) => {
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const Spinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      if (user) {
        localStorage.setItem("isAuthenticated", "true");
      } else {
        localStorage.removeItem("isAuthenticated");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <Spinner />;

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route
          path="/login"
          element={<Login setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          path="/"
          element={
            <Navigate to={isAuthenticated ? "/home" : "/login"} replace />
          }
        />

        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          <Route path="/home" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/favourite" element={<Favourite />} />
          <Route path="/upload" element={<UploadPDF />} />
          <Route path="/yourbooks" element={<YourBooks />} />
          <Route path="/pdf/:pdfName" element={<PdfView />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
