import React, { useEffect, useState, useReducer } from "react";
import "../search_box/searchBox.css";
import axios from "../../axios";
import { useNavigate } from "react-router-dom";

function SearchBox() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`/search?term=${searchTerm}`);

      setSearchResults(response.data);
    } catch (error) {
      console.error("An error occurred while searching for users.", error);
    }
  };

  return (
    <div className="search_box">
      <div className="box">
        <div className="top">
          <div className="list-icons" onClick={() => navigate(`/home`)}>
            <ion-icon name="home"></ion-icon>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search_input"
          />
          <div className="list-icons" onClick={handleSearch}>
            <ion-icon name="search-outline"></ion-icon>
          </div>
        </div>
        <div className="bottom">
          {searchResults.map((user) => {
            return (
              <div
                className="profile_box"
                onClick={() => navigate(`/profile/${user.UID}`)}
              >
                <div className="pro-pic">
                  <img
                    src={`http://localhost:5000/image/images/profile_picture/${user.profileUrl}`}
                    alt=""
                    className="profile-img"
                  />
                </div>
                <div className="post-user-name">{user.nickName}</div>
                <div className="isfollower">
                  <p>follow</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default SearchBox;
