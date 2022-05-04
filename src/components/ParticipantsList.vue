<template>
  <div class="room">
    <div class="description">
      <div class="name">
        {{ room.name }} {{room.id}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ParticipantsList",
  props: {
    room: Object,
  },
  methods: {

  },
  computed: {
  },
};
</script>

<style scoped>
.selected {
  background-color: #1164a3;
}

.room {
  padding: 10px;
  cursor: pointer;
}

.description {
  display: inline-block;
}

.status {
  color: #92959e;
}

.new-messages {
  color: white;
  background-color: red;
  width: 20px;
  border-radius: 5px;
  text-align: center;
  float: right;
  margin-top: 10px;
}
</style>
