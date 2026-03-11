import { NextResponse } from "next/server";
import pg from "pg";
import { readFileSync } from "fs";
import { join } from "path";

export async function POST(req: Request) {
  const { authorization } = Object.fromEntries(req.headers);
  if (authorization !== `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { password } = await req.json();
  if (!password) {
    return NextResponse.json({ error: "Password required" }, { status: 400 });
  }

  const ref = "tawdygpdsqdqryuqewim";

  // Try multiple connection formats
  const configs = [
    { label: "Direct", host: `db.${ref}.supabase.co`, port: 5432, user: "postgres", password, database: "postgres", ssl: { rejectUnauthorized: false } },
    { label: "Pooler session", host: `aws-0-us-east-1.pooler.supabase.com`, port: 5432, user: `postgres.${ref}`, password, database: "postgres", ssl: { rejectUnauthorized: false } },
    { label: "Pooler transaction", host: `aws-0-us-east-1.pooler.supabase.com`, port: 6543, user: `postgres.${ref}`, password, database: "postgres", ssl: { rejectUnauthorized: false } },
  ];

  const errors: string[] = [];
  let client: InstanceType<typeof pg.Client> | null = null;

  for (const config of configs) {
    const { label, ...pgConfig } = config;
    const c = new pg.Client({ ...pgConfig, connectionTimeoutMillis: 15000 });
    try {
      await c.connect();
      client = c;
      errors.push(`${label}: Connected!`);
      break;
    } catch (err: any) {
      errors.push(`${label}: ${err.message}`);
      try { await c.end(); } catch {}
    }
  }

  if (!client) {
    return NextResponse.json({ error: "All connections failed", details: errors }, { status: 500 });
  }

  try {
    const sqlPath = join(process.cwd(), "supabase/migrations/20240312_subscription_catalog.sql");
    const sql = readFileSync(sqlPath, "utf8");
    await client.query(sql);

    // Verify
    const result = await client.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('subscription_services', 'subscription_plans', 'user_subscriptions')
      ORDER BY table_name;
    `);

    const countResult = await client.query("SELECT count(*)::int as count FROM subscription_services");

    return NextResponse.json({
      success: true,
      tables: result.rows.map((r: any) => r.table_name),
      serviceCount: countResult.rows[0].count,
      connectionAttempts: errors,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message, connectionAttempts: errors }, { status: 500 });
  } finally {
    await client.end();
  }
}
