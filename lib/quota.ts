export const DAILY_CALL_LIMIT = 100;
export const TOTAL_CALL_LIMIT = 300;

// One atomic statement reserves a request across all Worker instances. Failed
// provider calls still count, and neither a new day nor a deploy resets total.
export const RESERVE_CALL_SQL = `
INSERT INTO model_budget (id, total, day, daily) VALUES (1, 1, ?, 1)
ON CONFLICT(id) DO UPDATE SET
  total = model_budget.total + 1,
  day = excluded.day,
  daily = CASE WHEN model_budget.day = excluded.day
    THEN model_budget.daily + 1 ELSE 1 END
WHERE model_budget.total < ?
  AND (model_budget.day <> excluded.day OR model_budget.daily < ?)
RETURNING total, daily`;

export interface QuotaDatabase {
  prepare(sql: string): {
    bind(...values: (string | number)[]): {
      first<T>(): Promise<T | null>;
    };
  };
}

export async function reserveModelCall(db: QuotaDatabase | undefined, now = new Date()) {
  if (!db) throw new Error("The shared demo request counter is unavailable. No model call was made.");
  return db.prepare(RESERVE_CALL_SQL)
    .bind(now.toISOString().slice(0, 10), TOTAL_CALL_LIMIT, DAILY_CALL_LIMIT)
    .first<{ total: number; daily: number }>();
}
