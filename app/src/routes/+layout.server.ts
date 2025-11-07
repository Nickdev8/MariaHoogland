import { readContent } from '$lib/server/content';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	const content = await readContent();
	return { content };
};
