import { React, useEffect, useState } from "react";
import axios from "../../axios";

function Conversation({ conversation, userDetails }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getFriendId = async () => {
      const friendId = conversation.members.find(
        (obj) => obj !== userDetails.UID
      );

      const res = await axios.get(`/friendDetails/${friendId}`);
      setUser(res.data);
    };
    getFriendId();
  }, [conversation, userDetails]);

  return (
    <div className="list-elements">
      <div className="list-icons">
        {" "}
        {user && (
          <img
            src={`http://localhost:5000/image/images/profile_picture/${user.profileUrl}`}
            alt=""
            className="profile-img"
          />
        )}
      </div>
      <div className="list-titles">{user && user.nickName}</div>
    </div>
  );
}

export default Conversation;
