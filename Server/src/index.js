const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
require("../src/Database/Mongoose/mongoose");
const cors = require("cors");

const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
); // enable cors for all routes
app.use(
  session({
    name: "sessionId",
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 },
  })
);
// app.use(session({ secret: "key", cookie: { maxAge: 3600000 } }));

app.use(bodyParser.json());

var usersRouter = require("../Route/User");
var authRouter = require("../Route/auth");
var postRouter = require("../Route/post");
var followers = require("../Route/followers");
var conversation = require("../Route/conversation");
var message = require("../Route/message");

app.use("/image", express.static(path.join(__dirname, "../Public")));

app.use("/", usersRouter); //setting router for user
app.use("/auth", authRouter);
app.use("/post", postRouter);
app.use("/followers", followers);
app.use("/conversation", conversation);
app.use("/message", message);

app.listen(5000, () => {
  console.log("Server started on port 5000");
});

module.exports = app;
