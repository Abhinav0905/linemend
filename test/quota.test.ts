import test from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";
import { RESERVE_CALL_SQL, reserveModelCall } from "../lib/quota.ts";

test("shared SQL budget stops concurrent reservations at the daily cap", async () => {
  const db = new DatabaseSync(":memory:");
  db.exec(readFileSync(new URL("../drizzle/0000_model_budget.sql", import.meta.url), "utf8"));
  const statement = db.prepare(RESERVE_CALL_SQL);
  const responses = await Promise.all(Array.from({ length: 120 }, async () => statement.get("2026-10-29", 300, 100)));
  assert.equal(responses.filter(Boolean).length, 100);
  assert.equal(db.prepare("SELECT total FROM model_budget").get()?.total, 100);
  db.close();
});

test("a new day refreshes the daily quota but preserves the lifetime cap", () => {
  const db = new DatabaseSync(":memory:");
  db.exec(readFileSync(new URL("../drizzle/0000_model_budget.sql", import.meta.url), "utf8"));
  const statement = db.prepare(RESERVE_CALL_SQL);
  for (const day of ["2026-10-29", "2026-10-30", "2026-10-31"]) {
    for (let i = 0; i < 100; i++) assert.ok(statement.get(day, 300, 100));
    assert.equal(statement.get(day, 300, 100), undefined);
  }
  assert.equal(statement.get("2026-11-01", 300, 100), undefined);
  assert.equal(db.prepare("SELECT total FROM model_budget").get()?.total, 300);
  db.close();
});

test("missing durable storage fails closed before inference", async () => {
  await assert.rejects(reserveModelCall(undefined), /No model call was made/);
});
