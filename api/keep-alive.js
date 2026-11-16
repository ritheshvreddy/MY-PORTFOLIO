/*
  Vercel version of the Supabase keep-alive.
  Vercel Cron calls this daily (see "crons" in vercel.json).
  On Netlify, netlify/functions/keep-alive.mjs does the same job.

  Optional: set CRON_SECRET in Vercel. Vercel Cron then sends it
  automatically and other callers are rejected.
*/

import { pingSupabase } from "../server/supabaseKeepAlive.js";

export async function GET(request) {
  const secret = process.env.CRON_SECRET;

  if (
    secret &&
    request.headers.get("authorization") !== `Bearer ${secret}`
  ) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const result = await pingSupabase();

  return Response.json(result, { status: result.ok ? 200 : 502 });
}
