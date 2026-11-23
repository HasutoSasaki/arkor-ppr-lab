import { Suspense } from "react";
import { cacheLife, cacheTag } from "next/cache";
import { cookies } from "next/headers";
import styles from "./page.module.css";

// 全員に同じ内容。結果はキャッシュされ、static shell に含まれる
async function getItems() {
  "use cache";
  cacheLife("hours");
  cacheTag("items");
  return {
    generatedAt: new Date().toISOString(),
    items: ["りんご", "みかん", "ぶどう"],
  };
}

async function CachedItems() {
  const { generatedAt, items } = await getItems();
  return (
    <section className={styles.box} data-part="cached">
      <h2>キャッシュされる部分（use cache）</h2>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p>
        生成時刻: <code>{generatedAt}</code>
      </p>
    </section>
  );
}

// リクエストごとに変わる内容。わざと 3 秒待ってから返す
async function RequestTimePart() {
  const cookieStore = await cookies();
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return (
    <section className={styles.box} data-part="dynamic">
      <h2>リクエストごとに変わる部分（cookies）</h2>
      <p>
        描画時刻: <code>{new Date().toISOString()}</code>
      </p>
      <p>
        cookie の数: <code>{cookieStore.getAll().length}</code>
      </p>
    </section>
  );
}

function RequestTimeFallback() {
  return (
    <section className={styles.box} data-part="fallback">
      <h2>リクエストごとに変わる部分（cookies）</h2>
      <p>読み込み中…（fallback）</p>
    </section>
  );
}

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 data-part="static">PPR の確認ページ</h1>
      <CachedItems />
      <Suspense fallback={<RequestTimeFallback />}>
        <RequestTimePart />
      </Suspense>
    </main>
  );
}
