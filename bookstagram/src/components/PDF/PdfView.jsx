import React, { useState, useEffect } from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { useParams, useNavigate } from "react-router-dom";
import { FaSun, FaMoon } from "react-icons/fa";
import { HiArrowLeft } from "react-icons/hi";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const PdfView = () => {
  const { pdfName } = useParams();
  const navigate = useNavigate();
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const [darkMode, setDarkMode] = useState(false);

  // Build the backend PDF URL
  const pdfUrl = `http://localhost:5000/files/${encodeURIComponent(pdfName)}`;

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50"
      }`}
    >
      <nav
        className={`relative flex items-center justify-between p-2.5 shadow-sm ${
          darkMode ? "bg-gray-800" : "bg-[#16213e]"
        }`}
      >
        <div className="z-10">
          <button
            onClick={() => navigate(-1)}
            className={`flex items-center space-x-2 rounded-lg px-4 py-2 transition-all ${
              darkMode
                ? "text-white hover:bg-gray-700"
                : "text-white hover:bg-gray-100"
            }`}
          >
            <HiArrowLeft className="text-2xl" />
          </button>
        </div>

        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-xl font-semibold text-white truncate max-w-xs">
          {decodeURIComponent(pdfName).replace(/\.pdf$/i, "")}
        </h1>

        <div className="z-10">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
              darkMode
                ? "bg-gray-700 hover:bg-gray-600 text-yellow-300"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <FaSun className="text-lg" />
            ) : (
              <FaMoon className="text-lg" />
            )}
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-6">
        <div
          className={`rounded-lg shadow-lg overflow-hidden border ${
            darkMode
              ? "border-gray-700 bg-gray-800"
              : "border-gray-200 bg-white"
          }`}
          style={{ height: "calc(100vh - 180px)" }}
        >
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <Viewer
              fileUrl={pdfUrl}
              plugins={[defaultLayoutPluginInstance]}
              theme={darkMode ? "dark" : "light"}
            />
          </Worker>
        </div>

        <footer
          className={`mt-4 text-center text-sm ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Powered by React PDF Viewer • {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
};

export default PdfView;
