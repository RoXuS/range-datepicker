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
const fs = require("fs");
const path = require("path");
const generate_analysis_1 = require("../../analysis-format/generate-analysis");
const analyzer_1 = require("../../core/analyzer");
const fs_url_loader_1 = require("../../url-loader/fs-url-loader");
const package_url_resolver_1 = require("../../url-loader/package-url-resolver");
const onlyTests = new Set([]); // Should be empty when not debugging.
// TODO(rictic): work out how we want to handle ignoring elements from other
//     packages in the world of Document rather than Analysis.
const skipTests = new Set(['bower_packages', 'nested-packages']);
const fixturesDir = path.join(__dirname, '..', 'static');
suite('generate-analysis', () => {
    suite('generateAnalysisMetadata', () => {
        suite('generates for Document array from fixtures', () => {
            const basedir = path.join(fixturesDir, 'analysis');
            const analysisFixtureDirs = fs.readdirSync(basedir)
                .map((p) => path.join(basedir, p))
                .filter((p) => fs.statSync(p).isDirectory());
            for (const analysisFixtureDir of analysisFixtureDirs) {
                // Generate a test from the goldens found in every dir in
                // src/test/static/analysis/
                const testBaseName = path.basename(analysisFixtureDir);
                const testDefiner = onlyTests.has(testBaseName) ?
                    test.only :
                    skipTests.has(testBaseName) ? test.skip : test;
                const testName = `produces a correct analysis.json ` +
                    `for fixture dir \`${testBaseName}\``;
                testDefiner(testName, () => __awaiter(this, void 0, void 0, function* () {
                    // Test body here:
                    const documents = yield analyzeDir(analysisFixtureDir);
                    const packages = new Set(mapI(filterI(walkRecursively(analysisFixtureDir), (p) => p.endsWith('bower.json') || p.endsWith('package.json')), (p) => path.dirname(p)));
                    if (packages.size === 0) {
                        packages.add(analysisFixtureDir);
                    }
                    for (const packagePath of packages) {
                        const pathToGolden = path.join(packagePath || '', 'analysis.json');
                        const renormedPackagePath = packagePath ?
                            packagePath.substring(analysisFixtureDir.length + 1) :
                            packagePath;
                        const analysisWithUndefineds = generate_analysis_1.generateAnalysis(documents, renormedPackagePath);
                        generate_analysis_1.validateAnalysis(analysisWithUndefineds);
                        const analysis = JSON.parse(JSON.stringify(analysisWithUndefineds));
                        const golden = JSON.parse(fs.readFileSync(pathToGolden, 'utf-8'));
                        try {
                            const shortPath = path.relative(fixturesDir, pathToGolden);
                            chai_1.assert.deepEqual(analysis, golden, `Generated form of ${shortPath} ` +
                                `differs from the golden at that path`);
                        }
                        catch (e) {
                            console.log(`Expected contents of ${pathToGolden}:\n` +
                                `${JSON.stringify(analysis, null, 2)}`);
                            throw e;
                        }
                    }
                }));
            }
        });
        suite('generates from package', () => {
            test('does not include external features', () => __awaiter(this, void 0, void 0, function* () {
                const basedir = path.resolve(fixturesDir, 'analysis/bower_packages');
                const analyzer = new analyzer_1.Analyzer({
                    urlLoader: new fs_url_loader_1.FSUrlLoader(basedir),
                    urlResolver: new package_url_resolver_1.PackageUrlResolver(),
                });
                const _package = yield analyzer.analyzePackage();
                const metadata = generate_analysis_1.generateAnalysis(_package, '');
                // The fixture only contains external elements
                chai_1.assert.isUndefined(metadata.elements);
            }));
            test('includes package features', () => __awaiter(this, void 0, void 0, function* () {
                const basedir = path.resolve(fixturesDir, 'analysis/simple');
                const analyzer = new analyzer_1.Analyzer({
                    urlLoader: new fs_url_loader_1.FSUrlLoader(basedir),
                    urlResolver: new package_url_resolver_1.PackageUrlResolver(),
                });
                const _package = yield analyzer.analyzePackage();
                const metadata = generate_analysis_1.generateAnalysis(_package, '');
                chai_1.assert.equal(metadata.elements && metadata.elements.length, 1);
                chai_1.assert.equal(metadata.elements[0].tagname, 'simple-element');
                chai_1.assert.equal(metadata.elements[0].path, 'simple-element.html');
            }));
        });
    });
    suite('validateAnalysis', () => {
        test('throws when validating valid analysis.json', () => {
            try {
                generate_analysis_1.validateAnalysis({});
            }
            catch (err) {
                chai_1.assert.instanceOf(err, generate_analysis_1.ValidationError);
                const valError = err;
                chai_1.assert(valError.errors.length > 0);
                chai_1.assert.include(valError.message, `requires property "schema_version"`);
                return;
            }
            throw new Error('expected Analysis validation to fail!');
        });
        test(`doesn't throw when validating a valid analysis.json`, () => {
            generate_analysis_1.validateAnalysis({ elements: [], schema_version: '1.0.0' });
        });
        test(`doesn't throw when validating a version from the future`, () => {
            generate_analysis_1.validateAnalysis({
                elements: [],
                schema_version: '1.0.1',
                new_field: 'stuff here'
            });
        });
        test(`throws when validating a bad version`, () => {
            try {
                generate_analysis_1.validateAnalysis({
                    elements: [],
                    schema_version: '5.1.1',
                    new_field: 'stuff here'
                });
            }
            catch (e) {
                chai_1.assert.include(e.message, 'Invalid schema_version in AnalyzedPackage');
                return;
            }
            throw new Error('expected Analysis validation to fail!');
        });
    });
});
function* filterI(it, pred) {
    for (const inst of it) {
        if (pred(inst)) {
            yield inst;
        }
    }
}
function* mapI(it, trans) {
    for (const inst of it) {
        yield trans(inst);
    }
}
function* walkRecursively(dir) {
    for (const filename of fs.readdirSync(dir)) {
        const fullPath = path.join(dir, filename);
        if (fs.statSync(fullPath).isDirectory()) {
            for (const f of walkRecursively(fullPath)) {
                yield f;
            }
        }
        else {
            yield fullPath;
        }
    }
}
function analyzeDir(baseDir) {
    return __awaiter(this, void 0, void 0, function* () {
        const analyzer = new analyzer_1.Analyzer({
            urlLoader: new fs_url_loader_1.FSUrlLoader(baseDir),
            urlResolver: new package_url_resolver_1.PackageUrlResolver(),
        });
        const allFilenames = Array.from(walkRecursively(baseDir));
        const htmlOrJsFilenames = allFilenames.filter((f) => f.endsWith('.html') || f.endsWith('.js'));
        const filePaths = htmlOrJsFilenames.map((filename) => path.relative(baseDir, filename));
        return analyzer.analyze(filePaths);
    });
}

//# sourceMappingURL=generate-analysis_test.js.map
