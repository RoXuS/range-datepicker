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
const html_parser_1 = require("../../html/html-parser");
const pseudo_element_scanner_1 = require("../../polymer/pseudo-element-scanner");
suite('PseudoElementScanner', () => {
    suite('scan()', () => {
        let scanner;
        setup(() => {
            scanner = new pseudo_element_scanner_1.PseudoElementScanner();
        });
        test('finds pseudo elements in html comments ', () => __awaiter(this, void 0, void 0, function* () {
            const desc = `This is a pseudo element`;
            const contents = `<html><head></head><body>
          <!--
          ${desc}
          @pseudoElement x-foo
          @demo demo/index.html
          -->
        </body>
        </html>`;
            const document = new html_parser_1.HtmlParser().parse(contents, 'test.html');
            const visit = (visitor) => __awaiter(this, void 0, void 0, function* () { return document.visit([visitor]); });
            const { features } = yield scanner.scan(document, visit);
            chai_1.assert.equal(features.length, 1);
            chai_1.assert.equal(features[0].tagName, 'x-foo');
            chai_1.assert(features[0].pseudo);
            chai_1.assert.equal(features[0].description.trim(), desc);
            chai_1.assert.deepEqual(features[0].demos, [{ desc: 'demo', path: 'demo/index.html' }]);
        }));
    });
});

//# sourceMappingURL=pseudo-element-scanner_test.js.map
