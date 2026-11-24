import { Suspense } from "react";
import { connection } from "next/server";

function readStock() {
  throw new Error("lab: 在庫 DB に接続できない");
}

function loadItem() {
  try {
    readStock();
  } catch (error) {
    throw new Error("lab: 商品の取得に失敗した", { cause: error });
  }
}

// リクエストのたびに描画し、その途中で cause 付きのエラーを投げる
async function Broken() {
  await connection();
  try {
    loadItem();
  } catch (error) {
    throw new Error("lab: ページの描画に失敗した", { cause: error });
  }
  return null;
}

export default function ServerCauseErrorPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>サーバーでの描画中に cause 付きで投げる</h1>
      <Suspense fallback={<p>読み込み中…</p>}>
        <Broken />
      </Suspense>
    </main>
  );
}
