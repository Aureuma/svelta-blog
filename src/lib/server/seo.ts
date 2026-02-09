import type { BlogPost } from '$lib/types/blog';

export type PostSeo = {
	title: string;
	description: string;
	canonicalUrl: string;
	og: {
		title: string;
		description: string;
		type: 'article';
		url: string;
	};
};

export function buildPostSeo(post: BlogPost, canonicalUrl: string): PostSeo {
	const title = `${post.title} | Convelt Blog`;
	const description = post.excerpt;

	return {
		title,
		description,
		canonicalUrl,
		og: {
			title: post.title,
			description,
			type: 'article',
			url: canonicalUrl
		}
	};
}

