/// <reference types="express" />
import { RequestHandler } from 'express';
/**
 * Returns an express middleware that injects the Custom Elements ES5 Adapter
 * into the entry point when we are serving ES5.
 *
 * This is a *transforming* middleware, so it must be installed before the
 * middleware that actually serves the entry point.
 */
export declare function injectCustomElementsEs5Adapter(forceCompile: boolean): RequestHandler;
