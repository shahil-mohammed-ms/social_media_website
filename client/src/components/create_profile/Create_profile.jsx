import React, { useState, useEffect } from "react";
import axios from "../../axios";
import "../create_profile/Create_profile.css";
import { useNavigate } from "react-router-dom";

function Create_profile() {
  const navigate = useNavigate();
  const [profileDetails, setProfileDetails] = useState({});

  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchProfileDetails = async () => {
      try {
        const response = await axios.get("/profileDetails"); // Replace '/api/profile' with your API endpoint to fetch the profile details
        setProfileDetails(response.data);
      } catch (error) {
        console.error("Error fetching profile details:", error);
      }
    };

    fetchProfileDetails();
  }, []);

  const handleInputChange = (e, field) => {
    if (field === "profileUrl") {
      const file = e.target.files[0];
      setProfileImage(file);
    } else {
      const { value } = e.target;
      setProfileDetails((prevState) => ({
        ...prevState,
        [field]: value,
      }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("avatar", profileImage);
      formData.append("nickName", profileDetails.nickName);
      formData.append("details", profileDetails.details);
      formData.append("phone", profileDetails.phone);

      await axios.put("/profileUpdate", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/home");
      console.log("Profile details updated successfully!");
    } catch (error) {
      console.error("Error updating profile details:", error);
    }
  };

  return (
    <div className="main-container">
      <div className="createprofile-container">
        <form onSubmit={handleFormSubmit}>
          <div className="box">
            <label htmlFor="">nick name</label>
            <input
              type="text"
              value={profileDetails.nickName || ""}
              onChange={(e) => handleInputChange(e, "nickName")}
            />
          </div>
          <div className="box">
            <label htmlFor="">description</label>
            <textarea
              value={profileDetails.details || ""}
              onChange={(e) => handleInputChange(e, "details")}
              rows={6} // Specify the number of visible rows for the textarea
              cols={39} // Specify the number of visible columns for the textarea
              style={{ resize: "none" }}
            ></textarea>
          </div>

          <div className="box">
            <label htmlFor="">phone</label>
            <input
              type="text"
              value={profileDetails.phone || ""}
              onChange={(e) => handleInputChange(e, "phone")}
            />
          </div>
          <div className="box">
            <label htmlFor="">profile picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleInputChange(e, "profileUrl")}
            />
            <button type="submit">Update Profile</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Create_profile;
