export type BlogHeading = {
	id: string;
	text: string;
	level: 2 | 3;
};

const headingPattern = /<(h2|h3)\s+[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/\1>/gi;

function decodeHtml(input: string): string {
	return input
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;|&apos;/g, "'")
		.replace(/&#x27;/g, "'")
		.replace(/&nbsp;/g, ' ');
}

function stripTags(input: string): string {
	return decodeHtml(input.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}

export function extractBlogHeadings(html: string): BlogHeading[] {
	const headings: BlogHeading[] = [];
	let match: RegExpExecArray | null = null;

	while ((match = headingPattern.exec(html)) !== null) {
		const tag = match[1]?.toLowerCase();
		const id = match[2]?.trim();
		const text = stripTags(match[3] ?? '');
		if (!id || !text) continue;
		headings.push({
			id,
			text,
			level: tag === 'h2' ? 2 : 3
		});
	}

	return headings;
}
