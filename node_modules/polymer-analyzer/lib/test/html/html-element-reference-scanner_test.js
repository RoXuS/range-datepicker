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
const html_element_reference_scanner_1 = require("../../html/html-element-reference-scanner");
const html_parser_1 = require("../../html/html-parser");
const test_utils_1 = require("../test-utils");
suite('HtmlElementReferenceScanner', () => {
    suite('scan()', () => {
        let scanner;
        setup(() => {
            scanner = new html_element_reference_scanner_1.HtmlElementReferenceScanner();
        });
        test('finds element references', () => __awaiter(this, void 0, void 0, function* () {
            const contents = `<html><head></head>
      <body>
        <div>Foo</div>
        <x-foo></x-foo>
        <div>
          <x-bar></x-bar>
        </div>
      </body></html>`;
            const document = new html_parser_1.HtmlParser().parse(contents, 'test-document.html');
            const visit = (visitor) => __awaiter(this, void 0, void 0, function* () { return document.visit([visitor]); });
            const { features } = yield scanner.scan(document, visit);
            chai_1.assert.deepEqual(features.map((f) => f.tagName), ['html', 'head', 'body', 'div', 'x-foo', 'div', 'x-bar']);
        }));
    });
});
suite('HtmlCustomElementReferenceScanner', () => {
    suite('scan()', () => {
        let scanner;
        let contents = '';
        const loader = { canLoad: () => true, load: () => Promise.resolve(contents) };
        const underliner = new test_utils_1.CodeUnderliner(loader);
        setup(() => {
            scanner = new html_element_reference_scanner_1.HtmlCustomElementReferenceScanner();
        });
        test('finds custom element references', () => __awaiter(this, void 0, void 0, function* () {
            contents = `<html><body>
          <div>Foo</div>
          <x-foo a=5 b="test" c></x-foo>
          <div>
            <x-bar></x-bar>
          </div>
          <h1>Bar</h1>
          <template>
            <x-baz></x-baz>
          </template>
        </body></html>`;
            const document = new html_parser_1.HtmlParser().parse(contents, 'test-document.html');
            const visit = (visitor) => __awaiter(this, void 0, void 0, function* () { return document.visit([visitor]); });
            const { features } = yield scanner.scan(document, visit);
            chai_1.assert.deepEqual(features.map((f) => f.tagName), ['x-foo', 'x-bar', 'x-baz']);
            chai_1.assert.deepEqual(Array.from(features[0].attributes.values())
                .map((a) => [a.name, a.value]), [['a', '5'], ['b', 'test'], ['c', '']]);
            const sourceRanges = yield Promise.all(features.map((f) => __awaiter(this, void 0, void 0, function* () { return yield underliner.underline(f.sourceRange); })));
            chai_1.assert.deepEqual(sourceRanges, [
                `
          <x-foo a=5 b="test" c></x-foo>
          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`,
                `
            <x-bar></x-bar>
            ~~~~~~~~~~~~~~~`,
                `
            <x-baz></x-baz>
            ~~~~~~~~~~~~~~~`
            ]);
            const attrRanges = yield Promise.all(features.map((f) => __awaiter(this, void 0, void 0, function* () {
                return yield Promise.all(Array.from(f.attributes.values())
                    .map((a) => __awaiter(this, void 0, void 0, function* () { return yield underliner.underline(a.sourceRange); })));
            })));
            chai_1.assert.deepEqual(attrRanges, [
                [
                    `
          <x-foo a=5 b="test" c></x-foo>
                 ~~~`,
                    `
          <x-foo a=5 b="test" c></x-foo>
                     ~~~~~~~~`,
                    `
          <x-foo a=5 b="test" c></x-foo>
                              ~`
                ],
                [],
                []
            ]);
            const attrNameRanges = yield Promise.all(features.map((f) => __awaiter(this, void 0, void 0, function* () {
                return yield underliner.underline(Array.from(f.attributes.values())
                    .map((a) => a.nameSourceRange));
            })));
            chai_1.assert.deepEqual(attrNameRanges, [
                [
                    `
          <x-foo a=5 b="test" c></x-foo>
                 ~`,
                    `
          <x-foo a=5 b="test" c></x-foo>
                     ~`,
                    `
          <x-foo a=5 b="test" c></x-foo>
                              ~`
                ],
                [],
                []
            ]);
            const attrValueRanges = yield Promise.all(features.map((f) => __awaiter(this, void 0, void 0, function* () {
                return yield Promise.all(Array.from(f.attributes.values())
                    .map((a) => __awaiter(this, void 0, void 0, function* () {
                    return yield underliner.underline(a.valueSourceRange);
                })));
            })));
            chai_1.assert.deepEqual(attrValueRanges, [
                [
                    `
          <x-foo a=5 b="test" c></x-foo>
                   ~`,
                    `
          <x-foo a=5 b="test" c></x-foo>
                       ~~~~~~`,
                    `No source range given.`
                ],
                [],
                []
            ]);
        }));
    });
});

//# sourceMappingURL=html-element-reference-scanner_test.js.map
