<template color="#445064">
  <v-container fluid class="text-xs-center">
    <v-layout justify-center :align-center="$vuetify.breakpoint.mdAndUp" fill-height>
      <v-flex xs12 md10>
        <h1 class="title my-5">关于绅士云播</h1>

        <p>绅士云播的创建是为了在线探索，共享和播放磁力链接及BT种子文件。</p>
        <p>
          后端基于
          <a href="https://webtorrent.io">webtorrent</a>源码。
        </p>
        <p>
          视频播放器基于
          <a href="https://plyr.io">Plyr.js</a>.
        </p>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: "about",
  created() {
    document.title = "关于 - 绅士云播";
  }
};
</script>
