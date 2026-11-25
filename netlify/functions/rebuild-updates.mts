/**
 * Rebuilds the site once a day so new Paragraph posts appear in /updates/.
 * Paragraph has no publish webhook, so this is the refresh mechanism.
 *
 * Setup (once, in Netlify): Project configuration → Build & deploy →
 * Build hooks → add a hook for `main`, then save its URL as the environment
 * variable UPDATES_BUILD_HOOK (scope: Functions). Without it this is a no-op.
 * Scheduled functions only run on the published deploy, and can also be
 * started with "Run now" in the Netlify UI.
 * https://docs.netlify.com/build/functions/scheduled-functions/
 * https://docs.netlify.com/build/configure-builds/build-hooks/
 */
import type { Config } from '@netlify/functions';

export default async () => {
	const hook = process.env.UPDATES_BUILD_HOOK;
	if (!hook) {
		console.log('UPDATES_BUILD_HOOK is not set; skipping.');
		return new Response(null, { status: 204 });
	}
	const res = await fetch(`${hook}?trigger_title=${encodeURIComponent('Daily refresh of Updates from Paragraph')}`, {
		method: 'POST',
	});
	console.log(`Build hook responded ${res.status}`);
	return new Response(null, { status: res.ok ? 202 : 502 });
};

// 06:17 UTC daily
export const config: Config = { schedule: '17 6 * * *' };
