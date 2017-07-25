/// <reference types="node" />
import * as wd from 'wd';
import { Config } from './config';
export interface Stats {
    status: string;
    passing?: number;
    pending?: number;
    failing?: number;
}
export interface BrowserDef extends wd.Capabilities {
    id: number;
    url: string;
    sessionId: string;
    deviceName?: string;
    variant?: string;
}
export declare class BrowserRunner {
    timeout: number;
    browser: wd.Browser;
    stats: Stats;
    sessionId: string;
    timeoutId: NodeJS.Timer;
    emitter: NodeJS.EventEmitter;
    def: BrowserDef;
    options: Config;
    donePromise: Promise<void>;
    /**
     * The url of the initial page to load in the browser when starting tests.
     */
    url: string;
    private _resolve;
    private _reject;
    /**
     * @param emitter The emitter to send updates about test progress to.
     * @param def A BrowserDef describing and defining the browser to be run.
     *     Includes both metadata and a method for connecting/launching the
     *     browser.
     * @param options WCT options.
     * @param url The url of the generated index.html file that the browser should
     *     point at.
     * @param waitFor Optional. If given, we won't try to start/connect to the
     *     browser until this promise resolves. Used for serializing access to
     *     Safari webdriver, which can only have one instance running at once.
     */
    constructor(emitter: NodeJS.EventEmitter, def: BrowserDef, options: Config, url: string, waitFor?: Promise<void>);
    _init(error: any, sessionId: string): void;
    startTest(): void;
    onEvent(event: string, data: any): void;
    done(error: any): void;
    extendTimeout(): void;
    quit(): void;
    static BrowserRunner: typeof BrowserRunner;
}
