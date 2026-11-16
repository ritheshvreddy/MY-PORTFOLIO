/*
  Supabase keep-alive Worker

  Runs daily (see "triggers" in wrangler.jsonc). Supabase pauses
  free-plan projects after about a week with no API requests, so
  this makes one tiny read to count as activity.

  Reads VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY from the
  Worker's variables/secrets (set in the Cloudflare dashboard).
*/

import { pingSupabase } from "../server/supabaseKeepAlive.js";

export default {
  async scheduled(controller, env, ctx) {
    ctx.waitUntil(
      pingSupabase(env).then((result) => {
        if (!result.ok) {
          // Throwing marks this run as failed in Cloudflare's cron logs.
          throw new Error(`Supabase keep-alive failed: ${JSON.stringify(result)}`);
        }
      })
    );
  },
};
