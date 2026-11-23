import { connection } from "next/server";

export async function GET() {
  await connection();
  throw new Error("lab: Route Handler で投げたエラー");
}
