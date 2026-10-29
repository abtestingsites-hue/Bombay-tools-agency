/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_SHOP_NAME?: string;
  readonly VITE_WHATSAPP_NUMBER?: string;
  readonly VITE_PHONE_NUMBER?: string;
  readonly VITE_GOOGLE_MAPS_URL?: string;
  readonly VITE_SITE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
