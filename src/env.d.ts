/// <reference types="svelte" />
/// <reference types="vite/client" />

declare module '$env/static/private' {
	export const EMAIL_APP_USER: string;
	export const EMAIL_APP_PASSWORD: string;
	export const EMAIL_APP_TO_ADDRESS: string;
	export const TURNSTILE_SECRET_KEY: string | undefined;
}

declare module '$env/static/public' {
	export const PUBLIC_TURNSTILE_SITE_KEY: string | undefined;
}

export {};
