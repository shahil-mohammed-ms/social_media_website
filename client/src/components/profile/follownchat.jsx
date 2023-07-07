import React, { useEffect, useState } from "react";
import axios from "../../axios";

function Follownchat(props) {
  const [following, setFollowing] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchFollowingDetails = async () => {
      const getFollowing = await axios.get(`/profileDetails`);

      setFollowing(getFollowing.data);

      const isFollowingRemaining = getFollowing.data.following.some(
        (obj) => obj.followingId == props.followingId
      );
      setIsFollowing(isFollowingRemaining);
    };
    fetchFollowingDetails();
  }, [props.followingId]);

  const handleFollowing = async () => {
    const followAccount = await axios.post(`/followers/${props.followingId}`);
    window.location.reload();
  };

  const handleUnFollowing = async () => {
    const followAccount = await axios.post(
      `/followers/${props.followingId}/unfollow`
    );
    window.location.reload();
  };

  return (
    <div className="editProfile">
      {isFollowing ? (
        <button className="pro-buttons" onClick={handleUnFollowing}>
          unfollow
        </button>
      ) : (
        <button className="pro-buttons" onClick={handleFollowing}>
          follow
        </button>
      )}

      <button className="pro-buttons">Message</button>
    </div>
  );
}

export default Follownchat;
