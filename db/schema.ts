import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// Only aggregate counters are stored. Notes, workshop data and IPs stay out of D1.
export const modelBudget = sqliteTable("model_budget", {
  id: integer("id").primaryKey(),
  total: integer("total").notNull(),
  day: text("day").notNull(),
  daily: integer("daily").notNull(),
});
