<template>
  <div>
    {{ roomID }}
    <div class="left-panel">
     <li v-for="user in this.users" :key="user._id">
    {{ user.username }}
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
    onCodeChange(newCode) {
        socket.emit("code-change", newCode)
    }
  },
  mounted() { 
    this.roomID = this.$route.params.id;
    // console.log(typeof socket.auth)
    if(typeof socket.auth === 'undefined')
      this.$router.push('/')


    this.username = socket.auth.userInfo.username;
    socket.emit("join-room", this.roomID, ({usersList, code}) => {
        this.users = usersList;
        if(code && code.length > 0)
          this.initCode = code;
    });

    // socket.on("usersList", (users) => {
    //     this.users = users
    // });

    socket.on("user-joined", (user) => {
        this.users.push(user)
    });

    socket.on("user-left", (user) => {
        this.users = this.users.filter((name) => name._id !== user._id)
    });

    socket.on("code-reflect", (data) => {
        // update code
        console.log(data)
        this.initCode = data.newCode
        console.log(data.username + " just changed the code")
    })
  },
  beforeUnmount() {
      socket.emit("leave-room");
      console.log("left", this.roomID)
      socket.off("user-joined")
      socket.off("user-left")
      socket.off("code-reflect")
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
