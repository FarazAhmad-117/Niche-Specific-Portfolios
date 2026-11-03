/**
 * Copy-link buttons ([data-copy]). Each button's data-copy holds the href its card opens
 * (relative in dev, absolute in production); it is resolved against the current page, so dev
 * copies http://localhost:<port>/<slug>/ and production copies https://<slug>.farazahmad.dev/.
 *
 * Clipboard API first, hidden-textarea + execCommand fallback. The button shows "Copied" for
 * RESET_MS; one polite live region (#copy-status) announces each copy once.
 */
const RESET_MS = 1600;

async function writeText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* permission denied or unsupported: fall through */
  }
  const active = document.activeElement as HTMLElement | null;
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.setAttribute('readonly', '');
  ta.setAttribute('aria-hidden', 'true');
  ta.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;pointer-events:none';
  document.body.append(ta);
  ta.select();
  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch {
    ok = false;
  }
  ta.remove();
  active?.focus({ preventScroll: true });
  return ok;
}

const liveRegion = document.getElementById('copy-status');
let announceTimer = 0;
function announce(message: string) {
  if (!liveRegion) return;
  liveRegion.textContent = '';
  window.clearTimeout(announceTimer);
  // A fresh text node after a clear makes screen readers repeat identical messages.
  announceTimer = window.setTimeout(() => (liveRegion.textContent = message), 60);
}

const timers = new WeakMap<HTMLButtonElement, number>();

document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((btn) => {
  const label = btn.querySelector<HTMLElement>('[data-copy-label]');
  const idle = label?.textContent ?? 'Copy link';
  btn.addEventListener('click', async () => {
    const url = new URL(btn.dataset.copy ?? '/', location.href).href;
    const ok = await writeText(url);
    btn.dataset.state = ok ? 'copied' : 'failed';
    if (label) label.textContent = ok ? 'Copied' : 'Copy failed';
    announce(ok ? `Link copied: ${url}` : `Could not copy. The link is ${url}`);
    window.clearTimeout(timers.get(btn));
    timers.set(
      btn,
      window.setTimeout(() => {
        delete btn.dataset.state;
        if (label) label.textContent = idle;
      }, RESET_MS),
    );
  });
});

export {};
