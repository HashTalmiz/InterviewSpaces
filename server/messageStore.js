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
    this.roomPpl = new Map() // rid -> [p1, p2...]
    this.roomCode = new Map() // rid-> String
  }
  getRooms() {
    return this.RoomList;
  }
  joinRoom(pID, roomID) {
    if(this.activeUsers.has(pID)) 
      return false;
    this.activeUsers.add(pID)
    this.roomPpl[roomID] = this.roomPpl[roomID] || new Set();
    this.roomPpl[roomID].add(pID);
    console.log(pID + " has joined room " + roomID)
    return [...this.roomPpl[roomID]];
  }

  leaveRoom(pID, roomID) {
    if(!this.activeUsers.has(pID)) 
      return false;
    this.activeUsers.delete(pID)
    this.roomPpl[roomID].delete(pID);
  }
  updateCode(roomID, code) {
    this.roomCode[roomID] = code;
    return code;
  }
}

module.exports = {
  InMemoryDB,
};
