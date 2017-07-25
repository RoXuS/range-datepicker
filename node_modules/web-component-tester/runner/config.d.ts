/// <reference types="node" />
/// <reference types="vinyl-fs" />
import { Capabilities } from 'wd';
import { BrowserDef } from './browserrunner';
import { Context } from './context';
export declare type Browser = string | {
    browserName: string;
    platform: string;
};
export interface Config {
    suites?: string[];
    output?: NodeJS.WritableStream;
    ttyOutput?: boolean;
    verbose?: boolean;
    quiet?: boolean;
    expanded?: boolean;
    root?: string;
    testTimeout?: number;
    persistent?: boolean;
    extraScripts?: string[];
    clientOptions?: {
        root?: string;
        verbose?: boolean;
    };
    activeBrowsers?: BrowserDef[];
    browserOptions?: {
        [name: string]: Capabilities;
    };
    plugins?: (string | boolean)[] | {
        [key: string]: ({
            disabled: boolean;
        } | boolean);
    };
    registerHooks?: (wct: Context) => void;
    enforceJsonConf?: boolean;
    webserver?: {
        port: number;
        hostname: string;
        _generatedIndexContent?: string;
        _servers?: {
            variant: string;
            url: string;
        }[];
    };
    skipPlugins?: string[];
    sauce?: {};
    remote?: {};
    origSuites?: string[];
    compile?: 'auto' | 'always' | 'never';
    skipCleanup?: boolean;
    simpleOutput?: boolean;
    skipUpdateCheck?: boolean;
    configFile?: string;
    /** A deprecated option */
    browsers?: Browser[] | Browser;
}
export declare function defaults(): Config;
export interface PreparsedArgs {
    plugins?: string[];
    skipPlugins?: string[];
    simpleOutput?: boolean;
    skipUpdateCheck?: boolean;
}
/**
 * Discovers appropriate config files (global, and for the project), merging
 * them, and returning them.
 *
 * @param {string} matcher
 * @param {string} root
 * @return {!Object} The merged configuration.
 */
export declare function fromDisk(matcher: string, root?: string): Config;
/**
 * Runs a simplified options parse over the command line arguments, extracting
 * any values that are necessary for a full parse.
 *
 * See const: PREPARSE_ARGS for the values that are extracted.
 *
 * @param {!Array<string>} args
 * @return {!Object}
 */
export declare function preparseArgs(args: string[]): PreparsedArgs;
/**
 * Runs a complete options parse over the args, respecting plugin options.
 *
 * @param {!Context} context The context, containing plugin state and any base
 *     options to merge into.
 * @param {!Array<string>} args The args to parse.
 */
export declare function parseArgs(context: Context, args: string[]): Promise<void>;
/**
 * @param {!Object...} configs Configuration objects to merge.
 * @return {!Object} The merged configuration, where configuration objects
 *     specified later in the arguments list are given precedence.
 */
export declare function merge(...configs: Config[]): Config;
export declare function normalize(config: Config): Config;
/**
 * Expands values within the configuration based on the current environment.
 *
 * @param {!Context} context The context for the current run.
 */
export declare function expand(context: Context): Promise<void>;
/**
 * @param {!Object} options The configuration to validate.
 */
export declare function validate(options: Config): Promise<void>;
