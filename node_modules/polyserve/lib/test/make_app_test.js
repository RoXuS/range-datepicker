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
const supertest = require("supertest-as-promised");
const make_app_1 = require("../make_app");
const root = path.join(__dirname, '..', '..', 'test');
const componentDir = path.join(root, 'components');
suite('makeApp', () => {
    test('returns an app', () => {
        let app = make_app_1.makeApp({ root, componentDir });
        chai_1.assert.isOk(app);
        chai_1.assert.equal(app.packageName, 'polyserve-test');
    });
    test('serves package files', () => __awaiter(this, void 0, void 0, function* () {
        let app = make_app_1.makeApp({ root, componentDir });
        yield supertest(app)
            .get('/polyserve-test/test-file.txt')
            .expect(200, 'PASS\n');
    }));
    test('serves component files', () => __awaiter(this, void 0, void 0, function* () {
        let app = make_app_1.makeApp({
            root,
            componentDir: path.join(root, 'bower_components'),
        });
        yield supertest(app)
            .get('/test-component/test-file.txt')
            .expect(200, 'TEST COMPONENT\n');
    }));
    test('serves component indices', () => __awaiter(this, void 0, void 0, function* () {
        let app = make_app_1.makeApp({
            root,
            componentDir: path.join(root, 'bower_components'),
        });
        yield supertest(app).get('/test-component/').expect(200, 'INDEX\n');
    }));
    test('redirects directories without trailing slashes', () => __awaiter(this, void 0, void 0, function* () {
        let app = make_app_1.makeApp({
            root,
            componentDir: path.join(root, 'bower_components'),
        });
        yield supertest(app)
            .get('/test-component')
            .expect(301)
            .expect('Location', '/test-component/');
    }));
    test('shows friendly error when bower.json does not exist', () => {
        let called = false;
        console.error = function (_e) {
            called = true;
        };
        const app = make_app_1.makeApp({ root: path.resolve(__dirname, 'no_bower_json/'), componentDir });
        chai_1.assert.isFalse(called);
        chai_1.assert.equal(app.packageName, 'no_bower_json');
    });
});
//# sourceMappingURL=make_app_test.js.map