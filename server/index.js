const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:8080",
  },
});

const crypto = require("crypto");
const { SocketAddress } = require("net");
const randomId = () => crypto.randomBytes(8).toString("hex");

// const { InMemorySessionStore } = require("./sessionStore");
// const sessionStore = new InMemorySessionStore();

const { InMemoryDB } = require("./messageStore");
const DB = new InMemoryDB();

// io.use((socket, next) => {
//   const sessionID = socket.handshake.auth.sessionID;
//   if (sessionID) {
//     const session = sessionStore.findSession(sessionID);
//     if (session) {
//       socket.sessionID = sessionID;
//       socket.userID = session.userID;
//       socket.username = session.username;
//       return next();
//     }
//   }
//   const username = socket.handshake.auth.username;
//   if (!username) {
//     return next(new Error("invalid username"));
//   }
//   socket.sessionID = randomId();
//   socket.userID = randomId();
//   socket.username = username;
//   next();
// });


// DB.RoomList.add("1234");
io.on("connection", (socket) => {
  console.log(`POG! WE GOT A CONNECT! ${socket.id}`)
  // persist session
  // sessionStore.saveSession(socket.sessionID, {
  //   userID: socket.userID,
  //   username: socket.username,
  //   connected: true,
  // });

  // emit session details
  // socket.emit("session", {
  //   sessionID: socket.sessionID,
  //   userID: socket.userID,
  // });

  socket.on("join-room", (username, roomID, callback) => {
    const usersList = DB.joinRoom(username, roomID)
    socket.join(roomID);
    const {id} = socket
    console.log(socket.handshake)
    // socket.to(roomID).emit("user-joined", {id, username})
    callback({usersList})
  });   

  socket.on("code-change", (newCode) => {
      // get room id from socketid/userid
      const {id} = socket;
      const {username} = socket.auth;
      DB.updateCode(roomID, newCode);
      socket.to(roomID).emit("code-reflect", newCode);
  });
  

  socket.on("leave-room", async (data) => {
    DB.leaveRoom(data.pID, data.roomID)
    socket.to(data.roomID).emit("user-left", data)
    socket.leave(data.roomID);
  })




  // // fetch existing users
  // const users = [];
  // const messagesPerUser = new Map();
  // messageStore.findMessagesForUser(socket.userID).forEach((message) => {
  //   const { from, to } = message;
  //   const otherUser = socket.userID === from ? to : from;
  //   if (messagesPerUser.has(otherUser)) {
  //     messagesPerUser.get(otherUser).push(message);
  //   } else {
  //     messagesPerUser.set(otherUser, [message]);
  //   }
  // });
  // sessionStore.findAllSessions().forEach((session) => {
  //   users.push({
  //     userID: session.userID,
  //     username: session.username,
  //     connected: session.connected,
  //     messages: messagesPerUser.get(session.userID) || [],
  //   });
  // });
  // socket.emit("users", users);

  // // notify existing users
  // socket.broadcast.emit("user connected", {
  //   userID: socket.userID,
  //   username: socket.username,
  //   connected: true,
  //   messages: [],
  // });

  // forward the private message to the right recipient (and to other tabs of the sender)
  // socket.on("private message", ({ content, to }) => {
  //   const message = {
  //     content,
  //     from: socket.userID,
  //     to,
  //   };
  //   socket.to(to).to(socket.userID).emit("private message", message);
  //   messageStore.saveMessage(message);
  // });

  // notify users upon disconnection
  // socket.on("disconnect", async () => {
  //   const matchingSockets = await io.in(socket.userID).allSockets();
  //   const isDisconnected = matchingSockets.size === 0;
  //   if (isDisconnected) {
  //     // notify other users
  //     socket.broadcast.emit("user disconnected", socket.userID);
  //     // update the connection status of the session
  //     sessionStore.saveSession(socket.sessionID, {
  //       userID: socket.userID,
  //       username: socket.username,
  //       connected: false,
  //     });
  //   }
  // });
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () =>
  console.log(`server listening at http://localhost:${PORT}`)
);
