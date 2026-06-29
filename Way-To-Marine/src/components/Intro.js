import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import fishImage from "../assets/fish.png";
import "./Intro.css";

const Intro = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/form", { replace: true }); // replace removes back button navigation
    }, 5000); // auto-redirect after 5 seconds

    return () => clearTimeout(timer); // cleanup
  }, [navigate]);

  return (
    <div className="intro-container">
      <h1 className="intro-text lava-text">Way_to_Marine</h1>
      <img src={fishImage} alt="fish" className="fish" />
    </div>
  );
};

export default Intro;
