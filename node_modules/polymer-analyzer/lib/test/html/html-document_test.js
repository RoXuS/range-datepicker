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
const dom5 = require("dom5");
const fs = require("fs");
const parse5 = require("parse5");
const path = require("path");
const analyzer_1 = require("../../core/analyzer");
const html_parser_1 = require("../../html/html-parser");
const fs_url_loader_1 = require("../../url-loader/fs-url-loader");
const test_utils_1 = require("../test-utils");
suite('ParsedHtmlDocument', () => {
    const parser = new html_parser_1.HtmlParser();
    const url = './source-ranges/html-complicated.html';
    const basedir = path.join(__dirname, '../static/');
    const file = fs.readFileSync(path.join(basedir, `${url}`), 'utf8');
    const document = parser.parse(file, url);
    const urlLoader = new fs_url_loader_1.FSUrlLoader(basedir);
    const analyzer = new analyzer_1.Analyzer({ urlLoader });
    const underliner = new test_utils_1.CodeUnderliner(urlLoader);
    suite('sourceRangeForNode()', () => {
        test('works for comments', () => __awaiter(this, void 0, void 0, function* () {
            const comments = dom5.nodeWalkAll(document.ast, parse5.treeAdapters.default.isCommentNode);
            chai_1.assert.equal(comments.length, 2);
            chai_1.assert.deepEqual(yield underliner.underline(document.sourceRangeForNode(comments[0])), `
    <!-- Single Line Comment -->
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~`);
            chai_1.assert.deepEqual(yield underliner.underline(document.sourceRangeForNode(comments[1])), `
    <!-- Multiple
    ~~~~~~~~~~~~~
         Line
~~~~~~~~~~~~~
         Comment -->
~~~~~~~~~~~~~~~~~~~~`);
        }));
        test('works for elements', () => __awaiter(this, void 0, void 0, function* () {
            const liTags = dom5.queryAll(document.ast, dom5.predicates.hasTagName('li'));
            chai_1.assert.equal(liTags.length, 4);
            chai_1.assert.deepEqual(yield underliner.underline(document.sourceRangeForNode(liTags[0])), `
        <li>1
        ~~~~~
        <li>2</li>
~~~~~~~~`);
            chai_1.assert.deepEqual(yield underliner.underline(document.sourceRangeForNode(liTags[1])), `
        <li>2</li>
        ~~~~~~~~~~`);
            chai_1.assert.deepEqual(yield underliner.underline(document.sourceRangeForNode(liTags[2])), `
        <li><li>
        ~~~~`);
            chai_1.assert.deepEqual(yield underliner.underline(document.sourceRangeForNode(liTags[3])), `
        <li><li>
            ~~~~
      </ul>
~~~~~~`);
            const pTags = dom5.queryAll(document.ast, dom5.predicates.hasTagName('p'));
            chai_1.assert.equal(pTags.length, 2);
            chai_1.assert.deepEqual(yield underliner.underline(document.sourceRangeForNode(pTags[0])), `
    <p>
    ~~~
      This is a paragraph without a closing tag.
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    <p>This is a paragraph with a closing tag.</p>
~~~~`);
            chai_1.assert.deepEqual(yield underliner.underline(document.sourceRangeForNode(pTags[1])), `
    <p>This is a paragraph with a closing tag.</p>
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`);
        }));
        const testName = 'works for unclosed tags with attributes and no text content';
        test(testName, () => __awaiter(this, void 0, void 0, function* () {
            const url = 'unclosed-tag-attributes.html';
            const document = parser.parse(yield analyzer.load(url), url);
            const tag = dom5.query(document.ast, dom5.predicates.hasTagName('tag'));
            chai_1.assert.deepEqual(yield underliner.underline(document.sourceRangeForNode(tag)), `
<tag attr>
~~~~~~~~~~`);
        }));
        test('works for void elements', () => __awaiter(this, void 0, void 0, function* () {
            const linkTags = dom5.queryAll(document.ast, dom5.predicates.hasTagName('link'));
            chai_1.assert.equal(linkTags.length, 2);
            chai_1.assert.deepEqual(yield underliner.underline(document.sourceRangeForNode(linkTags[0])), `
    <link rel="has attributes">
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~`);
            chai_1.assert.deepEqual(yield underliner.underline(document.sourceRangeForNode(linkTags[1])), `
    <link rel="multiline ones too"
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
          foo=bar>
~~~~~~~~~~~~~~~~~~`);
        }));
        test('works for text nodes', () => __awaiter(this, void 0, void 0, function* () {
            const titleTag = dom5.query(document.ast, dom5.predicates.hasTagName('title'));
            chai_1.assert.deepEqual(yield underliner.underline(document.sourceRangeForNode(titleTag.childNodes[0])), `
    <title>
           ~
      This title is a little
~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      complicated.
~~~~~~~~~~~~~~~~~~
        </title>
~~~~~~~~`);
            const pTags = dom5.queryAll(document.ast, dom5.predicates.hasTagName('p'));
            chai_1.assert.equal(pTags.length, 2);
            chai_1.assert.deepEqual(yield underliner.underline(document.sourceRangeForNode(pTags[0].childNodes[0])), `
    <p>
       ~
      This is a paragraph without a closing tag.
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    <p>This is a paragraph with a closing tag.</p>
~~~~`);
            chai_1.assert.deepEqual(yield underliner.underline(document.sourceRangeForNode(pTags[1].childNodes[0])), `
    <p>This is a paragraph with a closing tag.</p>
       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`);
        }));
    });
    suite('sourceRangeForStartTag', () => {
        test('it works for tags with no attributes', () => __awaiter(this, void 0, void 0, function* () {
            const liTags = dom5.queryAll(document.ast, dom5.predicates.hasTagName('li'));
            chai_1.assert.deepEqual(yield underliner.underline(document.sourceRangeForStartTag(liTags[0])), `
        <li>1
        ~~~~`);
            chai_1.assert.deepEqual(yield underliner.underline(document.sourceRangeForStartTag(liTags[1])), `
        <li>2</li>
        ~~~~`);
            chai_1.assert.deepEqual(yield underliner.underline(document.sourceRangeForStartTag(liTags[2])), `
        <li><li>
        ~~~~`);
            chai_1.assert.deepEqual(yield underliner.underline(document.sourceRangeForStartTag(liTags[3])), `
        <li><li>
            ~~~~`);
        }));
        test('it works for void tags with no attributes', () => __awaiter(this, void 0, void 0, function* () {
            const brTags = dom5.queryAll(document.ast, dom5.predicates.hasTagName('br'));
            chai_1.assert.equal(brTags.length, 1);
            chai_1.assert.deepEqual(yield underliner.underline(document.sourceRangeForStartTag(brTags[0])), `
    <br>
    ~~~~`);
        }));
        test('it works for void tags with attributes', () => __awaiter(this, void 0, void 0, function* () {
            const linkTags = dom5.queryAll(document.ast, dom5.predicates.hasTagName('link'));
            chai_1.assert.equal(linkTags.length, 2);
            chai_1.assert.deepEqual(yield underliner.underline(document.sourceRangeForStartTag(linkTags[0])), `
    <link rel="has attributes">
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~`);
            chai_1.assert.deepEqual(yield underliner.underline(document.sourceRangeForStartTag(linkTags[1])), `
    <link rel="multiline ones too"
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
          foo=bar>
~~~~~~~~~~~~~~~~~~`);
        }));
        test('it works for normal elements with attributes', () => __awaiter(this, void 0, void 0, function* () {
            const h1Tags = dom5.queryAll(document.ast, dom5.predicates.hasTagName('h1'));
            chai_1.assert.equal(h1Tags.length, 2);
            chai_1.assert.deepEqual(yield underliner.underline(document.sourceRangeForStartTag(h1Tags[1])), `
    <h1 class="foo" id="bar">
    ~~~~~~~~~~~~~~~~~~~~~~~~~`);
            const complexTags = dom5.queryAll(document.ast, dom5.predicates.hasTagName('complex-tag'));
            chai_1.assert.equal(complexTags.length, 1);
            chai_1.assert.deepEqual(yield underliner.underline(document.sourceRangeForStartTag(complexTags[0])), `
    <complex-tag boolean-attr
    ~~~~~~~~~~~~~~~~~~~~~~~~~
                 string-attr="like this"
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                 multi-line-attr="
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                    can go on
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                    for multiple lines
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                "
~~~~~~~~~~~~~~~~~
                whitespace-around-equals
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                =
~~~~~~~~~~~~~~~~~
                "yes this is legal">
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`);
        }));
    });
    suite('sourceRangeForEndTag', () => {
        test('it works for normal elements', () => __awaiter(this, void 0, void 0, function* () {
            const h1Tags = dom5.queryAll(document.ast, dom5.predicates.hasTagName('h1'));
            chai_1.assert.equal(h1Tags.length, 2);
            chai_1.assert.deepEqual(yield underliner.underline(document.sourceRangeForEndTag(h1Tags[1])), `
    </h1>
    ~~~~~`);
            const complexTags = dom5.queryAll(document.ast, dom5.predicates.hasTagName('complex-tag'));
            chai_1.assert.equal(complexTags.length, 1);
            chai_1.assert.deepEqual(yield underliner.underline(document.sourceRangeForEndTag(complexTags[0])), `
    </complex-tag
    ~~~~~~~~~~~~~
      >
~~~~~~~`);
        }));
    });
    suite('sourceRangeForAttribute', () => {
        const complexTags = dom5.queryAll(document.ast, dom5.predicates.hasTagName('complex-tag'));
        chai_1.assert.equal(complexTags.length, 1);
        test('works for boolean attributes', () => __awaiter(this, void 0, void 0, function* () {
            chai_1.assert.deepEqual(yield underliner.underline(document.sourceRangeForAttribute(complexTags[0], 'boolean-attr')), `
    <complex-tag boolean-attr
                 ~~~~~~~~~~~~`);
        }));
        test('works for one line string attributes', () => __awaiter(this, void 0, void 0, function* () {
            chai_1.assert.deepEqual(yield underliner.underline(document.sourceRangeForAttribute(complexTags[0], 'string-attr')), `
                 string-attr="like this"
                 ~~~~~~~~~~~~~~~~~~~~~~~`);
        }));
        test('works for multiline string attributes', () => __awaiter(this, void 0, void 0, function* () {
            chai_1.assert.deepEqual(yield underliner.underline(document.sourceRangeForAttribute(complexTags[0], 'multi-line-attr')), `
                 multi-line-attr="
                 ~~~~~~~~~~~~~~~~~
                    can go on
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                    for multiple lines
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                "
~~~~~~~~~~~~~~~~~`);
        }));
        test('works for attributes with whitespace around the equals sign', () => __awaiter(this, void 0, void 0, function* () {
            chai_1.assert.deepEqual(yield underliner.underline(document.sourceRangeForAttribute(complexTags[0], 'whitespace-around-equals')), `
                whitespace-around-equals
                ~~~~~~~~~~~~~~~~~~~~~~~~
                =
~~~~~~~~~~~~~~~~~
                "yes this is legal">
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`);
        }));
        suite('for a void element', () => __awaiter(this, void 0, void 0, function* () {
            test('works for a string attribute', () => __awaiter(this, void 0, void 0, function* () {
                const linkTags = dom5.queryAll(document.ast, dom5.predicates.hasTagName('link'));
                chai_1.assert.equal(linkTags.length, 2);
                chai_1.assert.deepEqual(yield underliner.underline(document.sourceRangeForAttribute(linkTags[0], 'rel')), `
    <link rel="has attributes">
          ~~~~~~~~~~~~~~~~~~~~`);
                chai_1.assert.deepEqual(yield underliner.underline(document.sourceRangeForAttribute(linkTags[1], 'foo')), `
          foo=bar>
          ~~~~~~~`);
            }));
        }));
    });
    suite('sourceRangeForAttributeName', () => {
        const complexTags = dom5.queryAll(document.ast, dom5.predicates.hasTagName('complex-tag'));
        chai_1.assert.equal(complexTags.length, 1);
        test('works for boolean attributes', () => __awaiter(this, void 0, void 0, function* () {
            chai_1.assert.deepEqual(yield underliner.underline(document.sourceRangeForAttributeName(complexTags[0], 'boolean-attr')), `
    <complex-tag boolean-attr
                 ~~~~~~~~~~~~`);
        }));
        test('works for one line string attributes', () => __awaiter(this, void 0, void 0, function* () {
            chai_1.assert.deepEqual(yield underliner.underline(document.sourceRangeForAttributeName(complexTags[0], 'string-attr')), `
                 string-attr="like this"
                 ~~~~~~~~~~~`);
        }));
        test('works for multiline string attributes', () => __awaiter(this, void 0, void 0, function* () {
            chai_1.assert.deepEqual(yield underliner.underline(document.sourceRangeForAttributeName(complexTags[0], 'multi-line-attr')), `
                 multi-line-attr="
                 ~~~~~~~~~~~~~~~`);
        }));
        test('works for attributes with whitespace around the equals sign', () => __awaiter(this, void 0, void 0, function* () {
            chai_1.assert.deepEqual(yield underliner.underline(document.sourceRangeForAttributeName(complexTags[0], 'whitespace-around-equals')), `
                whitespace-around-equals
                ~~~~~~~~~~~~~~~~~~~~~~~~`);
        }));
        suite('for a void element', () => __awaiter(this, void 0, void 0, function* () {
            test('works for a string attribute', () => __awaiter(this, void 0, void 0, function* () {
                const linkTags = dom5.queryAll(document.ast, dom5.predicates.hasTagName('link'));
                chai_1.assert.equal(linkTags.length, 2);
                chai_1.assert.deepEqual(yield underliner.underline(document.sourceRangeForAttributeName(linkTags[0], 'rel')), `
    <link rel="has attributes">
          ~~~`);
                chai_1.assert.deepEqual(yield underliner.underline(document.sourceRangeForAttributeName(linkTags[1], 'foo')), `
          foo=bar>
          ~~~`);
            }));
        }));
    });
    suite('sourceRangeForAttributeValue', () => {
        const complexTags = dom5.queryAll(document.ast, dom5.predicates.hasTagName('complex-tag'));
        chai_1.assert.equal(complexTags.length, 1);
        test('returns undefined for boolean attributes', () => __awaiter(this, void 0, void 0, function* () {
            chai_1.assert.deepEqual(document.sourceRangeForAttributeValue(complexTags[0], 'boolean-attr'), undefined);
        }));
        test('works for one line string attributes', () => __awaiter(this, void 0, void 0, function* () {
            chai_1.assert.deepEqual(yield underliner.underline(document.sourceRangeForAttributeValue(complexTags[0], 'string-attr')), `
                 string-attr="like this"
                             ~~~~~~~~~~~`);
        }));
        test('works for multiline string attributes', () => __awaiter(this, void 0, void 0, function* () {
            chai_1.assert.deepEqual(yield underliner.underline(document.sourceRangeForAttributeValue(complexTags[0], 'multi-line-attr')), `
                 multi-line-attr="
                                 ~
                    can go on
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                    for multiple lines
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                "
~~~~~~~~~~~~~~~~~`);
        }));
        test('works for attributes with whitespace around the equals sign', () => __awaiter(this, void 0, void 0, function* () {
            chai_1.assert.deepEqual(yield underliner.underline(document.sourceRangeForAttributeValue(complexTags[0], 'whitespace-around-equals')), `
                "yes this is legal">
                ~~~~~~~~~~~~~~~~~~~`);
        }));
        suite('for a void element', () => __awaiter(this, void 0, void 0, function* () {
            test('works for a string attribute', () => __awaiter(this, void 0, void 0, function* () {
                const linkTags = dom5.queryAll(document.ast, dom5.predicates.hasTagName('link'));
                chai_1.assert.equal(linkTags.length, 2);
                chai_1.assert.deepEqual(yield underliner.underline(document.sourceRangeForAttributeValue(linkTags[0], 'rel')), `
    <link rel="has attributes">
              ~~~~~~~~~~~~~~~~`);
                chai_1.assert.deepEqual(yield underliner.underline(document.sourceRangeForAttributeValue(linkTags[1], 'foo')), `
          foo=bar>
              ~~~`);
            }));
        }));
    });
});

//# sourceMappingURL=html-document_test.js.map
