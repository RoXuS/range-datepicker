import { ServerOptions } from '../start_server';
/**
 * Reads a push-manifest from the specified path, or a cached version
 * of the file
 * @param root path to root directory
 * @param manifestPath path to manifest file
 * @returns the manifest
 */
export declare function getPushManifest(root: string, manifestPath: string): {
    [path: string]: any;
};
/**
 * Pushes any resources for the requested file
 * @param options server options
 * @param req HTTP request
 * @param res HTTP response
 */
export declare function pushResources(options: ServerOptions, req: any, res: any): void;
