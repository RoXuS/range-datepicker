"use strict";
/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const cli_1 = require("../cli");
const intercept = require("intercept-stdout");
suite('cli', () => {
    /**
     * Runs the CLI with the given args.
     *
     * Why not do this setup and teardown in the standard  setup() and teardown()
     * methods? Because you don't want to trap stdout at test end, as that would
     * trap mocha's output.
     *
     * TODO(rictic): look into using spawn() to run polyserve in another process
     *     instead. That way we could actually get it started and run it for a
     *     while, hit it with requests, etc.
     *
     * @return A Promise of all STDOUT contents that're written during the
     *     run() function in cli.ts.
     */
    function runCli(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const originalArgv = process.argv;
            process.argv = ['node', 'polyserve'].concat(args);
            let stdout = '';
            let unintercept = intercept((txt) => {
                stdout += txt;
                return '';
            });
            const closeServer = (server) => new Promise((resolve, reject) => server.close((e) => {
                e ? reject(e) : resolve();
            }));
            try {
                const serverInfos = yield cli_1.run();
                if (serverInfos) {
                    if (serverInfos.kind === 'mainline') {
                        yield closeServer(serverInfos.server);
                    }
                    else {
                        yield Promise.all(serverInfos.servers.map((s) => closeServer(s.server)));
                    }
                }
            }
            finally {
                unintercept();
                process.argv = originalArgv;
            }
            return stdout;
        });
    }
    test('unknown cmd parameter should not throw exception', () => __awaiter(this, void 0, void 0, function* () {
        const stdout = yield runCli(['--unknown-parameter']);
        // Assert that we printed something that looks kinda like help text to
        // stdout.
        chai_1.assert.match(stdout, /A development server for Polymer projects/);
        chai_1.assert.match(stdout, /--version/);
        chai_1.assert.match(stdout, /--package-name/);
    }));
    test('launches mainline server', () => __awaiter(this, void 0, void 0, function* () {
        yield runCli([]);
    }));
});
//# sourceMappingURL=cli_test.js.map