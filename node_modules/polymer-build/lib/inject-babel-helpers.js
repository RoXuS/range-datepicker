"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncIterator) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator];
    return m ? m.call(o) : typeof __values === "function" ? __values(o) : o[Symbol.iterator]();
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);  }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const dom5 = require("dom5");
const mz_1 = require("mz");
const parse5 = require("parse5");
const path = require("path");
const streams_1 = require("./streams");
const p = dom5.predicates;
const scriptOrImport = p.OR(p.hasTagName('script'), p.AND(p.hasTagName('link'), p.hasSpaceSeparatedAttrValue('rel', 'import')));
/**
 * When compiling to ES5 we need to inject Babel's helpers into a global so
 * that they don't need to be included with each compiled file.
 */
class BabelHelpersInjector extends streams_1.AsyncTransformStream {
    constructor(entrypoint) {
        super({ objectMode: true });
        this.entrypoint = entrypoint;
    }
    _transformIter(files) {
        return __asyncGenerator(this, arguments, function* _transformIter_1() {
            try {
                for (var files_1 = __asyncValues(files), files_1_1; files_1_1 = yield __await(files_1.next()), !files_1_1.done;) {
                    const file = yield __await(files_1_1.value);
                    yield yield __await(this.processFile(file));
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (files_1_1 && !files_1_1.done && (_a = files_1.return)) yield __await(_a.call(files_1));
                }
                finally { if (e_1) throw e_1.error; }
            }
            var e_1, _a;
        });
    }
    processFile(file) {
        return __awaiter(this, void 0, void 0, function* () {
            if (file.path !== this.entrypoint) {
                return file;
            }
            const contents = yield streams_1.getFileContents(file);
            const document = parse5.parse(contents);
            const babelHelpersFragment = parse5.parseFragment('\n\n<script></script>\n\n');
            dom5.setTextContent(babelHelpersFragment.childNodes[1], yield mz_1.fs.readFile(path.join(__dirname, 'babel-helpers.min.js'), 'utf-8'));
            const firstScriptOrImport = dom5.nodeWalk(document, scriptOrImport);
            if (firstScriptOrImport) {
                dom5.insertBefore(firstScriptOrImport.parentNode, firstScriptOrImport, babelHelpersFragment);
            }
            else {
                const head = dom5.query(document, dom5.predicates.hasTagName('head')) || document;
                dom5.append(head, babelHelpersFragment);
            }
            const newFile = file.clone();
            newFile.contents = new Buffer(parse5.serialize(document), 'utf-8');
            return newFile;
        });
    }
}
exports.BabelHelpersInjector = BabelHelpersInjector;
