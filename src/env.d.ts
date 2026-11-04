interface ImportMetaEnv {
  readonly PUBLIC_CONTACT_ENDPOINT?: string;
  readonly PUBLIC_CONTACT_EMAIL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/** contactEndpoint from src/person/config.ts, inlined by vite.define (astro.config.mjs). */
declare const __CONTACT_ENDPOINT__: string;
/** contactFallbackEmail from src/person/config.ts, inlined by vite.define (astro.config.mjs). */
declare const __CONTACT_FALLBACK_EMAIL__: string;
