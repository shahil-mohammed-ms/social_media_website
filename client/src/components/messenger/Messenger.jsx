import { React, useState, useEffect, createRef, useRef } from "react";
import "../messenger/Messenger.css";
import Conversation from "../conversation/Conversation";
import OnlineFriends from "../online/OnlineFriends";
import Message from "../message/Message";
import { useNavigate } from "react-router-dom";
import axios from "../../axios";
import { useProfileContext } from "../../contex/profileContex";
import { io } from "socket.io-client";

function Messenger() {
  const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState("");
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const { profile } = useProfileContext();
  const scrollRef = createRef();
  const socket = useRef();

  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current.on("getMessage", (data) => {
      console.log(data.text);
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);
  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    socket.current.emit("addUser", profile.UID);
    socket.current.on("getUser", (data) => {
      console.log(data);
    });
  }, []);

  useEffect(() => {
    const getConversation = async () => {
      const userId = profile.UID;

      const res = await axios.get(`/conversation/allConversation/${userId}`);
      setConversations(res.data);
    };

    getConversation();
  }, []);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get(`/message/${currentChat?._id}`);
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: profile.UID,
      text: newMessage,
      conversationId: currentChat._id,
    };
    const receiverId = currentChat.members.find(
      (member) => member !== profile.UID
    );

    socket.current.emit("sendMessage", {
      senderId: profile.UID,
      receiverId,
      text: newMessage,
    });

    try {
      const res = await axios.post(`/message`, message);
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="main">
      <div className="conversation-box">
        <div className="top-logo" onClick={() => navigate("/home")}>
          <h1>Yo Life Chat</h1>
        </div>
        {conversations.map((obj) => (
          <div key={obj._id} onClick={() => setCurrentChat(obj)}>
            <Conversation conversation={obj} userDetails={profile} />
          </div>
        ))}
      </div>

      <div className="chat-box">
        {currentChat ? (
          <>
            {" "}
            <div className="top">
              {messages.map((obj, index) => (
                <div key={obj._id}>
                  <Message details={obj} own={profile.UID !== obj.sender} />
                  {index === messages.length - 1 && <div ref={scrollRef} />}
                </div>
              ))}
            </div>
            <div className="bottom">
              <textarea
                className="chatMessageInput"
                placeholder="write something..."
                onChange={(e) => setNewMessage(e.target.value)}
                value={newMessage}
              ></textarea>
              <button className="chatSubmitButton" onClick={handleSubmit}>
                Send
              </button>
            </div>
          </>
        ) : (
          <span className="noConversationText">
            Open a conversation to start a chat.
          </span>
        )}
      </div>

      <div className="online-box">
        <OnlineFriends />
      </div>
    </div>
  );
}

export default Messenger;
