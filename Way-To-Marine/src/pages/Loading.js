// src/pages/Loading.js
import React from "react";
import "./Loading.css";

const Loading = () => {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <h2 className="loading-text">Loading Marine Data...</h2>
    </div>
  );
};

export default Loading;
