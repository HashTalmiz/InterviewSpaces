const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {
  cors: {
    origin: ["http://localhost:8080","http://localhost:8081"]
  },
});

const crypto = require("crypto");
const { SocketAddress } = require("net");
const randomId = () => crypto.randomBytes(8).toString("hex");

const { InMemoryDB } = require("./messageStore");
const CacheDB = new InMemoryDB();

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


// CacheDB.RoomList.add("1234");
io.on("connection", (socket) => {
  console.log(`POG! WE GOT A CONNECT! ${socket.id}`)

  socket.on("authenticate", (userInfo) => {
    // console.log("authenticated user ",userInfo.username)
    socket.data = { userInfo };
    // console.log(socket.data.userInfo)
    socket.isAuth = true;
    CacheDB.socketToUser[socket.id] = userInfo;
  });

  // socket.on("de-authenticate", () => {
  //   console.log("DE-authenticated user ",socket.data.userInfo.username)
  //   socket.data.userInfo = {lol:"lol"};
  //   socket.isAuth = false;
  //   CacheDB.socketToUser.delete(socket.id);
  // });

  
  socket.on("join-room", (roomID, callback) => {
    // if not auth==> diconnect
    if(socket.isAuth === undefined)
      socket.disconnect()
      
    socket.data.userInfo = {...socket.data.userInfo, roomID, socID: socket.id};
    CacheDB.joinRoom(socket.id, roomID)
    const usersList = CacheDB.getRoomPeople(roomID)
    const code = CacheDB.getCode(roomID);
    socket.join(roomID);
    socket.to(roomID).emit("user-joined", socket.data.userInfo)
    callback({usersList, code})
  });   

  socket.on("code-change", (newCode) => {
      // check auth
      // socket.disconnect("not pog bro", 343)
      if(socket.isAuth === undefined)
        socket.disconnect()

      const { userInfo } = socket.data;
      CacheDB.updateCode(userInfo.roomID, newCode);
      socket.to(userInfo.roomID).emit("code-reflect", { newCode, userInfo });
  });
  const leaveRoom = () => {
    if(socket.isAuth === undefined)
      return
      
    const {username, socID, roomID} = socket.data.userInfo;
    CacheDB.leaveRoom(socID, roomID)
    socket.to(roomID).emit("user-left", socket.data.userInfo)
    console.log(username+" left "+roomID)
  }
  socket.on("leave-room",leaveRoom )
  socket.on("disconnecting", leaveRoom)

});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () =>
  console.log(`server listening at http://localhost:${PORT}`)
);
