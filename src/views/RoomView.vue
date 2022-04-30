<template>
  <div>
    {{ roomID }}
    <div class="left-panel">
     <li v-for="user in this.users" :key="user">
    {{ user }}
  </li>
      <!-- <participants-list
        v-for="user in users"
        :key="user.userID"
        :user="user.username"
      /> -->
    </div>
    <div class="right-panel">
      <code-panel :textCode="initCode" @codeChange="onCodeChange"/>  
    </div>
  </div>
</template>

<script>
import socket from "../socket";
// import ParticipantsList from '@/components/ParticipantsList.vue'
import CodePanel from "@/components/CodePanel.vue";

export default {
    name: "RoomView",
    components: { CodePanel },
  data() {
    return {
        initCode: "",
        username: null,
        roomID: null,
      users: [],
    };
  },
  methods: {
    onCodeChange(data) {
        socket.emit("code-change",this.roomID, data)
        // console.log(data.code)
    }
  },
  mounted() { 
    this.roomID = this.$route.params.id;
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

    socket.on("code-reflect", (data) => {
        // update code
        this.initCode = data.newCode
    })
  },
  unmounted() {
      socket.emit("leave-room". socket.id, this.roomID);
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
  height: 100vh;
}
</style>
