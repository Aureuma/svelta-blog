import type { BlogPost } from '../../types/blog';
interface $$__sveltets_2_IsomorphicComponent<Props extends Record<string, any> = any, Events extends Record<string, any> = any, Slots extends Record<string, any> = any, Exports = {}, Bindings = string> {
    new (options: import('svelte').ComponentConstructorOptions<Props>): import('svelte').SvelteComponent<Props, Events, Slots> & {
        $$bindings?: Bindings;
    } & Exports;
    (internal: unknown, props: Props & {
        $$events?: Events;
        $$slots?: Slots;
    }): Exports & {
        $set?: any;
        $on?: any;
    };
    z_$$bindings?: Bindings;
}
declare const BlogCard: $$__sveltets_2_IsomorphicComponent<{
    post: BlogPost;
    variant?: "default" | "suggestion";
}, {
    [evt: string]: CustomEvent<any>;
}, {}, {}, string>;
type BlogCard = InstanceType<typeof BlogCard>;
export default BlogCard;
