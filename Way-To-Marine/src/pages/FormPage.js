import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FormPage.css";

const FormPage = () => {
  const [userType, setUserType] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault(); // ✅ prevent page refresh

    if (userType === "scientist") {
      navigate("/dashboard/scientist");
    } else if (userType === "fisherman") {
      navigate("/dashboard/fisherman");
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Marine Data Entry</h2>

      <form className="marine-form" onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" placeholder="Enter your name" required />
        </label>

        <label>
          Email:
          <input type="email" placeholder="Enter your email" required />
        </label>

        <label>
          Location:
          <input type="text" placeholder="Enter location" />
        </label>

        <label>
          User Type:
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            required
          >
            <option value="">-- Select --</option>
            <option value="scientist">Scientist</option>
            <option value="fisherman">Fisherman</option>
          </select>
        </label>

        <button type="submit" className="submit-btn">
          Submit
        </button>
      </form>
    </div>
  );
};

export default FormPage;
