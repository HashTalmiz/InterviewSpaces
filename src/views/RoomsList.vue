<template>
  <div>
    <div class="left-panel">
      <participants-list
        v-for="room in rooms"
        :key="room.id"
        :room="room"
        @click="go(room.id)"
      />
    </div>
  </div>
</template>

<script>
import socket from "../socket";
import ParticipantsList from "@/components/ParticipantsList.vue";

export default {
  name: "RoomsList",
  components: { ParticipantsList },
  data() {
    return {
      username : null,
      rooms: [{
        name: "room1",
        id: "4h354hb4445jh"
      },{
        name: "room2",
        id: "6jh5t34h53444"
      },{
        name: "lolol",
        id: "ejgfh83437422"
      },{
        name: "room4",
        id: "h345h34j34jf9"
      }]
    };
  },
  methods: {
    onMessage() {
      console.log("LOL!!!!!!!!!")
    //   if (this.selectedUser) {
    //     socket.emit("private message", {
    //       content,
    //       to: this.selectedUser.userID,
    //     });
    //     this.selectedUser.messages.push({
    //       content,
    //       fromSelf: true,
    //     });
    //   }
    },
    go(roomID){
      this.$router.push(`/room/${roomID}`)
    }
  },
  mounted() {
    socket.connect()
    // socket.auth.username = this.username
    socket.on("connect", () => {
      console.log("Connected to sarbhar!", socket.id)
    });
    
    // socket.on("disconnect", () => {
    //   this.users.forEach((user) => {
    //     if (user.self) {
    //       user.connected = false;
    //     }
    //   });
    // });

    // const initReactiveProperties = (user) => {
    //   user.hasNewMessages = false;
    // };

    // socket.on("users", (users) => {
    //   users.forEach((user) => {
    //     user.messages.forEach((message) => {
    //       message.fromSelf = message.from === socket.userID;
    //     });
    //     for (let i = 0; i < this.users.length; i++) {
    //       const existingUser = this.users[i];
    //       if (existingUser.userID === user.userID) {
    //         existingUser.connected = user.connected;
    //         existingUser.messages = user.messages;
    //         return;
    //       }
    //     }
    //     user.self = user.userID === socket.userID;
    //     initReactiveProperties(user);
    //     this.users.push(user);
    //   });
    //   // put the current user first, and sort by username
    //   this.users.sort((a, b) => {
    //     if (a.self) return -1;
    //     if (b.self) return 1;
    //     if (a.username < b.username) return -1;
    //     return a.username > b.username ? 1 : 0;
    //   });
    // });

    // socket.on("user connected", (user) => {
    //   for (let i = 0; i < this.users.length; i++) {
    //     const existingUser = this.users[i];
    //     if (existingUser.userID === user.userID) {
    //       existingUser.connected = true;
    //       return;
    //     }
    //   }
    //   initReactiveProperties(user);
    //   this.users.push(user);
    // });

    // socket.on("user disconnected", (id) => {
    //   for (let i = 0; i < this.users.length; i++) {
    //     const user = this.users[i];
    //     if (user.userID === id) {
    //       user.connected = false;
    //       break;
    //     }
    //   }
    // });

    // socket.on("private message", ({ content, from, to }) => {
    //   for (let i = 0; i < this.users.length; i++) {
    //     const user = this.users[i];
    //     const fromSelf = socket.userID === from;
    //     if (user.userID === (fromSelf ? to : from)) {
    //       user.messages.push({
    //         content,
    //         fromSelf,
    //       });
    //       if (user !== this.selectedUser) {
    //         user.hasNewMessages = true;
    //       }
    //       break;
    //     }
    //   }
    // });
  },
//   destroyed() {
    // socket.off("connect");
    // socket.off("disconnect");
    // socket.off("users");
    // socket.off("user connected");
    // socket.off("user disconnected");
    // socket.off("private message");
//   },
};
</script>

<style scoped>
.left-panel {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 260px;
  overflow-x: hidden;
  background-color: #3f0e40;
  color: white;
}

.right-panel {
  margin-left: 260px;
}
</style>
