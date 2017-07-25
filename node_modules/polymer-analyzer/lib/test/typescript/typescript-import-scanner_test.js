"use strict";
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
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
const typescript_import_scanner_1 = require("../../typescript/typescript-import-scanner");
const typescript_preparser_1 = require("../../typescript/typescript-preparser");
suite('TypeScriptImportScanner', () => {
    suite('scan()', () => {
        let scanner;
        setup(() => {
            scanner = new typescript_import_scanner_1.TypeScriptImportScanner();
        });
        test('finds no imports', () => __awaiter(this, void 0, void 0, function* () {
            const source = ``;
            const parser = new typescript_preparser_1.TypeScriptPreparser();
            const document = parser.parse(source, 'test.ts');
            const visit = (visitor) => __awaiter(this, void 0, void 0, function* () { return document.visit([visitor]); });
            const { features } = yield scanner.scan(document, visit);
            chai_1.assert.equal(features.length, 0);
        }));
        test('finds multiple import', () => __awaiter(this, void 0, void 0, function* () {
            const source = `
        import * as x from './x.ts';
        import * as y from '/y.ts';
        import * as z from '../z.ts';
      `;
            const parser = new typescript_preparser_1.TypeScriptPreparser();
            const document = parser.parse(source, 'test.ts');
            const visit = (visitor) => __awaiter(this, void 0, void 0, function* () { return document.visit([visitor]); });
            const { features } = yield scanner.scan(document, visit);
            chai_1.assert.deepEqual(features.map((f) => [f.type, f.url]), [
                ['js-import', 'x.ts'],
                ['js-import', '/y.ts'],
                ['js-import', '../z.ts'],
            ]);
        }));
    });
});

//# sourceMappingURL=typescript-import-scanner_test.js.map
