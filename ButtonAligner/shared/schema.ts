import { sql } from "drizzle-orm";
import { pgTable, text, varchar, real, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Aviation Financial Analysis Schema
export const financialAnalyses = pgTable("financial_analyses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  oemPN: text("oem_pn"),
  devPartner: text("dev_partner"),
  salesDirector: text("sales_director"),
  
  // Cost Breakdowns (NRE)
  oemCost: real("oem_cost").notNull().default(3715),
  oemQty: real("oem_qty").notNull().default(3),
  matInspect: real("mat_inspect").notNull().default(1400),
  laborHours: real("labor_hours").notNull().default(24),
  laborRate: real("labor_rate").notNull().default(100),
  pmaFee: real("pma_fee").notNull().default(8000),
  derFee: real("der_fee").notNull().default(0),
  
  // Revenue & Margin
  sp: real("sell_price").notNull().default(1875), // sell price
  cp: real("cost_price").notNull().default(1125), // cost price
  qty: real("quantity").notNull().default(30), // annual quantity
  
  // Ramp & Terminal
  rr1: real("ramp_rate_y1").notNull().default(23),
  rr2: real("ramp_rate_y2").notNull().default(35),
  rr3: real("ramp_rate_y3").notNull().default(53),
  rr4: real("ramp_rate_y4").notNull().default(55),
  rr5: real("ramp_rate_y5").notNull().default(55),
  terminalMultiple: real("terminal_multiple").notNull().default(7),
  useTV: boolean("use_terminal_value").notNull().default(true),
  discount: real("discount_rate").notNull().default(10),
  
  // Criteria
  thrNPV: real("threshold_npv").notNull().default(0),
  thrIRR: real("threshold_irr").notNull().default(20),
  thrPBP: real("threshold_pbp").notNull().default(4.3),
  
  notes: text("notes"),
  
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const insertFinancialAnalysisSchema = createInsertSchema(financialAnalyses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertFinancialAnalysis = z.infer<typeof insertFinancialAnalysisSchema>;
export type FinancialAnalysis = typeof financialAnalyses.$inferSelect;

// Financial calculation results type
export interface FinancialResults {
  oemInv: number;
  laborCost: number;
  nre: number;
  estAnnualSales: number;
  unitMargin: number;
  estAnnualMargin: number;
  flows: number[];
  tv: number; // terminal value
  disc: number; // discount rate
  qty: number;
  sp: number;
  npvVal: number;
  irrVal: number;
  pbpVal: number;
  passNPV: boolean;
  passIRR: boolean;
  passPBP: boolean;
  passes: number;
  status: 'GREEN' | 'YELLOW' | 'RED';
}
