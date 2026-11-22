// 使い方: node scripts/stream-timing.mjs <URL>
// レスポンスの本文を届いた順に読み、断片ごとの到着時刻と、含まれる部分を表示する
const url = process.argv[2];
if (!url) {
  console.error("usage: node scripts/stream-timing.mjs <URL>");
  process.exit(1);
}

const markers = ["static", "cached", "fallback", "dynamic"];
const start = performance.now();
const elapsed = () => `${Math.round(performance.now() - start)}ms`.padStart(7);

// ブラウザがページを開くときに送るヘッダーを付ける
const response = await fetch(url, {
  headers: {
    accept: "text/html",
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
  },
});

console.log(`${elapsed()}  ヘッダー受信 status=${response.status}`);
for (const name of ["x-arkor-edge", "x-nextjs-postponed", "cache-control", "content-encoding"]) {
  const value = response.headers.get(name);
  if (value) console.log(`         ${name}: ${value}`);
}

const decoder = new TextDecoder();
let index = 0;
for await (const chunk of response.body) {
  const text = decoder.decode(chunk, { stream: true });
  const found = markers.filter((m) => text.includes(`data-part="${m}"`));
  index += 1;
  console.log(
    `${elapsed()}  断片${index} ${String(chunk.length).padStart(6)}B  含まれる部分: ${found.join(", ") || "-"}`,
  );
}
console.log(`${elapsed()}  レスポンス終了`);
