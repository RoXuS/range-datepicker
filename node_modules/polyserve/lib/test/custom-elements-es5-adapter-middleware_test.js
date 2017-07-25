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
const start_server_1 = require("../start_server");
const root = path.join(__dirname, '..', '..', 'test');
const adapterScriptName = 'custom-elements-es5-adapter.js';
suite('custom-elements-es5-adapter-middleware', () => {
    let app;
    beforeEach(() => {
        app = start_server_1.getApp({ root, compile: 'always' });
    });
    test('injects into entry point', () => __awaiter(this, void 0, void 0, function* () {
        yield supertest(app).get('/').expect(200).expect((res) => {
            chai_1.expect(res.text).to.have.string(adapterScriptName);
        });
    }));
    test('does not inject into non entry point', () => __awaiter(this, void 0, void 0, function* () {
        yield supertest(app)
            .get('/components/test-component/test.html')
            .expect(200)
            .expect((res) => {
            chai_1.expect(res.text).to.not.string(adapterScriptName);
        });
    }));
});
//# sourceMappingURL=custom-elements-es5-adapter-middleware_test.js.map