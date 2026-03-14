export type SveltaNavItem = {
    label: string;
    href: string;
    external?: boolean;
};
export type SveltaBlogPatternConfig = {
    kind: 'blog';
    brandName: string;
    title: string;
    description: string;
    pageSize: number;
    maxPageSize: number;
    showRss: boolean;
    navigation: {
        header: SveltaNavItem[];
        footer: SveltaNavItem[];
    };
};
