import type { SharePlatform } from '../../types/blog';
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
declare const ShareButtons: $$__sveltets_2_IsomorphicComponent<{
    title: string;
    url: string;
    label?: string;
    testId?: string | undefined;
    platforms?: SharePlatform[];
}, {
    [evt: string]: CustomEvent<any>;
}, {}, {}, string>;
type ShareButtons = InstanceType<typeof ShareButtons>;
export default ShareButtons;
