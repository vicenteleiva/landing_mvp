'use client';

const firedEvents = new Set<string>();

export async function safeFbqTrack(
  event: string,
  params: Record<string, any> = {},
  opts: { dedupeKey?: string; maxWaitMs?: number } = {}
) {
  const key = opts.dedupeKey ?? `${event}:${JSON.stringify(params)}`;
  if (firedEvents.has(key)) return;

  const maxWait = opts.maxWaitMs ?? 1500;
  const start = Date.now();

  function hasFbq() {
    return typeof window !== 'undefined' && typeof (window as any).fbq === 'function';
  }

  while (!hasFbq() && Date.now() - start < maxWait) {
    await new Promise((r) => setTimeout(r, 50));
  }

  if (!hasFbq()) {
    console.warn('[META] fbq no disponible, se omite', { event, params });
    return;
  }

  try {
    (window as any).fbq('track', event, params);
    firedEvents.add(key);
    console.log(`[META] track ${event}`, params);
  } catch (error) {
    console.error('[META] error al disparar evento', event, error);
  }
}

export async function delayNavigation(ms = 300) {
  await new Promise((r) => setTimeout(r, ms));
}
