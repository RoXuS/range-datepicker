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
const ts = require("typescript");
const stripIndent = require("strip-indent");
const typescript_document_1 = require("../../typescript/typescript-document");
const typescript_preparser_1 = require("../../typescript/typescript-preparser");
const model_1 = require("../../model/model");
const test_utils_1 = require("../test-utils");
suite('TypeScriptParser', () => {
    let parser;
    setup(() => {
        parser = new typescript_preparser_1.TypeScriptPreparser();
    });
    suite('parse()', () => {
        test('parses classes', () => {
            const contents = `
        import * as b from './b';

        class Foo extends HTMLElement {
          bar: string = 'baz';
        }
      `;
            const document = parser.parse(contents, '/typescript/test.ts');
            chai_1.assert.instanceOf(document, typescript_document_1.ParsedTypeScriptDocument);
            chai_1.assert.equal(document.url, '/typescript/test.ts');
            const sourceFile = document.ast;
            // very basic check that the file got parsed
            chai_1.assert.equal(sourceFile.statements.length, 2);
            chai_1.assert.equal(sourceFile.statements[0].kind, ts.SyntaxKind.ImportDeclaration);
        });
        test('throws a WarningCarryingException for parse errors', () => __awaiter(this, void 0, void 0, function* () {
            const contents = 'const const const const const #!@(~~)!();';
            const url = 'ts-parse-error.ts';
            let error = undefined;
            try {
                parser.parse(contents, url);
            }
            catch (e) {
                if (!(e instanceof model_1.WarningCarryingException)) {
                    console.log(e);
                    throw new Error('Expected a warning carrying exception.');
                }
                error = e;
            }
            if (error === undefined) {
                throw new Error('Parsing invalid file did not throw!');
            }
            const underliner = test_utils_1.CodeUnderliner.withMapping(url, contents);
            chai_1.assert.deepEqual(yield underliner.underline(error.warning), `
const const const const const #!@(~~)!();
      ~~~~~`);
        }));
        // stringify() not implemented yet
        suite.skip(`stringify()`, () => {
            test('pretty prints output', () => {
                const contents = stripIndent(`
        class Foo extends HTMLElement {
          constructor() {
            super();
            this.bar = () => {
            };
            const let = 'let const';
          }
        }`).trim() +
                    '\n';
                const document = parser.parse(contents, 'test-file.js');
                chai_1.assert.deepEqual(document.stringify({}), contents);
            });
        });
    });
});

//# sourceMappingURL=typescript-preparser_test.js.map
