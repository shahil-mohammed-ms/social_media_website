import { React, useEffect, useState } from "react";
import "../message/Message.css";
import axios from "../../axios";
import { format } from "timeago.js";

function Message({ details, own }) {
  const formattedTime = format(details.createdAt);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getFriendId = async () => {
      const res = await axios.get(`/friendDetails/${details.sender}`);
      setUser(res.data);
    };

    getFriendId();
  }, [user]);

  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img
          src={`http://localhost:5000/image/images/profile_picture/${user?.profileUrl}`}
          alt=""
          className="messageImg"
        />
        <p className="messageText">{details.text}</p>
      </div>

      <div className="messageBottom">{`${formattedTime}...`}</div>
    </div>
  );
}

export default Message;
