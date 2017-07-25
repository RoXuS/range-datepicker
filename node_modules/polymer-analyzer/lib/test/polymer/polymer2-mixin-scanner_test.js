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
const path = require("path");
const analyzer_1 = require("../../core/analyzer");
const class_scanner_1 = require("../../javascript/class-scanner");
const javascript_parser_1 = require("../../javascript/javascript-parser");
const polymer_element_mixin_1 = require("../../polymer/polymer-element-mixin");
const fs_url_loader_1 = require("../../url-loader/fs-url-loader");
const test_utils_1 = require("../test-utils");
suite('Polymer2MixinScanner', () => {
    const testFilesDir = path.resolve(__dirname, '../static/polymer2/');
    const urlLoader = new fs_url_loader_1.FSUrlLoader(testFilesDir);
    const underliner = new test_utils_1.CodeUnderliner(urlLoader);
    const analyzer = new analyzer_1.Analyzer({ urlLoader });
    function getScannedMixins(filename) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = yield urlLoader.load(filename);
            const parser = new javascript_parser_1.JavaScriptParser();
            const document = parser.parse(file, filename);
            const scanner = new class_scanner_1.ClassScanner();
            const visit = (visitor) => Promise.resolve(document.visit([visitor]));
            const { features } = yield scanner.scan(document, visit);
            return features.filter((e) => e instanceof polymer_element_mixin_1.ScannedPolymerElementMixin);
        });
    }
    ;
    function getMixins(filename) {
        return __awaiter(this, void 0, void 0, function* () {
            const analysis = yield analyzer.analyze([filename]);
            return Array.from(analysis.getFeatures({ kind: 'polymer-element-mixin' }));
        });
    }
    ;
    function getTestProps(mixin) {
        return __awaiter(this, void 0, void 0, function* () {
            const properties = [];
            for (const name of mixin.properties.keys()) {
                properties.push({ name });
            }
            const attributes = [];
            for (const name of mixin.attributes.keys()) {
                attributes.push({ name });
            }
            const methods = [];
            for (const { name, params, return: r } of mixin.methods.values()) {
                let processedParams = undefined;
                if (params) {
                    processedParams = params.map(({ name, type, description }) => {
                        const result = { name };
                        if (type != null) {
                            result.type = type;
                        }
                        if (description != null) {
                            result.description = description;
                        }
                        return result;
                    });
                }
                methods.push({ name, return: r, params: processedParams });
            }
            const { name, description, summary } = mixin;
            return {
                name,
                description,
                summary,
                properties,
                attributes,
                methods,
                underlinedWarnings: yield underliner.underline(mixin.warnings)
            };
        });
    }
    test('finds mixin function declarations', () => __awaiter(this, void 0, void 0, function* () {
        const mixins = yield getScannedMixins('test-mixin-1.js');
        const mixinData = yield Promise.all(mixins.map(getTestProps));
        chai_1.assert.deepEqual(mixinData, [{
                name: 'TestMixin',
                description: 'A mixin description',
                summary: 'A mixin summary',
                properties: [{
                        name: 'foo',
                    }],
                attributes: [{
                        name: 'foo',
                    }],
                methods: [],
                underlinedWarnings: []
            }]);
        const underlinedSource = yield underliner.underline(mixins[0].sourceRange);
        chai_1.assert.deepEqual(underlinedSource, `
function TestMixin(superclass) {
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  return class extends superclass {
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    static get properties() {
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      return {
~~~~~~~~~~~~~~
        foo: {
~~~~~~~~~~~~~~
          notify: true,
~~~~~~~~~~~~~~~~~~~~~~~
          type: String,
~~~~~~~~~~~~~~~~~~~~~~~
        },
~~~~~~~~~~
      };
~~~~~~~~
    }
~~~~~
  }
~~~
}
~`);
    }));
    test('finds mixin arrow function expressions', () => __awaiter(this, void 0, void 0, function* () {
        const mixins = yield getScannedMixins('test-mixin-2.js');
        const mixinData = yield Promise.all(mixins.map(getTestProps));
        chai_1.assert.deepEqual(mixinData, [{
                name: 'Polymer.TestMixin',
                description: 'A mixin description',
                summary: 'A mixin summary',
                properties: [{
                        name: 'foo',
                    }],
                attributes: [{
                        name: 'foo',
                    }],
                methods: [],
                underlinedWarnings: []
            }]);
        const underlinedSource = yield underliner.underline(mixins[0].sourceRange);
        chai_1.assert.deepEqual(underlinedSource, `
const TestMixin = (superclass) => class extends superclass {
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  static get properties() {
~~~~~~~~~~~~~~~~~~~~~~~~~~~
    return {
~~~~~~~~~~~~
      foo: {
~~~~~~~~~~~~
        notify: true,
~~~~~~~~~~~~~~~~~~~~~
        type: String,
~~~~~~~~~~~~~~~~~~~~~
      },
~~~~~~~~
    };
~~~~~~
  }
~~~
}
~`);
    }));
    test('finds mixin function expressions', () => __awaiter(this, void 0, void 0, function* () {
        const mixins = yield getScannedMixins('test-mixin-3.js');
        const mixinData = yield Promise.all(mixins.map(getTestProps));
        chai_1.assert.deepEqual(mixinData, [{
                name: 'Polymer.TestMixin',
                description: '',
                summary: '',
                properties: [{
                        name: 'foo',
                    }],
                attributes: [{
                        name: 'foo',
                    }],
                methods: [],
                underlinedWarnings: [],
            }]);
        const underlinedSource = yield underliner.underline(mixins[0].sourceRange);
        chai_1.assert.deepEqual(underlinedSource, `
const TestMixin = function(superclass) {
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  return class extends superclass {
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    static get properties() {
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      return {
~~~~~~~~~~~~~~
        foo: {
~~~~~~~~~~~~~~
          notify: true,
~~~~~~~~~~~~~~~~~~~~~~~
          type: String,
~~~~~~~~~~~~~~~~~~~~~~~
        },
~~~~~~~~~~
      };
~~~~~~~~
    }
~~~~~
  }
~~~
}
~`);
    }));
    test('finds mixin variable declaration with only name, does not use trailing function', () => __awaiter(this, void 0, void 0, function* () {
        const mixins = yield getScannedMixins('test-mixin-4.js');
        const mixinData = yield Promise.all(mixins.map(getTestProps));
        chai_1.assert.deepEqual(mixinData, [{
                name: 'Polymer.TestMixin',
                description: '',
                summary: '',
                properties: [],
                attributes: [],
                methods: [],
                underlinedWarnings: [],
            }]);
        const underlinedSource = yield underliner.underline(mixins[0].sourceRange);
        chai_1.assert.deepEqual(underlinedSource, `
let TestMixin;
~~~~~~~~~~~~~~`);
    }));
    test('what to do on a class marked @mixinFunction?', () => __awaiter(this, void 0, void 0, function* () {
        const mixins = yield getScannedMixins('test-mixin-5.js');
        const mixinData = mixins.map(getTestProps);
        chai_1.assert.deepEqual(mixinData, []);
    }));
    test('finds mixin function declaration with only name', () => __awaiter(this, void 0, void 0, function* () {
        const mixins = yield getScannedMixins('test-mixin-6.js');
        const mixinData = yield Promise.all(mixins.map(getTestProps));
        chai_1.assert.deepEqual(mixinData, [{
                name: 'Polymer.TestMixin',
                description: '',
                summary: '',
                properties: [],
                attributes: [],
                methods: [],
                underlinedWarnings: []
            }]);
        const underlinedSource = yield underliner.underline(mixins[0].sourceRange);
        chai_1.assert.deepEqual(underlinedSource, `
function TestMixin() {
~~~~~~~~~~~~~~~~~~~~~~
}
~`);
    }));
    test('finds mixin assigned to a namespace', () => __awaiter(this, void 0, void 0, function* () {
        const mixins = yield getScannedMixins('test-mixin-7.js');
        const mixinData = yield Promise.all(mixins.map(getTestProps));
        chai_1.assert.deepEqual(mixinData, [{
                name: 'Polymer.TestMixin',
                description: '',
                summary: '',
                properties: [{
                        name: 'foo',
                    }],
                attributes: [{
                        name: 'foo',
                    }],
                methods: [],
                underlinedWarnings: [],
            }]);
        const underlinedSource = yield underliner.underline(mixins[0].sourceRange);
        chai_1.assert.deepEqual(underlinedSource, `
Polymer.TestMixin = Polymer.woohoo(function TestMixin(base) {
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  /**
~~~~~
   * @mixinClass
~~~~~~~~~~~~~~~~
   * @polymer
~~~~~~~~~~~~~
   */
~~~~~
  class TestMixin extends base {
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    static get properties() {
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      return {
~~~~~~~~~~~~~~
        foo: {
~~~~~~~~~~~~~~
          notify: true,
~~~~~~~~~~~~~~~~~~~~~~~
          type: String,
~~~~~~~~~~~~~~~~~~~~~~~
        },
~~~~~~~~~~
      };
~~~~~~~~
    };
~~~~~~
  };
~~~~
  return TestMixin;
~~~~~~~~~~~~~~~~~~~
});
~~`);
    }));
    test('properly analyzes nested mixin assignments with memberof tags', () => __awaiter(this, void 0, void 0, function* () {
        const mixins = yield getScannedMixins('test-mixin-8.js');
        const mixinData = yield Promise.all(mixins.map(getTestProps));
        chai_1.assert.deepEqual(mixinData, [{
                name: 'Polymer.TestMixin',
                description: '',
                summary: '',
                properties: [{
                        name: 'foo',
                    }],
                attributes: [{
                        name: 'foo',
                    }],
                methods: [],
                underlinedWarnings: [],
            }]);
    }));
    test('properly analyzes mixin instance and class methods', () => __awaiter(this, void 0, void 0, function* () {
        const mixins = yield getScannedMixins('test-mixin-9.js');
        const mixinData = yield Promise.all(mixins.map(getTestProps));
        chai_1.assert.deepEqual(mixinData, [
            {
                name: 'TestMixin',
                description: 'A mixin description',
                summary: 'A mixin summary',
                properties: [{
                        name: 'foo',
                    }],
                attributes: [{
                        name: 'foo',
                    }],
                methods: [
                    { name: 'customInstanceFunction', params: [], return: undefined },
                    {
                        name: 'customInstanceFunctionWithJSDoc',
                        params: [], return: {
                            desc: 'The number 5, always.',
                            type: 'Number',
                        },
                    },
                    {
                        name: 'customInstanceFunctionWithParams',
                        params: [{ name: 'a' }, { name: 'b' }, { name: 'c' }], return: undefined,
                    },
                    {
                        name: 'customInstanceFunctionWithParamsAndJSDoc',
                        params: [
                            {
                                name: 'a',
                                type: 'Number',
                                description: 'The first argument',
                            },
                            {
                                name: 'b',
                                type: 'Number',
                            },
                            {
                                name: 'c',
                                type: 'Number',
                                description: 'The third argument',
                            }
                        ],
                        return: {
                            desc: 'The number 7, always.',
                            type: 'Number',
                        },
                    },
                    {
                        name: 'customInstanceFunctionWithParamsAndPrivateJSDoc',
                        params: [], return: undefined,
                    },
                ],
                underlinedWarnings: [],
            }
        ]);
    }));
    test('applies mixins to mixins', () => __awaiter(this, void 0, void 0, function* () {
        const mixins = yield getMixins('test-mixin-10.js');
        const mixinData = yield Promise.all(mixins.map(getTestProps));
        chai_1.assert.deepEqual(mixinData, [
            {
                name: 'Base',
                description: '',
                summary: '',
                attributes: [{ name: 'foo' }],
                methods: [
                    { name: 'baseMethod', params: [], return: undefined },
                    { name: 'privateMethod', params: [], return: undefined },
                    { name: 'privateOverriddenMethod', params: [], return: undefined },
                    { name: 'overrideMethod', params: [], return: undefined },
                ],
                properties: [{ name: 'foo' }],
                underlinedWarnings: [],
            },
            {
                name: 'Middle',
                attributes: [{ name: 'foo' }],
                description: '',
                methods: [
                    { name: 'baseMethod', params: [], return: undefined },
                    { name: 'privateMethod', params: [], return: undefined },
                    { name: 'privateOverriddenMethod', params: [], return: undefined },
                    { name: 'overrideMethod', params: [], return: undefined },
                    { name: 'middleMethod', params: [], return: undefined },
                ],
                properties: [{ name: 'foo' }],
                summary: '',
                underlinedWarnings: [`
    privateOverriddenMethod() { }
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`],
            }
        ]);
    }));
    test('infers properties from the constructor', () => __awaiter(this, void 0, void 0, function* () {
        const mixins = yield getMixins('test-mixin-11.js');
        const mixinData = yield Promise.all(mixins.map(getTestProps));
        chai_1.assert.deepEqual(mixinData, [
            {
                name: 'TestMixin',
                description: '',
                summary: '',
                attributes: [{ name: 'foo' }],
                methods: [],
                properties: [
                    {
                        name: 'foo',
                    },
                    { name: 'constructorProp' }
                ],
                underlinedWarnings: [],
            },
        ]);
        const [mixin] = mixins;
        chai_1.assert.containSubset([...mixin.properties.values()], [
            {
                name: 'foo',
                privacy: 'public',
                description: 'This description is in the constructor.',
                type: 'string',
                published: true,
                notify: true,
                warnings: [],
            },
            {
                name: 'constructorProp',
                default: '10',
                description: 'This property is defined only in the constructor.',
                privacy: 'public',
                warnings: [],
            }
        ]);
    }));
});

//# sourceMappingURL=polymer2-mixin-scanner_test.js.map
