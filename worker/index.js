/*
  Cloudflare Worker for the portfolio

  - fetch:     serves the built site from ./dist (see "assets" in
               wrangler.jsonc). Page routes like /projects fall back
               to index.html, so the React router handles them.
  - scheduled: runs daily (see "triggers" in wrangler.jsonc) and pings
               Supabase so the free-plan project never pauses.

  The Supabase values are read from the Worker's variables/secrets,
  set in the Cloudflare dashboard (never committed).
*/

import { pingSupabase } from "../server/supabaseKeepAlive.js";

export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request);
  },

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
