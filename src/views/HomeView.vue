<template>
  <div class="home">
    <select-username
      @selection="onUsernameSelection"
    />
  </div>
</template>

<script>
// @ is an alias to /src
import SelectUsername from '@/components/SelectUsername.vue'
import socket from "../socket";
export default {
  name: 'HomeView',
  components: {
    SelectUsername,
  },
  data() {
    return {
      usernameAlreadySelected: false,
    };
  },
  methods: {
    onUsernameSelection(username) {
      console.log(username)
      this.usernameAlreadySelected = true;
      socket.auth = { username }
      this.$router.push({ name: 'RoomsList'})
      // socket.auth = { username };
      // socket.connect();
    },
  },
  created() {
    // const sessionID = localStorage.getItem("sessionID");

    // if (sessionID) {
    //   this.usernameAlreadySelected = true;
    //   socket.auth = { sessionID };
    //   socket.connect();
    // }

    // socket.on("session", ({ sessionID, userID }) => {
    //   // attach the session ID to the next reconnection attempts
    //   socket.auth = { sessionID };
    //   // store it in the localStorage
    //   localStorage.setItem("sessionID", sessionID);
    //   // save the ID of the user
    //   socket.userID = userID;
    // });

    // socket.on("connect_error", (err) => {
    //   if (err.message === "invalid username") {
    //     this.usernameAlreadySelected = false;
    //   }
    // });
  },
};
</script>

<style>
body {
  margin: 0;
}

/* @font-face {
  font-family: Lato;
  src: url("/fonts/Lato-Regular.ttf");
} */

#app {
  font-family: Lato, Arial, sans-serif;
  font-size: 14px;
}
</style>

