/*
  Supabase keep-alive (shared by keep-alive/ on Cloudflare and api/ on Vercel)

  Supabase pauses free-plan projects after about a week with no
  API requests. A daily scheduled job calls this, which makes one
  tiny read. That counts as activity and keeps the project awake.

  Needs the two Supabase values the site already uses:
    VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY
  Cloudflare passes them in via `env`; on Node hosts they come
  from process.env.
*/

const TABLE = "site_settings";

export async function pingSupabase(env = globalThis.process?.env ?? {}) {
  const url = env.VITE_SUPABASE_URL;
  const key = env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    const result = { ok: false, error: "Supabase env vars are not set" };
    console.error("Supabase keep-alive:", JSON.stringify(result));
    return result;
  }

  const started = Date.now();

  try {
    const response = await fetch(
      `${url.replace(/\/+$/, "")}/rest/v1/${TABLE}?select=id&limit=1`,
      {
        headers: { apikey: key },
        signal: AbortSignal.timeout(15000),
      }
    );

    const result = {
      ok: response.ok,
      status: response.status,
      ms: Date.now() - started,
    };

    if (!response.ok) {
      // Usually means the project is already paused or the key changed.
      console.error(
        "Supabase keep-alive failed:",
        JSON.stringify(result),
        await response.text()
      );
    } else {
      console.log("Supabase keep-alive ok:", JSON.stringify(result));
    }

    return result;
  } catch (error) {
    const result = { ok: false, error: String(error), ms: Date.now() - started };
    console.error("Supabase keep-alive error:", JSON.stringify(result));
    return result;
  }
}
