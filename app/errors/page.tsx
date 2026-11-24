import Link from "next/link";
import { ClientErrorButtons } from "./client-error-buttons";

// エラー監視の確認用ページ。わざとエラーを起こす入口をまとめる
export default function ErrorsPage() {
  return (
    <main style={{ padding: 24, display: "grid", gap: 16, maxWidth: 640 }}>
      <h1>エラー監視の確認ページ</h1>

      <section>
        <h2>サーバー側</h2>
        <ul>
          <li>
            <Link href="/errors/server" prefetch={false}>
              サーバーでの描画中に投げる
            </Link>
          </li>
          <li>
            <Link href="/errors/server-cause" prefetch={false}>
              サーバーでの描画中に cause 付きで投げる
            </Link>
          </li>
        </ul>
      </section>

      <section>
        <h2>ブラウザ側</h2>
        <ClientErrorButtons />
      </section>
    </main>
  );
}
