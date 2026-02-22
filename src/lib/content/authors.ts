import type { BlogAuthor } from '$lib/types/blog';

export const AUTHORS: Record<string, BlogAuthor> = {
	shawn: {
		id: 'shawn',
		name: 'Shawn',
		title: 'Builder at svelta',
		avatar: '/blog/authors/shawn.svg'
	},
	alex: {
		id: 'alex',
		name: 'Alex Kim',
		title: 'Product Engineer',
		avatar: '/blog/authors/alex.svg'
	},
	maria: {
		id: 'maria',
		name: 'Maria Santos',
		title: 'Design Lead',
		avatar: '/blog/authors/maria.svg'
	}
};

export function getAuthor(id: string): BlogAuthor {
	const author = AUTHORS[id];
	if (!author) throw new Error(`Unknown author id: ${id}`);
	return author;
}
