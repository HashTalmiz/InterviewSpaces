<template>
  <div>
    <div class="left-panel">
      <participants-list
        v-for="user in users"
        :key="user.userID"
        :user="user.username"
      />
    </div>
    <code-panel
        v-if="initCode.length() > 0"
        :initCode="this.initCode"
      @input="onCodeChange"
      class="right-panel"
    />
  </div>
</template>

<script>
import socket from "../socket";
import ParticipantsList from '@/components/ParticipantsList.vue'

export default {
    name: "RoomView",
    components: { ParticipantsList },
  data() {
    return {
        initCode: "",
        username: null,
        roomID: null,
      users: [],
    };
  },
  methods: {
    onCodeChange(newCode) {
        socket.emit("code-change", newCode)
    }
  },
  mounted() { 
    this.roomID = this.$router.params;
    this.username = socket.auth.username;
    socket.emit("join-room", this.username, this.roomID, (users) => {
        this.users = users
    });

    // socket.on("usersList", (users) => {
    //     this.users = users
    // });

    socket.on("user-joined", (user) => {
        this.users.append(user)
    });

    socket.on("user-disconnected", (id) => {
        this.users = this.users.filter((name) => name !== id)
    });

    socket.on("code-reflect", (code, from) => {
        // update code
        console.log(code)
        console.log(from)
    })
  },
  unmounted() {
      socket.emit("leave-room");
    // socket.off("connect");
    // socket.off("disconnect");
    // socket.off("users");
    // socket.off("user connected");
    // socket.off("user disconnected");
    // socket.off("private message");
  },
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
