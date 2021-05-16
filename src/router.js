import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Explorer from "./views/Explorer.vue";
import Player from "./views/Player.vue";
import Search from "./views/Search.vue";
import Movies from "./views/movies/Movies.vue";
import Movie from "./views/movies/Movie.vue";
import Bookmarks from "./views/Bookmarks.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "主页",
      component: Home
    },
    {
      path: "/explorer",
      name: "解析",
      component: Explorer
    },
    {
      path: "/player",
      name: "播放页",
      component: Player
    },
    {
      path: "/search",
      name: "搜索",
      component: Search
    },
    {
      path: "/movies",
      name: "观影团",
      component: Movies
    },
    {
      path: "/movies/:id",
      name: "电影详情",
      component: Movie
    },
    {
      path: "/bookmarks",
      name: "收藏夹",
      component: Bookmarks
    },
    {
      path: "/about",
      name: "关于",
      component: () => import("./views/About.vue")
    },
    {
      path: "*",
      component: () => import("./views/NotFound.vue")
    }
  ]
});
