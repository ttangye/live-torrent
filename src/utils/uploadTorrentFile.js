import Swal from "./sweetalert2";
import ParseTorrent from "parse-torrent";

class TorrentFileUploader {
  constructor() {
    this.dom = null;
    this._build();
    this.onupload = () => {};
  }

  _build(parent = document.body) {
    const dom = document.createElement("input");
    dom.type = "file";
    dom.accept = ".torrent";
    dom.style.display = "none";
    dom.onchange = this._handler.bind(this);
    parent.append(dom);
    this.dom = dom;
  }

  run(cb = () => {}) {
    this.onupload = cb;
    this.dom.click();
  }

  _clean() {
    this.dom.remove();
  }

  _handler(event) {
    const files = event.target.files;

    if (files.length === 0) return;
    else if (files.length !== 1)
      Swal.fire("上传失败！", "所选文件不是种子文件", "错误");

    if (files[0].type !== "application/x-bittorrent")
      Swal.fire(
        "上传失败！",
        "所选文件不是种子文件",
        "错误"
      );

    this._readTorrentFile(files[0]);
    this._clean();
  }

  _readTorrentFile(file) {
    ParseTorrent.remote(file, (err, torrent) => {
      if (err) {
        console.error(err);
        Swal.fire(
          "上传失败！",
          "所选文件不是种子文件",
          "错误"
        );
      } else {
        this.onupload(torrent.infoHash);
      }
    });
  }
}

export default new TorrentFileUploader();
