<template>
  <v-layout fill-height justify-center align-center>
    <v-flex xs12 class="text-xs-center">
      <v-btn color="primary" to="/">
        <v-icon left>fas fa-home</v-icon>主页
      </v-btn>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: "notfound",
  created() {
    document.title = "绅士云播 - Error 404";
    this.Swal.fire({
      title: "Error 404",
      text: "Page Not Found!",
      type: "error",
      confirmButtonText: "返回"
    }).then(() => this.$router.push({ name: "home" }));
  }
};
</script>
