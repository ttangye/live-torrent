<template>
  <v-layout align-center justify-center fill-height>
    <v-flex xs12>
      <v-layout row wrap>
        <v-flex xs12 mb-5>
          <h1
            class="text-xs-center text-uppercase font-weight-black"
            :class="[
              { 'display-2': $vuetify.breakpoint.mdAndUp },
              { 'display-1': $vuetify.breakpoint.smOnly }
            ]"
          >
            <span style="color: #d21414">
              <i class="fas fa-circle logo"></i>
              Live
            </span>
            Torrent
          </h1>
        </v-flex>
        <v-flex xs10 offset-xs1>
          <v-text-field
            v-model="query"
            label="搜索或torrentID"
            @keydown.enter="search"
            :error-messages="errors"
            :disabled="loading"
            solo
            light
            :loading="loading"
            persistent-hint
            hint="torrentID可以是magnet磁力链接，BT种子的HTTP/HTTPS网址链接或者是torrent的hash值"
            clearable
            :autofocus="!$vuetify.breakpoint.xsOnly"
          >
            <template v-slot:append>
              <v-btn icon @click="loadDemo" v-if="!query">
                <v-icon color="purple">fas fa-vial</v-icon>
              </v-btn>
              <v-btn icon @click="uploadTorrent" v-if="!query">
                <v-icon color="green">fas fa-upload</v-icon>
              </v-btn>
              <v-btn icon @click="search">
                <v-icon color="teal" v-if="validateQuery.isTorrentId"
                  >fas fa-eye</v-icon
                >
                <v-icon color="blue" v-else>fas fa-search</v-icon>
              </v-btn>
            </template>
          </v-text-field>
        </v-flex>

        <v-flex class="text-xs-center mt-5">
          <v-btn
            color="gray"
            href="https://18sui.net"
            target="blank"
          >
            <v-icon left>fas fa-exclamation-circle</v-icon>关于
          </v-btn>
          <v-btn
            color="blue"
            href="mailto:all@18sui.net?Subject=绅士云播反馈"
            target="blank"
          >
            <v-icon left>fas fa-comments</v-icon>联系我
          </v-btn>
        </v-flex>

        <v-flex xs10 offset-xs1 class="mt-5">
          <div class="mb-3">分享：</div>
          <share-buttons
            :url="hostURL"
            title="在线浏览，下载或观看磁力链接和BT种子文件"
            desc="绅士云播是一个Web应用程序，用于在线浏览，下载或观看磁力链接和BT种子文件"
          />
        </v-flex>
        <v-flex xs12 class="text-xs-center mt-5">
<!-- Kouzhao -->
<ins class="adsbygoogle"
   style="display:block"
   data-ad-client="ca-pub-5412472640367197"
   data-ad-slot="3059612064"
   data-ad-format="auto"
   data-full-width-responsive="true"></ins>
<script>
   (adsbygoogle = window.adsbygoogle || []).push({});
</script>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions } from "vuex";
import uploadTorrentFile from "../utils/uploadTorrentFile";

export default {
  name: "home",
  data() {
    return {
      loading: false,
      query: "",
      errors: ""
    };
  },
  methods: {
    ...mapActions(["loadTorrentInfo"]),
    search() {
      this.loading = true;
      this.errors = "";

      const { isEmpty, isTorrentId } = this.validateQuery;

      if (isEmpty) {
        this.errors = "请输入torrentID或者搜索关键词";
        this.loading = false;
      } else if (isTorrentId) {
        this.$router.push({
          name: "explorer",
          query: {
            torrentId: this.query
          }
        });
      } else {
        this.$router.push({
          name: "search",
          query: {
            query: this.query
          }
        });
      }
    },
    loadDemo() {
      this.query =
        "magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10";
    },
    uploadTorrent() {
      uploadTorrentFile.run(infoHash => {
        this.query = infoHash;
        window.sessionStorage["home-query"] = infoHash;
        this.search();
      });
    }
  },
  computed: {
    validateQuery() {
      const query = (this.query || "").trim();

      const isEmpty = query === "";
      const isMagnet = query.match(
        /^magnet:\?xt=urn:[a-z0-9]+:[a-f0-9]{40}(&.+=.+)*$/i
      );
      const isInfoHash = query.match(/^[a-f0-9]{40}$/i);
      const isTorrentFile = query.match(/^https?:\/\/.+\.torrent$/i);

      const isTorrentId = !isEmpty && (isMagnet || isInfoHash || isTorrentFile);

      const isSearchQuery = !isEmpty && !isTorrentId;

      return {
        isTorrentId,
        isMagnet,
        isInfoHash,
        isTorrentFile,
        isSearchQuery,
        isEmpty
      };
    }
  },
  watch: {
    query(n) {
      if (!n) n = "";
      if (n.indexOf("%3A") !== -1 || n.indexOf("%2F") !== -1)
        this.query = decodeURI(
          n
            .split("%3A")
            .join(":")
            .split("%2F")
            .join("/")
        );
      window.sessionStorage["home-query"] = n;
    }
  },
  created() {
    document.title = "绅士云播";
    const { query } = this.$route.query;
    if (query) {
      this.query = query;
      this.search();
    }
  },
  mounted() {
    this.query =
      window.sessionStorage["home-query"] || this.$route.query.query || "";
  }
};
</script>

<style scoped>
.v-messages {
  color: #eee !important;
}

.logo {
  animation: fade-in-out 2s ease-in-out infinite;
}

@keyframes fade-in-out {
  0% {
    opacity: 1;
  }
  10% {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }

  90% {
    opacity: 1;
  }
}
</style>
