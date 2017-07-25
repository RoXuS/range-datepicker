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
const html_parser_1 = require("../../html/html-parser");
const javascript_parser_1 = require("../../javascript/javascript-parser");
const expression_scanner_1 = require("../../polymer/expression-scanner");
const test_utils_1 = require("../test-utils");
suite('ExpressionScanner', () => {
    suite('scanning html for expressions', () => {
        test('finds whole-attribute expressions', () => __awaiter(this, void 0, void 0, function* () {
            const contents = `
        <dom-module id="foo-elem">
          <template>
            <div id="{{foo}}"></div>
            <input value="{{val::changed}}">
            <template is="dom-if">
              <div id="[[bar]]"></div>
            </template>
            <div id="{{bada(wing, daba.boom, 10, -20)}}"></div>
          </template>
          <script>
            Polymer({
              is: 'foo-elem',
            });
          </script>
        </dom-module>

        <div id="{{nope}}"></div>
        <template>
          <div id="{{notHereEither}}"></div>
        </template>

        <template is="dom-bind">
          <div id="{{baz}}"></div>
        </template>
      `;
            const underliner = test_utils_1.CodeUnderliner.withMapping('test.html', contents);
            const document = new html_parser_1.HtmlParser().parse(contents, 'test.html');
            const results = yield expression_scanner_1.scanDocumentForExpressions(document);
            const generalExpressions = results.expressions;
            chai_1.assert.deepEqual(results.warnings, []);
            chai_1.assert.deepEqual(generalExpressions.map((e) => e.databindingInto), ['attribute', 'attribute', 'attribute', 'attribute', 'attribute']);
            const expressions = generalExpressions;
            chai_1.assert.deepEqual(yield underliner.underline(expressions.map((e) => e.sourceRange)), [
                `
            <div id="{{foo}}"></div>
                       ~~~`,
                `
            <input value="{{val::changed}}">
                            ~~~~~~~~~~~~`,
                `
            <div id="{{bada(wing, daba.boom, 10, -20)}}"></div>
                       ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`,
                `
              <div id="[[bar]]"></div>
                         ~~~`,
                `
          <div id="{{baz}}"></div>
                     ~~~`,
            ]);
            chai_1.assert.deepEqual(expressions.map((e) => e.direction), ['{', '{', '{', '[', '{']);
            chai_1.assert.deepEqual(expressions.map((e) => e.expressionText), ['foo', 'val', 'bada(wing, daba.boom, 10, -20)', 'bar', 'baz']);
            chai_1.assert.deepEqual(expressions.map((e) => e.eventName), [undefined, 'changed', undefined, undefined, undefined]);
            chai_1.assert.deepEqual(expressions.map((e) => e.attribute && e.attribute.name), ['id', 'value', 'id', 'id', 'id']);
            chai_1.assert.deepEqual(expressions.map((e) => e.properties.map((p) => p.name)), [['foo'], ['val'], ['bada', 'wing', 'daba'], ['bar'], ['baz']]);
            chai_1.assert.deepEqual(expressions.map((e) => e.warnings), [[], [], [], [], []]);
            chai_1.assert.deepEqual(expressions.map((e) => e.isCompleteBinding), [true, true, true, true, true]);
        }));
        test('finds interpolated attribute expressions', () => __awaiter(this, void 0, void 0, function* () {
            const contents = `
        <template is="dom-bind">
          <div id=" {{foo}}"></div>
          <div id="bar {{val}} baz">
          <div id=" [[x]]{{y}}"></div>
        </template>

        <div id=" {{nope}}"></div>
        <template>
          <div id="{{notHereEither}}"></div>
        </template>

      `;
            const underliner = test_utils_1.CodeUnderliner.withMapping('test.html', contents);
            const document = new html_parser_1.HtmlParser().parse(contents, 'test.html');
            const results = yield expression_scanner_1.scanDocumentForExpressions(document);
            const generalExpressions = results.expressions;
            chai_1.assert.deepEqual(results.warnings, []);
            chai_1.assert.deepEqual(yield underliner.underline(generalExpressions.map((e) => e.sourceRange)), [
                `
          <div id=" {{foo}}"></div>
                      ~~~`,
                `
          <div id="bar {{val}} baz">
                         ~~~`,
                `
          <div id=" [[x]]{{y}}"></div>
                      ~`,
                `
          <div id=" [[x]]{{y}}"></div>
                           ~`
            ]);
            const expressions = generalExpressions;
            chai_1.assert.deepEqual(expressions.map((e) => e.isCompleteBinding), [false, false, false, false]);
            chai_1.assert.deepEqual(expressions.map((e) => e.direction), ['{', '{', '[', '{']);
            chai_1.assert.deepEqual(expressions.map((e) => e.expressionText), ['foo', 'val', 'x', 'y']);
            chai_1.assert.deepEqual(expressions.map((e) => e.properties.map((p) => p.name)), [['foo'], ['val'], ['x'], ['y']]);
            chai_1.assert.deepEqual(expressions.map((e) => e.warnings), [[], [], [], []]);
            chai_1.assert.deepEqual(expressions.map((e) => e.eventName), [undefined, undefined, undefined, undefined]);
            chai_1.assert.deepEqual(expressions.map((e) => e.attribute && e.attribute.name), ['id', 'id', 'id', 'id']);
            chai_1.assert.deepEqual(expressions.map((e) => e.databindingInto), ['attribute', 'attribute', 'attribute', 'attribute']);
        }));
        test('finds expressions in text nodes', () => __awaiter(this, void 0, void 0, function* () {
            const contents = `
        <template is="dom-bind">
          <div>{{foo}}</div>
          <div>
            {{bar}} + {{baz}}[[zod]]
            {{
              multiline(
                expressions
              )
            }}
          </div>
        </template>

        {{nope}}
        <template>
          <div id="{{notHereEither}}"></div>
        </template>
      `;
            const underliner = test_utils_1.CodeUnderliner.withMapping('test.html', contents);
            const document = new html_parser_1.HtmlParser().parse(contents, 'test.html');
            const results = yield expression_scanner_1.scanDocumentForExpressions(document);
            const generalExpressions = results.expressions;
            chai_1.assert.deepEqual(results.warnings, []);
            chai_1.assert.deepEqual(generalExpressions.map((e) => e.databindingInto), ['text-node', 'text-node', 'text-node', 'text-node', 'text-node']);
            const expressions = generalExpressions;
            chai_1.assert.deepEqual(yield underliner.underline(expressions.map((e) => e.sourceRange)), [
                `
          <div>{{foo}}</div>
                 ~~~`,
                `
            {{bar}} + {{baz}}[[zod]]
              ~~~`,
                `
            {{bar}} + {{baz}}[[zod]]
                        ~~~`,
                `
            {{bar}} + {{baz}}[[zod]]
                               ~~~`,
                `
            {{
              ~
              multiline(
~~~~~~~~~~~~~~~~~~~~~~~~
                expressions
~~~~~~~~~~~~~~~~~~~~~~~~~~~
              )
~~~~~~~~~~~~~~~
            }}
~~~~~~~~~~~~`
            ]);
            chai_1.assert.deepEqual(expressions.map((e) => e.direction), ['{', '{', '{', '[', '{']);
            chai_1.assert.deepEqual(expressions.map((e) => e.expressionText), [
                'foo',
                'bar',
                'baz',
                'zod',
                `
              multiline(
                expressions
              )
            `
            ]);
            chai_1.assert.deepEqual(expressions.map((e) => e.properties.map((p) => p.name)), [['foo'], ['bar'], ['baz'], ['zod'], ['multiline', 'expressions']]);
            chai_1.assert.deepEqual(expressions.map((e) => e.warnings), [[], [], [], [], []]);
        }));
        test('gives accurate locations for parse errors', () => __awaiter(this, void 0, void 0, function* () {
            const contents = `
        <template is="dom-bind">
          <div id="{{foo(}}"></div>
          <div id='[[
            foo bar
          ]]'></div>
          {{]}}

          <!-- ignores expressions that are invalid JS -->
          <div id="{{foo(bar.*)}}"></div>
          <div id="{{foo(bar.0)}}"></div>

          <!-- finds warnings in valid JS but invalid Polymer expressions -->
          <div id="{{-foo}}"></div>
          {{foo(!bar, () => baz)}}
        </template>
      `;
            const underliner = test_utils_1.CodeUnderliner.withMapping('test.html', contents);
            const document = new html_parser_1.HtmlParser().parse(contents, 'test.html');
            const results = yield expression_scanner_1.scanDocumentForExpressions(document);
            chai_1.assert.deepEqual(yield underliner.underline(results.warnings.map((w) => w.sourceRange)), [
                `
          <div id="{{foo(}}"></div>
                         ~`,
                `
            foo bar
                ~`,
                `
          {{]}}
            ~`,
                `
          <div id="{{-foo}}"></div>
                     ~~~~`,
                `
          {{foo(!bar, () => baz)}}
                ~~~~`,
                `
          {{foo(!bar, () => baz)}}
                      ~~~~~~~~~`
            ]);
        }));
    });
    suite('parsing expressions from javascript string literals', () => {
        test('it succeeds and fails properly', () => __awaiter(this, void 0, void 0, function* () {
            const contents = `
        const observers = [
          'foo(bar, baz)',
          'foo(bar baz)',
          'foo(bar.*)',
          10,
          observerAssignedElsewhere,
        ];
      `;
            const underliner = test_utils_1.CodeUnderliner.withMapping('test.js', contents);
            const javascriptDocument = new javascript_parser_1.JavaScriptParser().parse(contents, 'test.js');
            const literals = javascriptDocument.ast
                .body[0]['declarations'][0]['init']['elements'];
            const parsedLiterals = literals.map((l) => expression_scanner_1.parseExpressionInJsStringLiteral(javascriptDocument, l, 'full'));
            const warnings = parsedLiterals.map((pl) => pl.warnings)
                .reduce((p, n) => p.concat(n), []);
            const expressionRanges = parsedLiterals.map((pl) => pl.databinding && pl.databinding.sourceRange);
            chai_1.assert.deepEqual(yield underliner.underline(expressionRanges), [
                `
          'foo(bar, baz)',
           ~~~~~~~~~~~~~`,
                `No source range given.`,
                `No source range given.`,
                `No source range given.`,
                `No source range given.`,
            ]);
            chai_1.assert.deepEqual(yield underliner.underline(warnings), [
                `
          'foo(bar baz)',
                   ~`,
                `
          10,
          ~~`,
                `
          observerAssignedElsewhere,
          ~~~~~~~~~~~~~~~~~~~~~~~~~`,
            ]);
        }));
    });
});

//# sourceMappingURL=expression-scanner_test.js.map
