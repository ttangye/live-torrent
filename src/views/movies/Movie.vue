<template>
  <v-container fluid fill-height style="overflow: hidden">
    <v-layout raw wrap v-if="movie">
      <v-flex xs12 class="my-5 text-xs-center">
        <h1>
          {{ movie.title }}
          <bookmark-button
            v-if="movie"
            :bookmarkInfo="{
          name: `${movie.title} (${movie.year}) - 电影页面`,
          id: `movie::${movie.imdb_code}`,
          url: window.location.href
          }"
          />
        </h1>
      </v-flex>
      <v-flex xs12 sm6 md5 lg3 offset-lg1>
        <v-img
          :src="movie.large_cover_image"
          :lazy-src="movie.small_cover_image"
          min-height="400px"
        >
          <template v-slot:placeholder>
            <v-layout fill-height align-center justify-center ma-0>
              <v-progress-circular indeterminate color="blue"></v-progress-circular>
            </v-layout>
          </template>
        </v-img>
      </v-flex>
      <v-flex xs12 :mt-5="$vuetify.breakpoint.xsOnly" sm6 md5 offset-md2>
        <v-expansion-panel
          :popout="$vuetify.breakpoint.mdAndUp || $vuetify.breakpoint.xsOnly"
          :inset="$vuetify.breakpoint.smOnly"
          light
          :value="0"
        >
          <v-expansion-panel-content>
            <template v-slot:header>
              <div class="title">
                <v-icon left>fas fa-info-circle</v-icon>信息
              </div>
            </template>
            <v-card>
              <v-card-text>
                <div>语言: {{ movie.language }}</div>
                <div>MPA评分: {{ movie.mpa_rating || 'Unknown' }}</div>
                <div>IMDB码: {{ movie.imdb_code }}</div>
                <div>发行年份: {{ movie.year }}</div>
                <div>评分: {{ movie.rating }} / 10</div>
                <div>
                  体裁:
                  <span v-for="(g, i) in movie.genres" :key="i" class="mx-1">{{ g }}</span>
                </div>
                <div>观看: {{ movie.runtime }}</div>
                <div>下载: {{ movie.download_count }}</div>
                <div>上传于: {{ movie.date_uploaded }}</div>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel
          :popout="$vuetify.breakpoint.mdAndUp || $vuetify.breakpoint.xsOnly"
          :inset="$vuetify.breakpoint.smOnly"
          light
        >
          <v-expansion-panel-content>
            <template v-slot:header>
              <div class="title">
                <v-icon left>fas fa-align-left</v-icon>描述
              </div>
            </template>
            <v-card>
              <v-card-text>{{ movie.description_full }}</v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel
          :popout="$vuetify.breakpoint.mdAndUp || $vuetify.breakpoint.xsOnly"
          :inset="$vuetify.breakpoint.smOnly"
          light
        >
          <v-expansion-panel-content>
            <template v-slot:header>
              <div class="title">
                <v-icon left>fas fa-mask</v-icon>演员表
              </div>
            </template>
            <v-card>
              <v-card-text>
                <v-list two-line>
                  <v-list-tile v-for="cast in movie.cast" :key="cast.imdb_code" avatar>
                    <v-list-tile-avatar>
                      <img :src="cast.url_small_image" v-if="cast.url_small_image" />
                      <v-icon v-else>fas fa-user-alt</v-icon>
                    </v-list-tile-avatar>

                    <v-list-tile-content>
                      <v-list-tile-title>{{ cast.name }} - IMDB码: {{ cast.imdb_code }}</v-list-tile-title>
                      <v-list-tile-sub-title>{{ cast.character_name }}</v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </v-list>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel
          :popout="$vuetify.breakpoint.mdAndUp || $vuetify.breakpoint.xsOnly"
          :inset="$vuetify.breakpoint.smOnly"
          light
        >
          <v-expansion-panel-content>
            <template v-slot:header>
              <div class="title">
                <v-icon left>fas fa-film</v-icon>YTS
              </div>
            </template>
            <v-card>
              <v-card-text>
                <div>YTS码: {{ movie.yt_trailer_code }}</div>
                <div>
                  在YTS上观看
                  <a :href="movie.url" target="blank">点我</a>.
                </div>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel
          :popout="$vuetify.breakpoint.mdAndUp || $vuetify.breakpoint.xsOnly"
          :inset="$vuetify.breakpoint.smOnly"
          light
        >
          <v-expansion-panel-content>
            <template v-slot:header>
              <div class="title">
                <v-icon left>fas fa-share-alt</v-icon>分享
              </div>
            </template>
            <v-card>
              <v-card-text>
              <share-buttons
                :title="`Watch for free '${movie.title_long}' movie`"
                :desc="`Watch for free '${movie.title_long}' movie`"
              />
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel
          :popout="$vuetify.breakpoint.mdAndUp || $vuetify.breakpoint.xsOnly"
          :inset="$vuetify.breakpoint.smOnly"
          light
        >
          <v-expansion-panel-content>
            <template v-slot:header>
              <div class="title">
                <v-icon left>fas fa-closed-captioning</v-icon>字幕
              </div>
            </template>
            <v-card>
              <v-card-text style="text-wrap: wrap;">
                <div v-if="loadingCaptions">加载中...</div>
                <div v-else-if="!captions.length">找不到这部电影的字幕。</div>
                <div v-else>
                  <a
                    :href="c.utf8"
                    :download="c.filename"
                    target="blank"
                    v-for="(c, i) in captions"
                    :key="i"
                    style="margin: 5px; display: inline-block"
                  >{{ c.lang }}</a>.
                </div>
                <hr />
                <div>
                  您可以制作字幕并将其上传到
                  <a
                    href="https://opensubtitles.org"
                    title="open subtitles"
                  >opensubtitles.org</a>
                </div>
                <div>
                  您可以使用
                  <a href="https://amara.org/en/" title="amara subtitle editor">Amara</a>在线编辑制作字幕。
                </div>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>

      <v-flex xs12 md10 offset-md1 mt-5>
        <h1 class="title mb-4">预告片：</h1>
        <div class="my-3 text-xs-center">
          <v-btn
            tag="a"
            target="_blank"
            :href="`https://www.youtube.com/search?q=${movie.title} ${movie.year} trailer`"
            color="red"
          >
            <v-icon left>fab fa-youtube</v-icon>在YouTube上搜索预告片。
          </v-btn>
          <v-btn tag="a" target="_blank" :href="trailer" color="red" v-if="trailer">
            <v-icon left>fab fa-youtube</v-icon>在YouTube上观看预告片
          </v-btn>
        </div>
        <div id="player" data-plyr-provider="youtube" :data-plyr-embed-id="trailer" v-if="trailer"></div>
      </v-flex>

      <v-flex xs12 mt-5>
        <h1 class="title mb-4">截图：</h1>
        <v-carousel>
          <v-carousel-item contain :src="movie.large_screenshot_image1"></v-carousel-item>
          <v-carousel-item contain :src="movie.large_screenshot_image2"></v-carousel-item>
          <v-carousel-item contain :src="movie.large_screenshot_image3"></v-carousel-item>
        </v-carousel>
      </v-flex>

      <v-flex xs12 mt-5>
        <h1 class="subheading">种子:</h1>

        <v-layout raw wrap>
          <v-flex xs12 md6 xl4 v-for="torrent in movie.torrents" :key="torrent.hash">
            <v-card dark color="#445064" class="ma-2">
              <v-card-title class="title">
                {{ torrent.type }} - {{ torrent.quality }} - {{ torrent.size }} -
                <span
                  class="subheading grey--text ml-1"
                >{{ torrent.date_uploaded }}</span>
              </v-card-title>

              <v-card-text>
                播种/同行: {{ torrent.seeds }}/{{ torrent.peers }}
                <v-text-field label="Hash" :value="torrent.hash" readonly>
                  <template v-slot:append>
                    <v-btn icon @click="$copy(torrent.hash)">
                      <v-icon small>fas fa-copy</v-icon>
                    </v-btn>
                  </template>
                </v-text-field>

                <v-text-field
                  label="Stream"
                  :value="`${hostURL}/api/torrent/serve/${torrent.hash}/:video`"
                  readonly
                >
                  <template v-slot:append>
                    <v-btn
                      icon
                      @click="$copy(`${hostURL}/api/torrent/serve/${torrent.hash}/:video`)"
                    >
                      <v-icon small>fas fa-copy</v-icon>
                    </v-btn>
                  </template>
                </v-text-field>

                <v-btn color="green" tag="a" :href="torrent.url">下载种子(.torrent)</v-btn>
                <v-btn
                  color="purple"
                  tag="a"
                  :href="`${hostURL}/player?torrentId=${torrent.hash}&caption=imdbid::${movie.imdb_code}`"
                >观看视频</v-btn>
                <v-btn
                  color="blue"
                  tag="a"
                  :href="`${hostURL}/explorer?torrentId=${torrent.hash}`"
                >在线解析</v-btn>
                <v-btn
                  color="orange"
                  tag="a"
                  target="_blank"
                  :download="`${movie.slug}.mp4`"
                  :href="`${hostURL}/api/torrent/serve/${torrent.hash}/:video`"
                >下载视频(.mp4)</v-btn>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>

      <v-flex xs12 mt-5 v-if="movie.suggestedMovies">
        <h1 class="subheading">猜你喜欢：</h1>

        <v-layout raw wrap mt-5>
          <v-flex
            xs6
            sm4
            md3
            lg3
            xl4
            v-for="suggestedMovie in movie.suggestedMovies"
            :key="suggestedMovie.id"
            class="pa-2 pb-4"
          >
            <movie-card :movie="suggestedMovie" />
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
import MovieCard from "../../components/MovieCard";
import { loadCaptions } from "../../utils/axios";
import BookmarkButton from "../../components/BookmarkButton";

export default {
  name: "movie",
  components: {
    MovieCard,
    BookmarkButton
  },
  data() {
    return {
      movie: null,
      captions: [],
      loadingCaptions: false,
      trailer: null,
      bookmarkInfo: {
        id: "",
        name: "",
        url: ""
      }
    };
  },
  methods: {
    ...mapActions(["loadMoviePage"]),
    buildCaptionsQuery() {
      const { captions } = this;
      if (!captions.length) return "";
      let c = captions
        .map(c => `caption=url::${c.lang}::${c.langcode}::${c.utf8}`)
        .join("&");
      if (c.length) return "&" + c;
      return "";
    }
  },
  watch: {
    movie(n) {
      document.title = "绅士云播 - 电影详情页 - " + n.title_long;
    }
  },
  created() {
    const { id } = this.$route.params;
    this.loadingCaptions = true;

    this.loadMoviePage(id)
      .then(movie => (this.movie = movie))
      .then(movie => {
        window
          .movieTrailer(movie.title, movie.year)
          .then(url => (this.trailer = url))
          .catch(err => console.error(err));
        return movie;
      })
      .then(movie => {
        return loadCaptions(movie.imdb_code)
          .then(res => (this.captions = res.data))
          .catch(err => console.error(err))
          .finally(() => {
            this.loadingCaptions = false;
            if (this.captions) {
              this.captions = Object.values(this.captions);
            }
          });
      })
      .catch(err => console.error(err))
      .finally(() => {
        const controls = [
          "play-large", // The large play button in the center
          "rewind", // Rewind by the seek time (default 10 seconds)
          "play", // Play/pause playback
          "fast-forward", // Fast forward by the seek time (default 10 seconds)
          "progress", // The progress bar and scrubber for playback and buffering
          "current-time", // The current time of playback
          "duration", // The full duration of the media
          "mute", // Toggle mute
          "volume", // Volume control
          "settings", // Settings menu
          "fullscreen" // Toggle fullscreen
        ];

        const player = new window.Plyr("#player", {
          controls
        });

        // pause the video while playing on click
        // for more info https://github.com/sampotts/plyr/issues/718#issuecomment-451906473
        const { wrapper, container } = player.elements;
        if (!container || !wrapper) return;
        if (!container._clickListener) {
          container._clickListener = event => {
            const targets = [container, wrapper];

            // Ignore if click if not container or in video wrapper
            if (
              !targets.includes(event.target) &&
              !wrapper.contains(event.target)
            ) {
              return;
            }

            if (player.touch) player.togglePlay();
          };
          container.addEventListener("click", container._clickListener);
        }
        // end //
      });
  }
};
</script>
