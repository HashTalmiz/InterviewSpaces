const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {
  cors: {
    origin: ["http://localhost:8080","http://localhost:8081"]
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

  socket.on("authenticate", (userInfo) => {
    // console.log("authenticated user ",userInfo.username)
    socket.data = { userInfo } ;
    // console.log(socket.data.userInfo)
    socket.isAuth = true;
    DB.socketToUser[socket.id] = userInfo;
  });

  socket.on("de-authenticate", () => {
    // console.log("authenticated user ",userInfo.username)
    socket.data.userInfo = {};
    socket.isAuth = false;
    DB.socketToUser.delete(socket.id);
  });

  
  socket.on("join-room", (roomID, callback) => {
    // if not auth==> diconnect


    console.log(socket.data.userInfo)
    socket.data.userInfo = {...socket.data.userInfo, roomID, socID: socket.id};
    DB.joinRoom(socket.id, roomID)
    const usersList = DB.getRoomPeople(roomID)
    const code = DB.getCode(roomID);
    socket.join(roomID);
    socket.to(roomID).emit("user-joined", socket.data.userInfo)
    callback({usersList, code})
  });   

  socket.on("code-change", (newCode) => {
      // check auth

      const { userInfo } = socket.data;
      DB.updateCode(userInfo.roomID, newCode);
      socket.to(userInfo.roomID).emit("code-reflect", { newCode, userInfo });
  });
  
  socket.on("leave-room", () => {
    const {username, socID, roomID} = socket.data.userInfo;
    DB.leaveRoom(socID, roomID)
    socket.to(roomID).emit("user-left", socket.data.userInfo)
    console.log(username+" left "+roomID)
  })
  // socket.on("disconnecting", leaveRoom)

});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () =>
  console.log(`server listening at http://localhost:${PORT}`)
);
