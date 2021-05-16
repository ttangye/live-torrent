/* eslint-disable no-console */

import { register } from "register-service-worker";

if (process.env.NODE_ENV === "production") {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log(
        "应用程序正在由服务工作者从缓存中提供。\n" +
          "有关更多详细信息，请访问 https://18sui.net"
      );
    },
    registered() {
      console.log("服务人员已注册。");
    },
    cached() {
      console.log("内容已缓存以供脱机使用。");
    },
    updatefound() {
      console.log("正在下载新内容。");
    },
    updated() {
      console.log("有新内容可用； 请刷新。");
    },
    offline() {
      console.log(
        "找不到互联网连接。 应用正在离线模式下运行。"
      );
    },
    error(error) {
      console.error("服务人员注册期间发生错误：", error);
    }
  });
}
