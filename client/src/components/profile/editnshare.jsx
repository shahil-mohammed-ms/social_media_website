import React from "react";
import { useNavigate } from "react-router-dom";

function Editnshare() {
  const navigate = useNavigate();

  return (
    <div className="editProfile">
      <button
        className="pro-buttons"
        onClick={() => {
          navigate("/createProfile");
        }}
      >
        Edit profile
      </button>
      <button className="pro-buttons">Share profile</button>
    </div>
  );
}

export default Editnshare;
