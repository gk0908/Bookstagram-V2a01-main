import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import webgazer from "webgazer";

const PdfViewer = () => {
  const location = useLocation();
  const { title } = location.state || {};
  const [isDistracted, setIsDistracted] = useState(false);
  const distractionTimer = useRef(null);

  // Floating tab position
  const [pos, setPos] = useState({ x: 20, y: 20 });
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    webgazer
      .setRegression("ridge")
      .setGazeListener((data) => {
        if (!data) return;
        if (data.x < 0 || data.y < 0) handleDistraction();
        else resetDistraction();
      })
      .begin();

    return () => {
      webgazer.end();
      clearTimeout(distractionTimer.current);
    };
  }, []);

  const handleDistraction = () => {
    if (!distractionTimer.current) {
      distractionTimer.current = setTimeout(() => {
        setIsDistracted(true);
        webgazer.end();
      }, 60000);
    }
  };

  const resetDistraction = () => {
    clearTimeout(distractionTimer.current);
    distractionTimer.current = null;
    if (isDistracted) setIsDistracted(false);
  };

  // Dragging logic
  const handleMouseDown = (e) => {
    dragging.current = true;
    offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
  };

  const handleMouseMove = (e) => {
    if (dragging.current) {
      setPos({
        x: e.clientX - offset.current.x,
        y: e.clientY - offset.current.y,
      });
    }
  };

  const handleMouseUp = () => {
    dragging.current = false;
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div style={{ width: "100%", height: "100vh", overflow: "hidden" }}>
      {/* Floating draggable status tab */}
      <div
        onMouseDown={handleMouseDown}
        style={{
          position: "fixed",
          top: pos.y,
          left: pos.x,
          background: isDistracted ? "#ffcccc" : "#ccffcc",
          padding: "10px 15px",
          borderRadius: "8px",
          boxShadow: "0px 4px 8px rgba(0,0,0,0.3)",
          fontWeight: "bold",
          cursor: "move",
          zIndex: 9999, // always above iframe
          userSelect: "none",
        }}
      >
        👁 {isDistracted ? "Distracted!" : "Reading..."}
      </div>

      {/* PDF itself */}
      <div
  style={{
    position: "fixed",
    top: "50px",
    right: "50px",
    background: "red",
    color: "white",
    padding: "20px",
    zIndex: 99999,
  }}
>
  TEST WIDGET
</div>

      <iframe
        src={`/pdfs/${encodeURIComponent(location.pathname.split("/pdf/")[1])}`}
        title={title}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1,
        }}
      />
    </div>
  );
};

export default PdfViewer;
