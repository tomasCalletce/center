import { pgTable, timestamp, varchar, pgEnum, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const documentStatusEnum = z.enum(["PENDING", "APPROVED", "REJECTED"]);
export const documentStatusValues = documentStatusEnum.Values;
export const documentStatusEnumSchema = pgEnum("document_status", [
  "PENDING",
  "APPROVED",
  "REJECTED",
]);

export const documentTypeEnum = z.enum(["CV"]);
export const documentTypeValues = documentTypeEnum.Values;
export const documentTypeEnumSchema = pgEnum("document_type", ["CV"]);

export const fileTypeEnum = z.enum(["application/pdf"]);
export const fileTypeValues = fileTypeEnum.Values;
export const fileTypeEnumSchema = pgEnum("file_type", ["application/pdf"]);

export const documents = pgTable("documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  _clerk: varchar("_user", { length: 32 }).notNull(),
  pathname: varchar("pathname", { length: 255 }).notNull(),
  type: documentTypeEnumSchema("type").notNull(),
  fileType: fileTypeEnumSchema("file_type").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const verifyDocumentsSchema = createInsertSchema(documents).omit({
  id: true,
  _clerk: true,
  created_at: true,
  updated_at: true,
});
