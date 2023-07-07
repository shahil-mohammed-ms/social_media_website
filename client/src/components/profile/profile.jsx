import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../profile/profile.css";
import Editnshare from "./editnshare";
import Follownchat from "./follownchat";
import { useParams } from "react-router-dom";
import axios from "../../axios";
import { useProfileContext } from "../../contex/profileContex";

function Profile() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { profile } = useProfileContext();
  const [profileInfo, setProfileInfo] = useState({});
  const [post, setPost] = useState([]);
  const [realName, setRealName] = useState({});

  // Fetch profile details using Axios
  useEffect(() => {
    const fetchProfileDetails = async () => {
      try {
        const profileDetails = await axios.get(`/profilePage/${userId}`);
        setProfileInfo(profileDetails.data);
        const postsDetails = await axios.get(`/post/postPage/${userId}`);

        setPost(postsDetails.data);
        const getRealName = await axios.get(`/realName/${userId}`);
        setRealName(getRealName.data);
      } catch (e) {
        console.log(e);
      }
    };

    fetchProfileDetails();
  }, [userId]);

  return (
    <div className="main-content">
      <div className="header">
        <div className="name">
          <p>{realName.name}</p>
        </div>
        <div className="icons">
          <ion-icon
            name="home-outline"
            onClick={() => {
              navigate("/home");
            }}
          ></ion-icon>
          <ion-icon
            className="one"
            onClick={() => navigate("/createPost")}
            name="duplicate-outline"
          ></ion-icon>
          <ion-icon className="two" name="menu-outline"></ion-icon>
        </div>
      </div>

      <div className="profile">
        <div className="pro-pic">
          <img
            className="img"
            src={`http://localhost:5000/image/images/profile_picture/${profileInfo.profileUrl}`}
            alt=""
          />
        </div>

        <div className="pro-numbers">
          <div className="display-number">
            <div className="no">
              <h2>20</h2>
            </div>
            <div className="pname profile-text">
              <p>Posts</p>
            </div>
          </div>

          <div className="display-number">
            <div className="no">
              <h2>10</h2>
            </div>
            <div className="pname profile-text">
              <p>followers</p>
            </div>
          </div>

          <div className="display-number">
            <div className="no">
              <h2>10</h2>
            </div>
            <div className="pname profile-text">
              <p>following</p>
            </div>
          </div>
        </div>
      </div>

      <div className="profileDetails">
        <p className="nick-name">{profileInfo.nickName}</p>

        <p className="description">{profileInfo.details}</p>
        <p className="phone-no">phone no: {profileInfo.phone}</p>
      </div>
      {profile.UID == profileInfo.UID ? (
        <Editnshare />
      ) : (
        <Follownchat followingId={profileInfo.UID} />
      )}

      <div className="postpictures">
        {post.map((item) => (
          <div key={item._id}>
            <img
              src={`http://localhost:5000/image/images/post/${item.imageUrl[0]}`}
              alt=""
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Profile;
