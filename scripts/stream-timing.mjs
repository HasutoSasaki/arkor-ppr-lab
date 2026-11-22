// 使い方: node scripts/stream-timing.mjs <URL> [--no-navigate]
// レスポンスの本文を届いた順に読み、断片ごとの到着時刻と、含まれる部分を表示する
//
// fetch() は sec-fetch-mode を上書きするので、ヘッダーをそのまま送れる node:http(s) を使う
import http from "node:http";
import https from "node:https";
import zlib from "node:zlib";

const url = process.argv[2];
if (!url) {
  console.error("usage: node scripts/stream-timing.mjs <URL> [--no-navigate]");
  process.exit(1);
}
const navigate = !process.argv.includes("--no-navigate");

const markers = ["static", "cached", "fallback", "dynamic"];
const start = performance.now();
const elapsed = () => `${Math.round(performance.now() - start)}ms`.padStart(7);

const headers = { accept: "text/html", "accept-encoding": "br, gzip" };
if (navigate) {
  // ブラウザがページを開くときに送るヘッダー
  headers["sec-fetch-dest"] = "document";
  headers["sec-fetch-mode"] = "navigate";
}

const client = url.startsWith("https:") ? https : http;
client
  .get(url, { headers }, (res) => {
    console.log(`${elapsed()}  ヘッダー受信 status=${res.statusCode}`);
    for (const name of ["x-arkor-edge", "x-nextjs-postponed", "cache-control", "content-encoding"]) {
      if (res.headers[name]) console.log(`         ${name}: ${res.headers[name]}`);
    }

    const encoding = res.headers["content-encoding"];
    const flush = { flush: zlib.constants.Z_SYNC_FLUSH, finishFlush: zlib.constants.Z_SYNC_FLUSH };
    const body =
      encoding === "br"
        ? res.pipe(zlib.createBrotliDecompress())
        : encoding === "gzip"
          ? res.pipe(zlib.createGunzip(flush))
          : res;

    const decoder = new TextDecoder();
    let index = 0;
    body.on("data", (chunk) => {
      const text = decoder.decode(chunk, { stream: true });
      const found = markers.filter((m) => text.includes(`data-part="${m}"`));
      index += 1;
      console.log(
        `${elapsed()}  断片${index} ${String(chunk.length).padStart(6)}B  含まれる部分: ${found.join(", ") || "-"}`,
      );
    });
    body.on("end", () => console.log(`${elapsed()}  レスポンス終了`));
  })
  .on("error", (error) => {
    console.error(error);
    process.exit(1);
  });
