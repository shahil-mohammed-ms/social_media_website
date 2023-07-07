import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../sidebar/sidebar.css";
import axios from "../../axios";

function Sidebar() {
  const [profile, setProfile] = useState({});

  useEffect(() => {
    const getProfile = async () => {
      try {
        const profileDetails = await axios.get("/profileDetails", {
          withCredentials: true,
        });

        setProfile(profileDetails.data);
      } catch (e) {
        console.log(e);
      }
    };
    getProfile();
  }, []);

  const navigate = useNavigate();

  return (
    <aside className="left">
      <div className="top-logo">
        <h1>Yo Life Chat</h1>
      </div>
      <div className="list">
        <div
          className="list-elements top"
          onClick={() => window.location.reload()}
        >
          <div className="list-icons">
            <ion-icon name="home"></ion-icon>
          </div>
          <div className="list-titles home">Home</div>
        </div>

        <div className="list-elements" onClick={() => navigate("/search")}>
          <div className="list-icons">
            <ion-icon name="search-outline"></ion-icon>
          </div>
          <div className="list-titles">Search</div>
        </div>
        <div className="list-elements" onClick={() => navigate("/messenger")}>
          <div className="list-icons">
            <ion-icon name="chatbubble-ellipses-outline"></ion-icon>{" "}
            <span className="IconNo">5</span>
          </div>
          <div className="list-titles">Message</div>
        </div>
        <div className="list-elements">
          <div className="list-icons">
            <ion-icon name="notifications-outline"></ion-icon>{" "}
            <span className="IconNo">5</span>
          </div>
          <div className="list-titles">Notification</div>
        </div>
        <div className="list-elements" onClick={() => navigate("/createPost")}>
          <div className="list-icons">
            <ion-icon name="duplicate-outline"></ion-icon>
          </div>
          <div className="list-titles">Create</div>
        </div>
        <div
          className="list-elements"
          onClick={() => navigate(`/profile/${profile.UID}`)}
        >
          <div className="list-icons">
            <img
              src={`http://localhost:5000/image/images/profile_picture/${profile.profileUrl}`}
              alt=""
              className="profile-img"
            />
          </div>
          <div className="list-titles">{profile.nickName}</div>
        </div>
        <div className="list-elements" onClick={() => navigate("/")}>
          <div className="list-icons">
            <ion-icon name="menu-outline"></ion-icon>
          </div>
          <div className="list-titles">More</div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
