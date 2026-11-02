/**
 * First-touch attribution, kept in sessionStorage so it survives navigation
 * between pages. Captured on the FIRST page view of the session (every niche
 * page does this via <SEO />), read by ContactForm at submit time.
 *
 * All storage access is wrapped in try/catch (private mode, blocked storage);
 * without storage we fall back to the current page only.
 */
export interface Attribution {
  landing: string;
  referrer: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
}

const KEY = 'niche:first-touch';

function snapshot(): Attribution {
  const params = new URLSearchParams(location.search);
  return {
    landing: location.pathname,
    referrer: document.referrer,
    utm_source: params.get('utm_source') ?? '',
    utm_medium: params.get('utm_medium') ?? '',
    utm_campaign: params.get('utm_campaign') ?? '',
  };
}

/** Store first-touch data once per session. Safe to call on every page. */
export function captureAttribution(): void {
  try {
    if (sessionStorage.getItem(KEY) === null) {
      sessionStorage.setItem(KEY, JSON.stringify(snapshot()));
    }
  } catch {
    /* storage unavailable: readAttribution() falls back to this page */
  }
}

/** Stored first-touch data, or this page's data if nothing is stored. */
export function readAttribution(): Attribution {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (raw) return { ...snapshot(), ...(JSON.parse(raw) as Partial<Attribution>) };
  } catch {
    /* ignore */
  }
  return snapshot();
}
