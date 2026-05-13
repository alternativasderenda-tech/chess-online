// ============================================================
// Edge Function: ga-stats
// Busca metricas do Google Analytics 4 via Data API e retorna
// JSON pra ser consumido pelo painel /admin.
//
// Auth: caller precisa ter JWT valido E estar em admin_users.
//
// Env vars necessarias (Supabase Dashboard → Edge Functions → Secrets):
//   GA_SA_EMAIL          = email da service account
//   GA_SA_PRIVATE_KEY    = private key PEM (com \n literais ou reais)
//   GA_PROPERTY_ID       = ID da propriedade GA4 (sem 'properties/')
// ============================================================

// @ts-ignore — Deno-style URL imports
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
// @ts-ignore
import { create, getNumericDate } from "https://deno.land/x/djwt@v3.0.1/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

// @ts-ignore — Deno global
Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // ============== 1. Auth check ==============
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return jsonResp({ error: 'missing auth header' }, 401);
    }

    // @ts-ignore
    const supaUrl = Deno.env.get('SUPABASE_URL');
    // @ts-ignore
    const supaAnon = Deno.env.get('SUPABASE_ANON_KEY');
    if (!supaUrl || !supaAnon) {
      return jsonResp({ error: 'supabase env not configured' }, 500);
    }

    const supa = createClient(supaUrl, supaAnon, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: userErr } = await supa.auth.getUser();
    if (userErr || !user) {
      return jsonResp({ error: 'invalid auth' }, 401);
    }

    const { data: adminRow } = await supa.from('admin_users')
      .select('user_id').eq('user_id', user.id).maybeSingle();
    if (!adminRow) {
      return jsonResp({ error: 'forbidden: not admin' }, 403);
    }

    // ============== 2. GA service account credentials ==============
    // @ts-ignore
    const saEmail = Deno.env.get('GA_SA_EMAIL');
    // @ts-ignore
    const saKey = Deno.env.get('GA_SA_PRIVATE_KEY');
    // @ts-ignore
    const propertyId = Deno.env.get('GA_PROPERTY_ID');
    if (!saEmail || !saKey || !propertyId) {
      return jsonResp({
        error: 'GA credentials not configured',
        hint: 'Set GA_SA_EMAIL, GA_SA_PRIVATE_KEY, GA_PROPERTY_ID in Edge Function secrets.'
      }, 500);
    }

    // Normaliza \n literais (env vars vem com \\n na maior parte das vezes)
    const privateKeyPem = saKey.replace(/\\n/g, '\n');
    const accessToken = await getGaAccessToken(saEmail, privateKeyPem);

    // ============== 3. Run reports in parallel ==============
    const [totals, daily, pages, events, sources, devices, countries] = await Promise.all([
      runReport(accessToken, propertyId, totalsReport()),
      runReport(accessToken, propertyId, dailyReport()),
      runReport(accessToken, propertyId, topPagesReport()),
      runReport(accessToken, propertyId, topEventsReport()),
      runReport(accessToken, propertyId, topSourcesReport()),
      runReport(accessToken, propertyId, devicesReport()),
      runReport(accessToken, propertyId, countriesReport()),
    ]);

    return jsonResp({
      totals: parseRows(totals)[0] || {},
      daily: parseRows(daily),
      pages: parseRows(pages),
      events: parseRows(events),
      sources: parseRows(sources),
      devices: parseRows(devices),
      countries: parseRows(countries),
      fetched_at: new Date().toISOString()
    });

  } catch (e: any) {
    return jsonResp({ error: e.message || String(e) }, 500);
  }
});

function jsonResp(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function getGaAccessToken(saEmail: string, privateKeyPem: string): Promise<string> {
  // Converte PEM em CryptoKey
  const pemBody = privateKeyPem
    .replace(/-----BEGIN [^-]+-----/g, '')
    .replace(/-----END [^-]+-----/g, '')
    .replace(/\s/g, '');
  const binaryDer = Uint8Array.from(atob(pemBody), c => c.charCodeAt(0));
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    binaryDer,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const jwt = await create(
    { alg: 'RS256', typ: 'JWT' },
    {
      iss: saEmail,
      scope: 'https://www.googleapis.com/auth/analytics.readonly',
      aud: 'https://oauth2.googleapis.com/token',
      exp: getNumericDate(3600),
      iat: getNumericDate(0)
    },
    cryptoKey
  );

  const tokenResp = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
  });
  if (!tokenResp.ok) {
    throw new Error('GA token exchange failed: ' + await tokenResp.text());
  }
  const json = await tokenResp.json();
  return json.access_token;
}

async function runReport(accessToken: string, propertyId: string, body: any) {
  const resp = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }
  );
  if (!resp.ok) {
    throw new Error('GA report failed: ' + await resp.text());
  }
  return await resp.json();
}

function parseRows(report: any) {
  if (!report.rows) return [];
  const dimNames = (report.dimensionHeaders || []).map((h: any) => h.name);
  const metNames = (report.metricHeaders || []).map((h: any) => h.name);
  return report.rows.map((row: any) => {
    const obj: any = {};
    (row.dimensionValues || []).forEach((v: any, i: number) => obj[dimNames[i]] = v.value);
    (row.metricValues || []).forEach((v: any, i: number) => obj[metNames[i]] = v.value);
    return obj;
  });
}

// ============== Report definitions ==============

function totalsReport() {
  return {
    metrics: [
      { name: 'activeUsers' },
      { name: 'newUsers' },
      { name: 'sessions' },
      { name: 'screenPageViews' },
      { name: 'averageSessionDuration' }
    ],
    dateRanges: [{ startDate: '28daysAgo', endDate: 'today' }],
    limit: 1
  };
}

function dailyReport() {
  return {
    dimensions: [{ name: 'date' }],
    metrics: [{ name: 'activeUsers' }, { name: 'sessions' }],
    dateRanges: [{ startDate: '13daysAgo', endDate: 'today' }],
    orderBys: [{ dimension: { dimensionName: 'date' } }],
    limit: 14
  };
}

function topPagesReport() {
  return {
    dimensions: [{ name: 'pagePath' }],
    metrics: [{ name: 'screenPageViews' }, { name: 'activeUsers' }],
    dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
    orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
    limit: 10
  };
}

function topEventsReport() {
  return {
    dimensions: [{ name: 'eventName' }],
    metrics: [{ name: 'eventCount' }],
    dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
    orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
    limit: 15
  };
}

function topSourcesReport() {
  return {
    dimensions: [{ name: 'sessionSource' }],
    metrics: [{ name: 'sessions' }, { name: 'activeUsers' }],
    dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    limit: 10
  };
}

function devicesReport() {
  return {
    dimensions: [{ name: 'deviceCategory' }],
    metrics: [{ name: 'activeUsers' }, { name: 'sessions' }],
    dateRanges: [{ startDate: '28daysAgo', endDate: 'today' }]
  };
}

function countriesReport() {
  return {
    dimensions: [{ name: 'country' }],
    metrics: [{ name: 'activeUsers' }],
    dateRanges: [{ startDate: '28daysAgo', endDate: 'today' }],
    orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
    limit: 10
  };
}
