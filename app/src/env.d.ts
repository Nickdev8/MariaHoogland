/// <reference types="svelte" />
/// <reference types="vite/client" />

declare module '$env/static/private' {
	export const EMAIL_APP_USER: string;
	export const EMAIL_APP_PASSWORD: string;
	export const EMAIL_APP_TO_ADDRESS: string;
}

declare module '$env/static/public' {
	export const PUBLIC_TURNSTILE_SITE_KEY: string | undefined;
}

declare module '$env/dynamic/private' {
	export const env: {
		TURNSTILE_SECRET_KEY?: string;
		MARIAHOOGLAND_ADMIN_PASSWORD?: string;
		MARIAHOOGLAND_ADMIN_SECRET?: string;
		[key: string]: string | undefined;
	};
}

declare module '$env/dynamic/public' {
	export const env: {
		PUBLIC_TURNSTILE_SITE_KEY?: string;
		[key: string]: string | undefined;
	};
}

export {};
