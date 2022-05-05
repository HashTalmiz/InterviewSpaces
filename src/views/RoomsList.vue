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
    socket.emit("authenticate", socket.auth.userInfo)
    // socket.auth.username = this.username
    socket.on("connect", () => {
      console.log("Connected to sarbhar!", socket.id)
    });

    socket.on("disconnect", (err) => {
      if(err === "io server disconnect")
        this.$router.push("/")
    });
  },
  beforeUnmount() {
    // bad idea; it runs when redirecting to a room too
    // socket.emit("de-authenticate")
  }
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
