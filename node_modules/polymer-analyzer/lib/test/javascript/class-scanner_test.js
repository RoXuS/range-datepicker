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
const model_1 = require("../../model/model");
const fs_url_loader_1 = require("../../url-loader/fs-url-loader");
const test_utils_1 = require("../test-utils");
const fixturesDir = path.resolve(__dirname, '../static');
suite('Class', () => {
    const urlLoader = new fs_url_loader_1.FSUrlLoader(fixturesDir);
    const underliner = new test_utils_1.CodeUnderliner(urlLoader);
    const analyzer = new analyzer_1.Analyzer({ urlLoader });
    function getScannedFeatures(filename) {
        return __awaiter(this, void 0, void 0, function* () {
            const file = yield urlLoader.load(filename);
            const parser = new javascript_parser_1.JavaScriptParser();
            const document = parser.parse(file, filename);
            const scanner = new class_scanner_1.ClassScanner();
            const visit = (visitor) => Promise.resolve(document.visit([visitor]));
            const { features } = yield scanner.scan(document, visit);
            return features;
        });
    }
    ;
    function getScannedClasses(filename) {
        return __awaiter(this, void 0, void 0, function* () {
            const features = yield getScannedFeatures(filename);
            return features.filter((e) => e instanceof model_1.ScannedClass);
        });
    }
    ;
    function getClasses(filename) {
        return __awaiter(this, void 0, void 0, function* () {
            const analysis = yield analyzer.analyze([filename]);
            return Array.from(analysis.getFeatures({ kind: 'class' }));
        });
    }
    ;
    function getTestProps(class_) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = {
                name: class_.name,
                description: class_.description,
                privacy: class_.privacy
            };
            if (class_.properties.size > 0) {
                result.properties = [];
                for (const { name } of class_.properties.values()) {
                    result.properties.push({ name });
                }
            }
            if (class_.methods.size > 0) {
                result.methods = [];
                for (const m of class_.methods.values()) {
                    const method = { name: m.name, description: m.description };
                    if (m.params && m.params.length > 0) {
                        method.params = m.params.map((p) => {
                            const param = { name: p.name };
                            if (p.description != null) {
                                param.description = p.description;
                            }
                            if (p.type != null) {
                                param.type = p.type;
                            }
                            return param;
                        });
                    }
                    if (m.return) {
                        method.return = m.return;
                    }
                    const maybeMethod = m;
                    if (maybeMethod.inheritedFrom) {
                        method.inheritedFrom = maybeMethod.inheritedFrom;
                    }
                    result.methods.push(method);
                }
            }
            if (class_.mixins.length > 0) {
                result.mixins = [];
                for (const { identifier } of class_.mixins) {
                    result.mixins.push({ identifier });
                }
            }
            if (class_.warnings.length > 0) {
                result.warnings = yield underliner.underline(class_.warnings);
            }
            if (class_.superClass) {
                result.superClass = class_.superClass.identifier;
            }
            return result;
        });
    }
    ;
    suite('scanning', () => {
        test('finds classes and their names and comment blocks', () => __awaiter(this, void 0, void 0, function* () {
            const classes = yield getScannedClasses('class/class-names.js');
            chai_1.assert.deepEqual(classes.map((c) => c.name), [
                'Declaration',
                'VarDeclaration',
                'Assignment',
                'Namespace.AlsoAssignment',
                'Declared.AnotherAssignment',
                'ClassWithNoJsDoc',
            ]);
            chai_1.assert.deepEqual(yield Promise.all(classes.map((c) => getTestProps(c))), [
                {
                    name: 'Declaration',
                    description: 'A simple declaration',
                    privacy: 'public',
                },
                {
                    description: 'The variable\'s name is used.',
                    name: 'VarDeclaration',
                    privacy: 'public',
                },
                {
                    description: 'The left hand side of the assignment is used.',
                    name: 'Assignment',
                    privacy: 'public',
                },
                {
                    description: 'Namespaced assignments work too',
                    name: 'Namespace.AlsoAssignment',
                    privacy: 'public',
                },
                {
                    description: 'Declared namespace works too',
                    name: 'Declared.AnotherAssignment',
                    privacy: 'public',
                },
                {
                    description: '',
                    name: 'ClassWithNoJsDoc',
                    privacy: 'public',
                },
            ]);
        }));
        test('finds methods', () => __awaiter(this, void 0, void 0, function* () {
            const classes = yield getScannedClasses('class/class-methods.js');
            chai_1.assert.deepEqual(yield Promise.all(classes.map((c) => getTestProps(c))), [
                {
                    name: 'Class',
                    description: '',
                    privacy: 'public',
                    methods: [
                        {
                            name: 'customInstanceFunction',
                            description: '',
                        },
                        {
                            name: 'customInstanceFunctionWithJSDoc',
                            description: 'This is the description for ' +
                                'customInstanceFunctionWithJSDoc.',
                            return: {
                                desc: 'The number 5, always.',
                                type: 'Number',
                            },
                        },
                        {
                            name: 'customInstanceFunctionWithParams',
                            description: '',
                            params: [{ name: 'a' }, { name: 'b' }, { name: 'c' }],
                        },
                        {
                            name: 'customInstanceFunctionWithParamsAndJSDoc',
                            description: 'This is the description for ' +
                                'customInstanceFunctionWithParamsAndJSDoc.',
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
                            description: 'This is the description for\n' +
                                'customInstanceFunctionWithParamsAndPrivateJSDoc.',
                        },
                    ]
                },
            ]);
        }));
        test('deals with super classes correctly', () => __awaiter(this, void 0, void 0, function* () {
            const classes = yield getScannedClasses('class/super-class.js');
            chai_1.assert.deepEqual(classes.map((f) => f.name), ['Base', 'Subclass']);
            chai_1.assert.deepEqual(yield Promise.all(classes.map((c) => getTestProps(c))), [
                {
                    name: 'Base',
                    description: '',
                    privacy: 'public',
                    methods: [
                        {
                            description: 'This is a base method.',
                            name: 'baseMethod',
                        },
                        {
                            description: 'Will be overriden by Subclass.',
                            name: 'overriddenMethod',
                        }
                    ]
                },
                {
                    name: 'Subclass',
                    description: '',
                    privacy: 'public',
                    superClass: 'Base',
                    methods: [
                        {
                            description: 'Overrides the method on Base.',
                            name: 'overriddenMethod',
                        },
                        {
                            description: 'This method only exists on Subclass.',
                            name: 'subMethod',
                        }
                    ]
                }
            ]);
        }));
        const testName = 'does not produce duplicate classes for elements or mixins';
        test(testName, () => __awaiter(this, void 0, void 0, function* () {
            const scannedFeatures = yield getScannedFeatures('class/more-specific-classes.js');
            // Ensures no duplicates
            chai_1.assert.deepEqual(scannedFeatures.map((f) => f.name), ['Element', 'AnnotatedElement', 'Mixin', 'AnnotatedMixin']);
            // Ensures we get the more specific types
            // TODO(rictic): these should probably not be Polymer specific.
            chai_1.assert.deepEqual(scannedFeatures.map((f) => f.constructor.name), [
                'ScannedPolymerElement',
                'ScannedPolymerElement',
                'ScannedPolymerElementMixin',
                'ScannedPolymerElementMixin'
            ]);
        }));
    });
    suite('resolving', () => {
        test('finds classes and their names and descriptions', () => __awaiter(this, void 0, void 0, function* () {
            const classes = yield getClasses('class/class-names.js');
            chai_1.assert.deepEqual(classes.map((c) => c.name), [
                'Declaration',
                'VarDeclaration',
                'Assignment',
                'Namespace.AlsoAssignment',
                'Declared.AnotherAssignment',
                'ClassWithNoJsDoc',
            ]);
            chai_1.assert.deepEqual(yield Promise.all(classes.map((c) => getTestProps(c))), [
                {
                    name: 'Declaration',
                    description: 'A simple declaration',
                    privacy: 'public',
                },
                {
                    description: 'The variable\'s name is used.',
                    name: 'VarDeclaration',
                    privacy: 'public',
                },
                {
                    description: 'The left hand side of the assignment is used.',
                    name: 'Assignment',
                    privacy: 'public',
                },
                {
                    description: 'Namespaced assignments work too',
                    name: 'Namespace.AlsoAssignment',
                    privacy: 'public',
                },
                {
                    description: 'Declared namespace works too',
                    name: 'Declared.AnotherAssignment',
                    privacy: 'public',
                },
                {
                    description: '',
                    name: 'ClassWithNoJsDoc',
                    privacy: 'public',
                },
            ]);
        }));
        test('finds methods', () => __awaiter(this, void 0, void 0, function* () {
            const classes = yield getClasses('class/class-methods.js');
            chai_1.assert.deepEqual(yield Promise.all(classes.map((c) => getTestProps(c))), [
                {
                    name: 'Class',
                    description: '',
                    privacy: 'public',
                    methods: [
                        {
                            name: 'customInstanceFunction',
                            description: '',
                        },
                        {
                            name: 'customInstanceFunctionWithJSDoc',
                            description: 'This is the description for ' +
                                'customInstanceFunctionWithJSDoc.',
                            return: {
                                desc: 'The number 5, always.',
                                type: 'Number',
                            },
                        },
                        {
                            name: 'customInstanceFunctionWithParams',
                            description: '',
                            params: [{ name: 'a' }, { name: 'b' }, { name: 'c' }],
                        },
                        {
                            name: 'customInstanceFunctionWithParamsAndJSDoc',
                            description: 'This is the description for ' +
                                'customInstanceFunctionWithParamsAndJSDoc.',
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
                            description: 'This is the description for\n' +
                                'customInstanceFunctionWithParamsAndPrivateJSDoc.',
                        },
                    ]
                },
            ]);
        }));
        test('deals with super classes correctly', () => __awaiter(this, void 0, void 0, function* () {
            const classes = yield getClasses('class/super-class.js');
            chai_1.assert.deepEqual(classes.map((f) => f.name), ['Base', 'Subclass']);
            chai_1.assert.deepEqual(yield Promise.all(classes.map((c) => getTestProps(c))), [
                {
                    name: 'Base',
                    description: '',
                    privacy: 'public',
                    methods: [
                        {
                            description: 'This is a base method.',
                            name: 'baseMethod',
                        },
                        {
                            description: 'Will be overriden by Subclass.',
                            name: 'overriddenMethod',
                        }
                    ]
                },
                {
                    name: 'Subclass',
                    description: '',
                    privacy: 'public',
                    superClass: 'Base',
                    methods: [
                        {
                            description: 'This is a base method.',
                            name: 'baseMethod',
                            inheritedFrom: 'Base'
                        },
                        {
                            description: 'Overrides the method on Base.',
                            name: 'overriddenMethod',
                        },
                        {
                            description: 'This method only exists on Subclass.',
                            name: 'subMethod',
                        },
                    ]
                }
            ]);
        }));
        const testName = 'does not produce duplicate classes for elements or mixins';
        test(testName, () => __awaiter(this, void 0, void 0, function* () {
            const features = (yield analyzer.analyze([
                'class/more-specific-classes.js'
            ])).getFeatures();
            const interestingFeatures = Array.from(features).filter((f) => f instanceof model_1.Element || f instanceof model_1.ElementMixin ||
                f instanceof model_1.Class);
            // Ensures no duplicates
            chai_1.assert.deepEqual(interestingFeatures.map((f) => f.name), ['Element', 'AnnotatedElement', 'Mixin', 'AnnotatedMixin']);
            // Ensures we get the more specific types
            // TODO(rictic): these should probably not be Polymer specific.
            chai_1.assert.deepEqual(interestingFeatures.map((f) => f.constructor.name), [
                'PolymerElement',
                'PolymerElement',
                'PolymerElementMixin',
                'PolymerElementMixin'
            ]);
        }));
    });
});

//# sourceMappingURL=class-scanner_test.js.map
