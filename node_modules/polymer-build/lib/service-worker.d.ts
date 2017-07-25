/// <reference path="../custom_typings/sw-precache.d.ts" />
/// <reference types="node" />
import { SWConfig } from 'sw-precache';
import { PolymerProject } from './polymer-project';
export interface AddServiceWorkerOptions {
    project: PolymerProject;
    buildRoot: string;
    bundled?: boolean;
    path?: string;
    swPrecacheConfig?: SWConfig | null;
    basePath?: string;
}
export declare const hasNoFileExtension: RegExp;
/**
 * Returns a promise that resolves with a generated service worker
 * configuration.
 */
export declare function generateServiceWorkerConfig(options: AddServiceWorkerOptions): Promise<SWConfig>;
/**
 * Returns a promise that resolves with a generated service worker (the file
 * contents), based off of the options provided.
 */
export declare function generateServiceWorker(options: AddServiceWorkerOptions): Promise<Buffer>;
/**
 * Returns a promise that resolves when a service worker has been generated
 * and written to the build directory. This uses generateServiceWorker() to
 * generate a service worker, which it then writes to the file system based on
 * the buildRoot & path (if provided) options.
 */
export declare function addServiceWorker(options: AddServiceWorkerOptions): Promise<void>;
