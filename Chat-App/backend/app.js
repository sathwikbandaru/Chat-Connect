const express = require("express");

const cors = require("cors");

const mongoose = require("mongoose"); // ajaykeelu ajay1234 -- chatapp chatapp

const app = express();
const { notFound, errorHandler } = require("./middlewareError/errorMiddleware");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
app.use(cors());

app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);

{
  /* ====== Mongo Connection ========*/
  const url =
    "mongodb+srv://bsathwik379:ChatApp123@chatapp.jsyuwev.mongodb.net/?retryWrites=true&w=majority";

  //  "mongodb+srv://ajaykeelu:ajay1234@chatappp.my1tv6e.mongodb.net/chatapp?retryWrites=true&w=majority";

  const mongoConnect = async () => {
    await mongoose
      .connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((res) => {
        console.log(" db connected ");
      })
      .catch((err) => console.log(err));
  };
  mongoConnect();

  /* ====== Mongo Connection ======== */
}

app.use("/", (req, res) => {
  res.send("Welcome Home");
});

const server = app.listen(1001, () => {
  console.log("http://localhost:1001");
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
    console.log(userData._id);
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;

      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.off("setup", () => {
    console.log("User Disconnected");
    socket.leave(userData._id);
  });
});
