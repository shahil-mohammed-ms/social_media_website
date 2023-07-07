const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let users = [];

const addUser = async (userId, socketId) => {
  (await !users.some((user) => user.userId === userId)) &&
    users.push({ userId, socketId });
  console.log(users);
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
  console.log(users);
};
const getUser = (userId) => {
  console.log(userId);
  user = users.find((user) => user.userId === userId);
  console.log("user below sidww1 ri");
  console.log(user);
  return user;
};

io.on("connection", (socket) => {
  //when connect
  console.log("a user connected.");
  socket.on("addUser", (userId) => {
    console.log(userId, socket.id);
    addUser(userId, socket.id);
    io.emit("getUser", users);
  });
  //send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    console.log("user below si ri");
    console.log(user);
    console.log(text);
    io.to(user?.socketId).emit("getMessage", {
      senderId,
      text,
    });
  });

  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
