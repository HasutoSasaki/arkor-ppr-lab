"use server";

export async function failingAction() {
  throw new Error("lab: Server Action で投げたエラー");
}
