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
declare const ImageLightbox: $$__sveltets_2_IsomorphicComponent<{
    image: {
        src: string;
        alt: string;
    } | null;
    onClose: () => void;
}, {
    [evt: string]: CustomEvent<any>;
}, {}, {}, string>;
type ImageLightbox = InstanceType<typeof ImageLightbox>;
export default ImageLightbox;
