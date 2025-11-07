import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import type { SiteContent } from '$lib/types/content';

const contentPath = resolve('src/content/content.json');

export async function readContent(): Promise<SiteContent> {
	const file = await readFile(contentPath, 'utf-8');
	return JSON.parse(file) as SiteContent;
}

export async function writeContent(content: SiteContent): Promise<void> {
	const payload = JSON.stringify(content, null, 2);
	await writeFile(contentPath, payload, 'utf-8');
}
