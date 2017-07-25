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
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const fs = require("fs");
const path = require("path");
const html_parser_1 = require("../../html/html-parser");
suite('HtmlParser', () => {
    suite('parse()', () => {
        let parser;
        setup(() => {
            parser = new html_parser_1.HtmlParser();
        });
        suite('on a well-formed document', () => {
            const file = fs.readFileSync(path.resolve(__dirname, '../static/html-parse-target.html'), 'utf8');
            test('parses a well-formed document', () => {
                const document = parser.parse(file, '/static/html-parse-target.html');
                chai_1.assert.equal(document.url, '/static/html-parse-target.html');
            });
            test('can stringify back a well-formed document', () => {
                const document = parser.parse(file, '/static/html-parse-target.html');
                chai_1.assert.deepEqual(document.stringify(), file);
            });
        });
        test('can properly determine the base url of a document', () => {
            const file = fs.readFileSync(path.resolve(__dirname, '../static/base-href/doc-with-base.html'), 'utf8');
            const document = parser.parse(file, '/static/base-href/doc-with-base.html');
            chai_1.assert.equal(document.url, '/static/base-href/doc-with-base.html');
            chai_1.assert.equal(document.baseUrl, '/static/');
        });
    });
});

//# sourceMappingURL=html-parser_test.js.map
