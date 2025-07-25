import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleHttp } from "drizzle-orm/neon-http";
import { drizzle as drizzleSocket } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

import * as schema from "~/server/db/index";


neonConfig.webSocketConstructor = ws;

const sqlHttp = neon(process.env.DATABASE_URI!);
export const db = drizzleHttp(sqlHttp, { schema });

const sqlSocket = new Pool({ connectionString: process.env.DATABASE_URI! });
export const dbSocket = drizzleSocket(sqlSocket, { schema });
