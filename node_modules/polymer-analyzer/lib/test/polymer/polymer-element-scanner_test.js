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
/// <reference path="../../../node_modules/@types/mocha/index.d.ts" />
const chai_1 = require("chai");
const javascript_parser_1 = require("../../javascript/javascript-parser");
const polymer_element_scanner_1 = require("../../polymer/polymer-element-scanner");
const test_utils_1 = require("../test-utils");
suite('PolymerElementScanner', () => {
    suite('scan()', () => {
        let scanner;
        setup(() => {
            scanner = new polymer_element_scanner_1.PolymerElementScanner();
        });
        test('finds polymer elements', () => __awaiter(this, void 0, void 0, function* () {
            const contents = `Polymer({
        is: 'x-foo',
        properties: {
          a: {
            type: Boolean,
            value: 5
          },
          b: {
            type: String,
            value: function() {
              return 'test';
            }
          },
          c: {
            type: Number,
            readOnly: true
          },
          d: {
            type: Number,
            computed: '_computeD(c)'
          },
          e: {
            type: String,
            notify: true
          },
          f: {
            type: Object,
            observer: '_observeF'
          },
          g: {
            type: {},
            computed: '_computeG(a, b)',
            readOnly: false
          },
          h: String,
          all: {
            type: Object,
            notify: true,
            readOnly: false,
            reflectToAttribute: false,
            observer: '_observeAll'
          }
        },
        observers: [
          '_anObserver(foo, bar)',
          '_anotherObserver(foo)'
        ],
        listeners: {
          'event-a': '_handleA',
          eventb: '_handleB',
          'event-c': _handleC,
          [['event', 'd'].join('-')]: '_handleD'
        },
        customPublicMethod: (foo, bar) => { return foo + bar; },
        _customPrivateMethod: (foo, bar) => { return foo + bar; },
        /**
         * This is an instance method with JS Doc
         * @param {string} foo The first argument.
         * @param {number} bar The second argument.
         * @returns {boolean} The return.
         */
        customPublicMethodWithJsDoc: (foo, bar) => { return foo + bar; },
        customPublicMethodWithClassicFunction: function(foo, bar) { return foo + bar; },
      });
      Polymer({
        is: 'x-bar',
        listeners: []
      });`;
            const document = new javascript_parser_1.JavaScriptParser().parse(contents, 'test-document.html');
            const visit = (visitor) => __awaiter(this, void 0, void 0, function* () { return document.visit([visitor]); });
            const { features } = yield scanner.scan(document, visit);
            chai_1.assert.deepEqual(features.map((f) => f.tagName), ['x-foo', 'x-bar']);
            chai_1.assert.deepEqual(features[0].observers.map((o) => o.expression), ['_anObserver(foo, bar)', '_anotherObserver(foo)']);
            chai_1.assert.deepEqual(features[0].observers.map((o) => o.parsedExpression.properties.map((p) => p.name)), [['_anObserver', 'foo', 'bar'], ['_anotherObserver', 'foo']]);
            const properties = Array.from(features[0].properties.values());
            chai_1.assert.deepEqual(properties.filter((p) => p.observerExpression)
                .map((p) => [p.name,
                p.observerExpression.properties.map((sp) => sp.name)]), [['f', ['_observeF']], ['all', ['_observeAll']]]);
            chai_1.assert.deepEqual(properties.filter((p) => p.computedExpression)
                .map((p) => [p.name,
                p.computedExpression.properties.map((sp) => sp.name)]), [['d', ['_computeD', 'c']], ['g', ['_computeG', 'a', 'b']]]);
            chai_1.assert.deepEqual(Array.from(features[0].events.values()).map((e) => e.name), ['e-changed', 'all-changed']);
            chai_1.assert.equal(properties.length, 9);
            chai_1.assert.deepEqual(properties.filter((p) => p.warnings.length > 0)
                .map((p) => [p.name, p.warnings.map((w) => w.message)]), [[
                    'g',
                    [
                        'Invalid type in property object.',
                        'Unable to determine type for property.'
                    ]
                ]]);
            const methods = Array.from(features[0].methods.values());
            chai_1.assert.deepEqual(methods.map((m) => m.name), [
                'customPublicMethod',
                '_customPrivateMethod',
                'customPublicMethodWithJsDoc',
                'customPublicMethodWithClassicFunction',
            ]);
            const jsDocMethod = features[0].methods.get('customPublicMethodWithJsDoc');
            chai_1.assert.deepEqual(jsDocMethod.return, {
                type: 'boolean',
                desc: 'The return.',
            });
            chai_1.assert.deepEqual(jsDocMethod.params.map((p) => [p.name, p.type, p.description]), [
                ['foo', 'string', 'The first argument.'],
                ['bar', 'number', 'The second argument.'],
            ]);
            chai_1.assert.deepEqual(properties.map((p) => [p.name, p.type]), [
                ['a', 'boolean'],
                ['b', 'string'],
                ['c', 'number'],
                ['d', 'number'],
                ['e', 'string'],
                ['f', 'Object'],
                ['g', undefined],
                ['h', 'string'],
                ['all', 'Object']
            ]);
            chai_1.assert.deepEqual(Array.from(features[0].attributes.values())
                .map((p) => [p.name, p.changeEvent]), [
                ['a', undefined],
                ['b', undefined],
                ['c', undefined],
                ['d', undefined],
                ['e', 'e-changed'],
                ['f', undefined],
                ['g', undefined],
                ['h', undefined],
                ['all', 'all-changed']
            ]);
            chai_1.assert.deepEqual(properties.filter((p) => p.readOnly).map((p) => p.name), ['c', 'd', 'g']);
            chai_1.assert.deepEqual(properties.filter((p) => p.default).map((p) => [p.name, p.default]), [['a', '5'], ['b', '"test"']]);
            chai_1.assert.deepEqual(properties.filter((p) => p.notify).map((p) => p.name), ['e', 'all']);
            chai_1.assert.deepEqual(features[0].listeners, [
                { event: 'event-a', handler: '_handleA' },
                { event: 'eventb', handler: '_handleB' }
            ]);
            // Skip not statically analizable entries without emitting a warning
            chai_1.assert.equal(features[0]
                .warnings
                .filter((w) => w.code === 'invalid-listeners-declaration')
                .length, 0);
            // Emit warning for non-object `listeners` literal
            chai_1.assert.equal(features[1]
                .warnings
                .filter((w) => w.code === 'invalid-listeners-declaration')
                .length, 1);
        }));
        test('finds declared and assigned call expressions', () => __awaiter(this, void 0, void 0, function* () {
            const contents = `
          const MyOtherElement = Polymer({
            is: 'my-other-element'
          });

          window.MyElement = Polymer({is: 'my-element'});
      `;
            const document = new javascript_parser_1.JavaScriptParser().parse(contents, 'test-document.html');
            const visit = (visitor) => __awaiter(this, void 0, void 0, function* () { return document.visit([visitor]); });
            const { features } = yield scanner.scan(document, visit);
            chai_1.assert.deepEqual(features.map((f) => f.tagName), ['my-other-element', 'my-element']);
            chai_1.assert.deepEqual(features.map((f) => f.className), ['MyOtherElement', 'window.MyElement']);
        }));
        const testName = 'Produces correct warnings for bad observers and computed properties';
        test(testName, () => __awaiter(this, void 0, void 0, function* () {
            const contents = `
      Polymer({
        is: 'x-foo',
        properties: {
          parseError: {
            type: String,
            computed: 'let let let',
            observer: 'let let let',
          },
          badKindOfExpression: {
            type: String,
            computed: 'foo',
            observer: 'foo(bar, baz)'
          }
        },
        observers: [
          'let let let parseError',
          'foo'
        ],
        method() {
          const shouldIgnore = {
            ignore: 'please',
            meToo: true
          }
        }
      });`;
            const underliner = test_utils_1.CodeUnderliner.withMapping('test-document.html', contents);
            const document = new javascript_parser_1.JavaScriptParser().parse(contents, 'test-document.html');
            const visit = (visitor) => __awaiter(this, void 0, void 0, function* () { return document.visit([visitor]); });
            const { features } = yield scanner.scan(document, visit);
            chai_1.assert.deepEqual(features.length, 1);
            const element = features[0];
            chai_1.assert.deepEqual(Array.from(element.properties.keys()), ['parseError', 'badKindOfExpression']);
            chai_1.assert.deepEqual(yield Promise.all(Array.from(element.properties.values())
                .map((p) => underliner.underline(p.warnings))), [
                [
                    `
            computed: 'let let let',
                           ~`,
                    `
            observer: 'let let let',
                           ~`
                ],
                [
                    `
            computed: 'foo',
                       ~~~`,
                    `
            observer: 'foo(bar, baz)'
                       ~~~~~~~~~~~~~`
                ]
            ]);
            chai_1.assert.deepEqual(yield underliner.underline(element.warnings), [
                `
          'let let let parseError',
               ~`,
                `
          'foo'
           ~~~`
            ]);
        }));
        test('Polymer 2 class observers crash', () => __awaiter(this, void 0, void 0, function* () {
            // When Polymer 2 adopted a static getter for observers, it crashed
            // the Polymer 1 element scanner.
            const contents = `class TestElement extends Polymer.Element {
        static get observers() {
          return foo.bar;
        }
      }`;
            const document = new javascript_parser_1.JavaScriptParser().parse(contents, 'test-document.html');
            const visit = (visitor) => __awaiter(this, void 0, void 0, function* () { return document.visit([visitor]); });
            // Scanning should not throw
            yield scanner.scan(document, visit);
        }));
    });
});

//# sourceMappingURL=polymer-element-scanner_test.js.map
