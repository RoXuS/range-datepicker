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
const analyzer_1 = require("../core/analyzer");
const index_1 = require("../index");
const overlay_loader_1 = require("../url-loader/overlay-loader");
const code_printer_1 = require("../warning/code-printer");
class UnexpectedResolutionError extends Error {
    constructor(message, resolvedValue) {
        super(message);
        this.resolvedValue = resolvedValue;
    }
}
exports.UnexpectedResolutionError = UnexpectedResolutionError;
function invertPromise(promise) {
    return __awaiter(this, void 0, void 0, function* () {
        let value;
        try {
            value = yield promise;
        }
        catch (e) {
            return e;
        }
        throw new UnexpectedResolutionError('Inverted Promise resolved', value);
    });
}
exports.invertPromise = invertPromise;
/**
 * Used for asserting that warnings or source ranges correspond to the right
 * parts of the source code.
 *
 * Non-test code probably wants WarningPrinter instead.
 */
class CodeUnderliner {
    constructor(urlLoader) {
        const analyzer = new analyzer_1.Analyzer({ urlLoader });
        this._parsedDocumentGetter = (url) => __awaiter(this, void 0, void 0, function* () {
            const analysis = yield analyzer.analyze([url]);
            const result = analysis.getDocument(url);
            if (!(result instanceof index_1.Document)) {
                throw new Error(`Unable to parse ${url}`);
            }
            return result.parsedDocument;
        });
    }
    static withMapping(url, contents) {
        const urlLoader = new overlay_loader_1.InMemoryOverlayUrlLoader();
        urlLoader.urlContentsMap.set(url, contents);
        return new CodeUnderliner(urlLoader);
    }
    underline(reference) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Array.isArray(reference)) {
                return Promise.all(reference.map((ref) => this.underline(ref)));
            }
            if (reference === undefined) {
                return 'No source range given.';
            }
            if (isWarning(reference)) {
                return '\n' + reference.toString({ verbosity: 'code-only', color: false });
            }
            // We have a reference without its parsed document. Go get it.
            const parsedDocument = yield this._parsedDocumentGetter(reference.file);
            return '\n' + code_printer_1.underlineCode(reference, parsedDocument);
        });
    }
}
exports.CodeUnderliner = CodeUnderliner;
function isWarning(wOrS) {
    return 'code' in wOrS;
}

//# sourceMappingURL=test-utils.js.map
