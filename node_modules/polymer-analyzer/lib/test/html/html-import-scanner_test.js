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
const html_import_scanner_1 = require("../../html/html-import-scanner");
const html_parser_1 = require("../../html/html-parser");
suite('HtmlImportScanner', () => {
    suite('scan()', () => {
        let scanner;
        setup(() => {
            scanner = new html_import_scanner_1.HtmlImportScanner();
        });
        test('finds HTML Imports', () => __awaiter(this, void 0, void 0, function* () {
            const contents = `<html><head>
          <link rel="import" href="polymer.html">
          <link rel="import" type="css" href="polymer.css">
          <script src="foo.js"></script>
          <link rel="stylesheet" href="foo.css"></link>
        </head></html>`;
            const document = new html_parser_1.HtmlParser().parse(contents, 'test.html');
            const visit = (visitor) => __awaiter(this, void 0, void 0, function* () { return document.visit([visitor]); });
            const { features } = yield scanner.scan(document, visit);
            chai_1.assert.equal(features.length, 1);
            chai_1.assert.equal(features[0].type, 'html-import');
            chai_1.assert.equal(features[0].url, 'polymer.html');
        }));
        test('resolves HTML Import URLs relative to baseUrl', () => __awaiter(this, void 0, void 0, function* () {
            const contents = `<html><head><base href="/aybabtu/">
          <link rel="import" href="polymer.html">
          <link rel="import" type="css" href="polymer.css">
          <script src="foo.js"></script>
          <link rel="stylesheet" href="foo.css"></link>
        </head></html>`;
            const document = new html_parser_1.HtmlParser().parse(contents, 'test.html');
            const visit = (visitor) => __awaiter(this, void 0, void 0, function* () { return document.visit([visitor]); });
            const { features } = yield scanner.scan(document, visit);
            chai_1.assert.equal(features.length, 1);
            chai_1.assert.equal(features[0].type, 'html-import');
            chai_1.assert.equal(features[0].url, '/aybabtu/polymer.html');
        }));
        test('finds lazy HTML Imports', () => __awaiter(this, void 0, void 0, function* () {
            const contents = `<html><head>
          <link rel="import" href="polymer.html">
          <dom-module>
          <link rel="lazy-import"  href="lazy-polymer.html">
          </dom-module>
          <link rel="stylesheet" href="foo.css"></link>
        </head></html>`;
            const document = new html_parser_1.HtmlParser().parse(contents, 'test.html');
            const visit = (visitor) => __awaiter(this, void 0, void 0, function* () { return document.visit([visitor]); });
            const { features } = yield scanner.scan(document, visit);
            chai_1.assert.equal(features.length, 2);
            chai_1.assert.equal(features[1].type, 'html-import');
            chai_1.assert.equal(features[1].url, 'lazy-polymer.html');
            chai_1.assert.equal(features[1].lazy, true);
        }));
    });
    suite('scan() with lazy import map', () => {
        let scanner;
        setup(() => {
            const lazyEdges = new Map();
            lazyEdges.set('test.html', ['lazy1.html', 'lazy2.html', 'lazy3.html']);
            scanner = new html_import_scanner_1.HtmlImportScanner(lazyEdges);
        });
        test('injects synthetic lazy html imports', () => __awaiter(this, void 0, void 0, function* () {
            const contents = `<html><head>
          <link rel="import" href="polymer.html">
          <link rel="import" type="css" href="polymer.css">
          <script src="foo.js"></script>
          <link rel="stylesheet" href="foo.css"></link>
        </head></html>`;
            const document = new html_parser_1.HtmlParser().parse(contents, 'test.html');
            const visit = (visitor) => __awaiter(this, void 0, void 0, function* () { return document.visit([visitor]); });
            const { features } = yield scanner.scan(document, visit);
            chai_1.assert.deepEqual(features.map((f) => f.type), ['html-import', 'html-import', 'html-import', 'html-import']);
            chai_1.assert.deepEqual(features.map((i) => i.lazy), [false, true, true, true]);
            chai_1.assert.deepEqual(features.map((f) => f.url), ['polymer.html', 'lazy1.html', 'lazy2.html', 'lazy3.html']);
        }));
    });
});

//# sourceMappingURL=html-import-scanner_test.js.map
