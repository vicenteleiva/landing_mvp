type MetaUserData = {
  em?: string[];
  ph?: string[];
  external_id?: string[];
  client_ip_address?: string;
  client_user_agent?: string;
  fbc?: string;
  fbp?: string;
  subscription_id?: string;
};

type MetaConversionEvent = {
  event_name: string;
  event_time?: number;
  event_id?: string;
  action_source?: 'website' | 'app' | 'phone_call' | 'chat' | 'physical_store' | 'system_generated' | 'email';
  event_source_url?: string;
  user_data?: MetaUserData;
  custom_data?: Record<string, unknown>;
  test_event_code?: string;
};

const API_VERSION = process.env.META_CONVERSIONS_API_VERSION ?? 'v18.0';
const PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
const ACCESS_TOKEN = process.env.META_CONVERSIONS_ACCESS_TOKEN;

type MetaPayload = {
  data: Array<{
    event_name: string;
    event_time: number;
    action_source: string;
    event_id?: string;
    user_data?: ReturnType<typeof cleanUserData>;
    custom_data?: Record<string, unknown>;
    event_source_url?: string;
  }>;
  test_event_code?: string;
};

export async function sendMetaConversionEvent(event: MetaConversionEvent) {
  if (!PIXEL_ID || !ACCESS_TOKEN) {
    const error = new Error('Missing pixel ID or access token for Meta Conversions API');
    console.error('[META][CAPI] configuration error', {
      hasPixel: Boolean(PIXEL_ID),
      hasToken: Boolean(ACCESS_TOKEN),
      eventName: event.event_name,
    });
    throw error;
  }

  const body: MetaPayload = {
    data: [
      {
        event_name: event.event_name,
        event_time: event.event_time ?? Math.floor(Date.now() / 1000),
        action_source: event.action_source ?? 'website',
        event_id: event.event_id,
        user_data: cleanUserData(event.user_data),
        custom_data: cleanRecord(event.custom_data),
        event_source_url: event.event_source_url,
      },
    ],
  };

  const testEventCode =
    (event.test_event_code ?? process.env.META_TEST_EVENT_CODE) || undefined;
  if (testEventCode) {
    body.test_event_code = testEventCode;
  }

  console.log("[META][CAPI] dispatch", {
    pixel: PIXEL_ID,
    event_name: event.event_name,
    event_id: event.event_id ?? null,
    test_event_code: testEventCode ?? null,
  });

  const url = `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  let responseText: string | null = null;
  try {
    responseText = await res.text();
  } catch (error) {
    console.warn('[META][CAPI] Failed to read response', error);
  }

  let detail: unknown = null;
  if (responseText && responseText.trim().length) {
    try {
      detail = JSON.parse(responseText);
    } catch {
      detail = responseText;
    }
  }

  const debugBody =
    typeof detail === 'string' ? detail : detail ? JSON.stringify(detail) : null;
  console.log('[META][CAPI] status:', res.status, {
    pixel: PIXEL_ID,
    event_name: event.event_name,
    event_id: event.event_id ?? null,
    test_event_code: testEventCode ?? null,
    body: debugBody,
  });

  if (!res.ok) {
    const error = new Error(`[META][CAPI] Failed to send event ${event.event_name} (${res.status})`);
    (error as any).detail = detail;
    throw error;
  }

  return {
    status: res.status,
    ok: res.ok,
    detail,
  };
}

function cleanUserData(userData?: MetaUserData) {
  if (!userData) return undefined;
  const cleaned = cleanRecord(userData);
  if (!cleaned) return undefined;
  return cleaned;
}

function cleanRecord<T extends Record<string, unknown>>(value?: T) {
  if (!value) return undefined;
  const entries = Object.entries(value).filter(([_, v]) => {
    if (v == null) return false;
    if (Array.isArray(v)) return v.length > 0;
    if (typeof v === 'object' && Object.keys(v as object).length === 0) return false;
    if (typeof v === 'string') return v.trim().length > 0;
    return true;
  });
  return entries.length ? Object.fromEntries(entries) as T : undefined;
}
