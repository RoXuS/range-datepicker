import { Config } from './config';
import { Context } from './context';
export interface Metadata {
}
/**
 * A WCT plugin. This constructor is private. Plugins can be retrieved via
 * `Plugin.get`.
 */
export declare class Plugin {
    name: string;
    cliConfig: Config;
    packageName: string;
    metadata: Metadata;
    constructor(packageName: string, metadata: Metadata);
    /**
     * @param {!Context} context The context that this plugin should be evaluated
     *     within.
     */
    execute(context: Context): Promise<void>;
    /**
     * Retrieves a plugin by shorthand or module name (loading it as necessary).
     *
     * @param {string} name
     */
    static get(name: string): Promise<Plugin>;
    /**
     * @param {string} name
     * @return {string} The short form of `name`.
     */
    static shortName(name: string): string;
    static Plugin: typeof Plugin;
}
