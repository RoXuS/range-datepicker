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
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const fs = require("fs");
const path = require("path");
const supertest = require("supertest-as-promised");
const compile_middleware_1 = require("../compile-middleware");
const start_server_1 = require("../start_server");
chai.use(chaiAsPromised);
const assert = chai.assert;
const root = path.join(__dirname, '..', '..', 'test');
const userAgentsThatDontSupportES2015 = [
    'unknown browser',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36 Edge/14.99999',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36 Edge/15.14986',
];
const userAgentsThatSupportES2015 = [
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.98 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36 Edge/15.15063',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36 Edge/16.00000',
];
suite('compile-middleware', () => {
    suite('babelCompileCache', () => {
        let app;
        const uncompiledHtml = fs.readFileSync(path.join(root, 'bower_components/test-component/test.html'))
            .toString();
        const uncompiledJs = fs.readFileSync(path.join(root, 'bower_components/test-component/test.js'))
            .toString();
        beforeEach(() => {
            app = start_server_1.getApp({
                root: root,
                compile: 'always',
                componentDir: path.join(root, 'bower_components'),
            });
            // Ensure a fresh cache for each test.
            compile_middleware_1.babelCompileCache.reset();
        });
        test('caches html compilation results', () => __awaiter(this, void 0, void 0, function* () {
            assert(!compile_middleware_1.babelCompileCache.has(uncompiledHtml));
            const response = yield supertest(app).get('/components/test-component/test.html');
            assert(compile_middleware_1.babelCompileCache.has(uncompiledHtml));
            assert.equal(response.text, compile_middleware_1.babelCompileCache.get(uncompiledHtml));
            assert.equal(response.text.indexOf('class A {}'), -1, 'Did not compile');
        }));
        test('returns cached html compilation results', () => __awaiter(this, void 0, void 0, function* () {
            compile_middleware_1.babelCompileCache.set(uncompiledHtml, 'IM IN UR CACHE');
            const response = yield supertest(app).get('/components/test-component/test.html');
            assert.equal(response.text, 'IM IN UR CACHE');
        }));
        test('caches javascript compilation results', () => __awaiter(this, void 0, void 0, function* () {
            assert(!compile_middleware_1.babelCompileCache.has(uncompiledJs));
            const response = yield supertest(app).get('/components/test-component/test.js');
            assert(compile_middleware_1.babelCompileCache.has(uncompiledJs));
            assert.equal(response.text, compile_middleware_1.babelCompileCache.get(uncompiledJs));
            assert.equal(response.text.indexOf('class A {}'), -1, 'Did not compile');
        }));
        test('returns cached js compilation results', () => __awaiter(this, void 0, void 0, function* () {
            compile_middleware_1.babelCompileCache.set(uncompiledJs, 'IM IN UR CACHE');
            const response = yield supertest(app).get('/components/test-component/test.js');
            assert.equal(response.text, 'IM IN UR CACHE');
        }));
        test('honors the cache max evicting least recently used', () => __awaiter(this, void 0, void 0, function* () {
            yield supertest(app).get('/components/test-component/test.html');
            assert(compile_middleware_1.babelCompileCache.has(uncompiledHtml));
            const originalMax = compile_middleware_1.babelCompileCache['max'];
            compile_middleware_1.babelCompileCache['max'] = compile_middleware_1.babelCompileCache.length;
            try {
                yield supertest(app).get('/components/test-component/test.js');
                assert(!compile_middleware_1.babelCompileCache.has(uncompiledHtml), 'cached html evicted');
            }
            finally {
                compile_middleware_1.babelCompileCache['max'] = originalMax;
            }
        }));
        test('script tags with invalid javascript are unchanged', () => __awaiter(this, void 0, void 0, function* () {
            const uncompiled = fs
                .readFileSync(path.join(root, 'bower_components/compile-test/script-tags.html'))
                .toString();
            assert(!compile_middleware_1.babelCompileCache.has(uncompiled), 'Unexpected entry in cache');
            const response = yield supertest(app).get('/components/compile-test/script-tags.html');
            assert(compile_middleware_1.babelCompileCache.has(uncompiled), 'Missing cache entry');
            assert.include(response.text, `<script>\nthis is not valid\n</script>`);
            // The valid script tag should still be compiled.
            assert.notInclude(response.text, `<script>\nclass A {}\n</script>`);
        }));
        suite('with compile option set to \'auto\'', () => {
            beforeEach(() => {
                app = start_server_1.getApp({
                    root: root,
                    compile: 'auto',
                    componentDir: path.join(root, 'bower_components'),
                });
                // Ensure a fresh cache for each test.
                compile_middleware_1.babelCompileCache.reset();
            });
            test('detect user-agents that do not need compilation', () => __awaiter(this, void 0, void 0, function* () {
                assert.isFalse(compile_middleware_1.babelCompileCache.has(`Unexpected .js file in cache`));
                for (const userAgent of userAgentsThatSupportES2015) {
                    const response = yield supertest(app)
                        .get('/components/test-component/test.js')
                        .set('User-Agent', userAgent);
                    assert.isFalse(compile_middleware_1.babelCompileCache.has(uncompiledJs), `Unexpected .js file in cache User-Agent ${userAgent}`);
                    assert.include(response.text, 'class A {}', `Unexpected compilation for User-Agent ${userAgent}`);
                    compile_middleware_1.babelCompileCache.reset();
                }
            }));
            test('detect user-agents that need compilation', () => __awaiter(this, void 0, void 0, function* () {
                assert.isFalse(compile_middleware_1.babelCompileCache.has(`Unexpected .js file in cache`));
                for (const userAgent of userAgentsThatDontSupportES2015) {
                    const response = yield supertest(app)
                        .get('/components/test-component/test.js')
                        .set('User-Agent', userAgent);
                    assert.isTrue(compile_middleware_1.babelCompileCache.has(uncompiledJs), `Expected .js file in cache User-Agent ${userAgent}`);
                    assert.notInclude(response.text, 'class A {}', `Expected compilation for User-Agent ${userAgent}`);
                    compile_middleware_1.babelCompileCache.reset();
                }
            }));
        });
    });
    test('browserNeedsCompilation', () => {
        for (const userAgent of userAgentsThatDontSupportES2015) {
            assert.equal(compile_middleware_1.browserNeedsCompilation(userAgent), true, userAgent);
        }
        for (const userAgent of userAgentsThatSupportES2015) {
            assert.equal(compile_middleware_1.browserNeedsCompilation(userAgent), false, userAgent);
        }
    });
    test('isPolyfill', () => {
        assert.isTrue(compile_middleware_1.isPolyfill.test('/webcomponentsjs/custom-elements-es5-adapter.js'));
        assert.isTrue(compile_middleware_1.isPolyfill.test('/webcomponentsjs/webcomponents-lite.js'));
        assert.isTrue(compile_middleware_1.isPolyfill.test('/bower_components/webcomponentsjs/webcomponents-lite.js'));
        assert.isFalse(compile_middleware_1.isPolyfill.test('/webcomponentsjs/tests/ce-import.html'));
        assert.isFalse(compile_middleware_1.isPolyfill.test('/webcomponentsjs/tests/imports/current-script.js'));
        assert.isFalse(compile_middleware_1.isPolyfill.test('/notwebcomponentsjs/webcomponents-lite.js'));
    });
});
//# sourceMappingURL=compile-middleware_test.js.map