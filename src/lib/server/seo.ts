import type { BlogPost } from '$lib/types/blog';

export type PostSeo = {
	title: string;
	description: string;
	canonicalUrl: string;
	keywords: string[];
	og: {
		title: string;
		description: string;
		type: 'article';
		url: string;
		image: string;
	};
	twitter: {
		card: 'summary_large_image';
		title: string;
		description: string;
		image: string;
	};
	article: {
		publishedTime: string;
		modifiedTime: string;
		author: string;
		section: string;
		tags: string[];
	};
	jsonLd: string;
};

function resolveAssetUrl(assetPath: string, canonicalUrl: string): string {
	return new URL(assetPath, canonicalUrl).toString();
}

export function buildPostSeo(post: BlogPost, canonicalUrl: string): PostSeo {
	const title = `${post.title} | svelta Blog`;
	const description = post.excerpt;
	const image = resolveAssetUrl(post.cover, canonicalUrl);
	const publishedTime = /^\d{4}-\d{2}-\d{2}$/.test(post.date)
		? `${post.date}T00:00:00.000Z`
		: new Date(post.date).toISOString();
	const keywords = [post.category.label, ...post.tags, post.author.name];

	return {
		title,
		description,
		canonicalUrl,
		keywords,
		og: {
			title: post.title,
			description,
			type: 'article',
			url: canonicalUrl,
			image
		},
		twitter: {
			card: 'summary_large_image',
			title: post.title,
			description,
			image
		},
		article: {
			publishedTime,
			modifiedTime: publishedTime,
			author: post.author.name,
			section: post.category.label,
			tags: post.tags
		},
		jsonLd: JSON.stringify(
			{
				'@context': 'https://schema.org',
				'@type': 'BlogPosting',
				headline: post.title,
				description,
				datePublished: publishedTime,
				dateModified: publishedTime,
				author: {
					'@type': 'Person',
					name: post.author.name
				},
				articleSection: post.category.label,
				keywords,
				url: canonicalUrl,
				image: [image]
			},
			null,
			2
		)
	};
}
