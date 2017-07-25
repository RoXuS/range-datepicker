/// <reference types="lru-cache" />
/// <reference types="express" />
import { RequestHandler } from 'express';
import * as LRU from 'lru-cache';
export declare const isPolyfill: RegExp;
export declare const babelCompileCache: LRU.Cache<string>;
export declare function babelCompile(forceCompile: boolean): RequestHandler;
export declare function browserNeedsCompilation(userAgent: string): boolean;
