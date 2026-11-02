interface ImportMetaEnv {
  readonly PUBLIC_CONTACT_ENDPOINT?: string;
  readonly PUBLIC_CONTACT_EMAIL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
