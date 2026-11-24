import { Suspense } from "react";
import { connection } from "next/server";

// リクエストのたびに描画し、その途中でエラーを投げる
async function Broken() {
  await connection();
  throw new Error("lab: サーバーでの描画中に投げたエラー");
  return null;
}

export default function ServerErrorPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>サーバーでの描画中に投げる</h1>
      <Suspense fallback={<p>読み込み中…</p>}>
        <Broken />
      </Suspense>
    </main>
  );
}
