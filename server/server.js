require('dotenv').config()
const express = require('express');
const app = express();
const httpServer = require("http").createServer(app);
const cors = require('cors');
const cookieParser = require('cookie-parser');
const router = require('./routes')

const ACTIONS = require('./actions');
const io = require("socket.io")(httpServer, {
  cors: {
    origin: process.env.FRONT_END_URL,
    methods: ['GET', 'POST']
  },
});

app.use(cookieParser());
const corsOption = {
    credentials: true,
    origin: [process.env.FRONT_END_URL],
};
app.use(cors(corsOption));
app.use(express.json({ limit: '8mb' }));
app.use(router);

const crypto = require("crypto");
const { SocketAddress } = require("net");
const randomId = () => crypto.randomBytes(8).toString("hex");

const { InMemoryDB } = require("./CacheDB");
const CacheDB = new InMemoryDB();

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

  
  socket.on(ACTIONS.JOIN_ROOM, (roomID, callback) => {
    // if not auth==> diconnect
    if(socket.isAuth === undefined)
      socket.disconnect()
      
    socket.data.userInfo = {...socket.data.userInfo, roomID, socID: socket.id};
    CacheDB.joinRoom(socket.id, roomID)
    const usersList = CacheDB.getRoomPeople(roomID)
    const code = CacheDB.getCode(roomID);
    socket.join(roomID);
    socket.to(roomID).emit(ACTIONS.USER_JOINED, socket.data.userInfo)
    callback({usersList, code})
  });   

  socket.on(ACTIONS.CODE_CHANGE, (newCode) => {
      // check auth
      // socket.disconnect("not pog bro", 343)
      if(socket.isAuth === undefined)
        socket.disconnect()

      const { userInfo } = socket.data;
      CacheDB.updateCode(userInfo.roomID, newCode);
      socket.to(userInfo.roomID).emit(ACTIONS.CODE_REFLECT, { newCode, userInfo });
  });
  const leaveRoom = () => {
    if(socket.isAuth === undefined)
      return
      
    const {username, socID, roomID} = socket.data.userInfo;
    CacheDB.leaveRoom(socID, roomID)
    socket.to(roomID).emit(ACTIONS.USER_LEFT, socket.data.userInfo)
    console.log(username+" left "+roomID)
  }
  socket.on(ACTIONS.LEAVE_ROOM, leaveRoom )
  socket.on("disconnecting", leaveRoom)

});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () =>
  console.log(`server listening at http://localhost:${PORT}`)
);
