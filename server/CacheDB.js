// /* abstract */ class MessageStore {
//   saveMessage(message) {}
//   findMessagesForUser(userID) {}
// }

// class InMemoryMessageStore extends MessageStore {
//   constructor() {
//     super();
//     this.messages = [];
//   }

//   saveMessage(message) {
//     this.messages.push(message);
//   }

//   findMessagesForUser(userID) {
//     return this.messages.filter(
//       ({ from, to }) => from === userID || to === userID
//     );
//   }
// }

// module.exports = {
//   InMemoryMessageStore,
// };
/* abstract */ class DB {
  joinRoom(pID, roomID) {}
  leaveRoom(pID, roomID) {}
}

class InMemoryDB extends DB {
  constructor() {
    super();
    this.activeUsers = new Set();
    this.RoomList = new Set(); // [rid1, rid2,...]
    this.roomPpl = new Map() // rid -> [socID1, socID2...]
    this.roomCode = new Map() // rid-> String
    this.socketToUser = new Map() // socID - {id,username,....}
  }
  getRooms() {
    return this.RoomList;
  }
  getRoomPeople(roomID) {
    // return ppl = for all  socketToUser[ this.roomPpl[roomID] ]
    const ppl = Array.from(this.roomPpl[roomID], socID => this.socketToUser[socID])
    return ppl;
  }
  joinRoom(socID, roomID) {
    if(this.activeUsers.has(socID)) 
      return false;
    this.activeUsers.add(socID)
    this.roomPpl[roomID] = this.roomPpl[roomID] || new Set();
    this.roomPpl[roomID].add(socID);
    console.log(socID + " has joined room " + roomID)
    return true;
  }

  leaveRoom(socID, roomID) {
    if(!this.activeUsers.has(socID)) 
      return false;
    this.activeUsers.delete(socID)
    this.roomPpl[roomID].delete(socID);
    return true;
  }
  getCode(roomID) {
    // if(this.roomCode[roomID])
      return this.roomCode[roomID];
    // return "Hello World!"
  }
  updateCode(roomID, code) {
    this.roomCode[roomID] = code;
    return code;
  }
}

module.exports = {
  InMemoryDB,
};
