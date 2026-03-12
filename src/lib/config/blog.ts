import type { SharePlatform } from '@aureuma/svelta';
import { blogPattern } from './patterns';

export const blogSetup = {
	allowMultipleTags: false,
	sharePlatforms: ['x', 'linkedin', 'facebook'] as SharePlatform[],
	pageSize: blogPattern.pageSize,
	maxPageSize: blogPattern.maxPageSize,
	showRss: blogPattern.showRss
};
