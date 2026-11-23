"use client";

import { useState } from "react";
import { failingAction } from "./actions";

function parseSetting(text: string) {
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error("lab: 設定の読み込みに失敗した", { cause: error });
  }
}

export function ClientErrorButtons() {
  const [message, setMessage] = useState("");

  return (
    <div style={{ display: "grid", gap: 8, justifyItems: "start" }}>
      <button
        data-test="uncaught"
        onClick={() => {
          console.log("lab: 未捕捉エラーのボタンを押した");
          throw new Error("lab: ボタンで投げた未捕捉エラー");
        }}
      >
        未捕捉エラーを投げる
      </button>

      <button
        data-test="rejection"
        onClick={() => {
          void Promise.reject(new Error("lab: 処理されない Promise の拒否"));
        }}
      >
        処理されない Promise の拒否を起こす
      </button>

      <button
        data-test="cause"
        onClick={() => {
          try {
            parseSetting("{壊れた JSON");
          } catch (error) {
            throw new Error("lab: 画面の初期化に失敗した", { cause: error });
          }
        }}
      >
        cause 付きのエラーを投げる
      </button>

      <button
        data-test="caught"
        onClick={() => {
          try {
            throw new Error("lab: try/catch で捕捉したエラー");
          } catch (error) {
            setMessage(`捕捉した: ${(error as Error).message}`);
          }
        }}
      >
        try/catch で捕捉するエラーを投げる
      </button>

      <button
        data-test="fetch-api"
        onClick={async () => {
          const response = await fetch("/errors/api");
          setMessage(`/errors/api の応答: ${response.status}`);
        }}
      >
        エラーを投げる Route Handler を fetch する
      </button>

      <button
        data-test="action"
        onClick={async () => {
          await failingAction();
        }}
      >
        エラーを投げる Server Action を呼ぶ
      </button>

      <p data-test="message">{message}</p>
    </div>
  );
}
