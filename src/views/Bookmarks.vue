<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 mb-5 class="text-xs-center">
        <h1 class="title">
          <v-icon left>fas fa-bookmark</v-icon>书签
        </h1>
      </v-flex>
      <v-flex xs12 class="text-xs-center">
        <v-btn @click="$Bookmarks.reset()" color="red" v-if="bookmarks.length">
          <v-icon left>fas fa-trash</v-icon>清空
        </v-btn>
        <v-btn @click="refresh" color="green">
          <v-icon left>fas fa-sync</v-icon>刷新
        </v-btn>
        <v-btn @click="share" color="teal">
          <v-icon left>fas fa-copy</v-icon>复制
        </v-btn>
      </v-flex>
      <v-flex xs8 ma-2 v-for="(bookmark, i) in bookmarks" :key="i">
        <a :href="bookmark.url">{{ bookmark.name }}</a>
        <v-btn icon @click="$Bookmarks.remove(bookmark.id)">
          <v-icon small color="red">fas fa-trash</v-icon>
        </v-btn>
        <v-btn
          icon
          @click="$copy(`${hostURL}/bookmarks?bookmark=${btoa(JSON.stringify(bookmark))}`)"
        >
          <v-icon small>fas fa-copy</v-icon>
        </v-btn>
      </v-flex>
      <v-flex v-if="!bookmarks.length" my-5 class="text-xs-center">
        <h1 class="subheading">你还没有保存书签呢</h1>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Bookmarks from "../utils/bookmarks";

export default {
  name: "bookmarks",
  data() {
    return {
      bookmarks: []
    };
  },
  methods: {
    refresh() {
      this.bookmarks = Bookmarks.bookmarks;
    },
    share() {
      const data = Bookmarks.toString()
        .replace("+", "_")
        .replace(",", "-")
        .replace("/", ".");
      this.$copy(this.hostURL + "/bookmarks?bookmarks=" + data);
    },
    btoa(text) {
      return btoa(text);
    }
  },
  created() {
    this.$Bookmarks = Bookmarks;
    document.title = "Live Torrent - Bookmarks";
    const { bookmark, bookmarks } = this.$route.query;

    let bm = [],
      bms = [],
      bmsToAdd = [];

    // 确保所有查询都是数组形式
    if (Array.isArray(bookmark)) bm = bookmark;
    else bm = [bookmark];
    if (Array.isArray(bookmarks)) bms = bookmarks;
    else bms = [bookmarks];

    // add将每个书签放入书签数组
    bm.filter(a => a).forEach(b => {
      try {
        bmsToAdd.push(JSON.parse(atob(b)));
      } catch (e) {
        console.error(e);
      }
    });

    // 将书签集合中的书签添加到书签数组中
    bms
      .filter(a => a)
      .forEach(b => {
        try {
          b = b
            .replace("_", "+")
            .replace("-", "=")
            .replace(".", "/");
          console.log(b);
          b = JSON.parse(atob(b));
          b.forEach(a => bmsToAdd.push(a));
        } catch (e) {
          console.error(e);
        }
      });

    // 添加所有书签
    bmsToAdd.forEach(b => Bookmarks.add(b, false));
    Bookmarks.save();

    // 刷新书签
    this.refresh();
    Bookmarks.on("update", this.refresh);
  }
};
</script>

<style scoped>
a {
  color: #f2f2f2;
  text-decoration: none;
}
</style>
