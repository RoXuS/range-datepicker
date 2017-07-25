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
const chai_1 = require("chai");
const chaiAsPromised = require("chai-as-promised");
const fs = require("mz/fs");
const path = require("path");
const pem = require("pem");
const sinon = require("sinon");
const http = require("spdy");
const supertest = require("supertest-as-promised");
const tmp = require("tmp");
const start_server_1 = require("../start_server");
const start_server_2 = require("../start_server");
chai.use(chaiAsPromised);
const assert = chai.assert;
const root = path.join(__dirname, '..', '..', 'test');
suite('startServer', () => {
    test('returns an app', () => {
        const app = start_server_1.getApp({});
        assert.isOk(app);
    });
    test('serves root application files', () => __awaiter(this, void 0, void 0, function* () {
        const app = start_server_1.getApp({ root });
        yield supertest(app).get('/test-file.txt').expect(200, 'PASS\n');
    }));
    test('serves root application files if root isn\'t set', () => __awaiter(this, void 0, void 0, function* () {
        const cwd = process.cwd();
        try {
            process.chdir(root);
            const app = start_server_1.getApp({});
            yield supertest(app).get('/test-file.txt').expect(200, 'PASS\n');
        }
        finally {
            process.chdir(cwd);
        }
    }));
    test('serves component files', () => __awaiter(this, void 0, void 0, function* () {
        const app = start_server_1.getApp({ root });
        yield supertest(app)
            .get('/bower_components/test-component/test-file.txt')
            .expect(200, 'TEST COMPONENT\n');
    }));
    test('serves default entry point index.html instead of 404', () => __awaiter(this, void 0, void 0, function* () {
        const app = start_server_1.getApp({ root });
        yield supertest(app).get('/foo').expect(200).expect((res) => {
            chai_1.expect(res.text).to.have.string('INDEX');
        });
    }));
    test('serves custom entry point from "/"', () => __awaiter(this, void 0, void 0, function* () {
        const app = start_server_1.getApp({
            root,
            entrypoint: path.join(root, 'custom-entry.html'),
        });
        yield supertest(app).get('/').expect(200).expect((res) => {
            chai_1.expect(res.text).to.have.string('CUSTOM-ENTRY');
        });
    }));
    test('serves custom entry point instead of 404', () => __awaiter(this, void 0, void 0, function* () {
        const app = start_server_1.getApp({
            root,
            entrypoint: path.join(root, 'custom-entry.html'),
        });
        yield supertest(app).get('/not/a/file').expect(200).expect((res) => {
            chai_1.expect(res.text).to.have.string('CUSTOM-ENTRY');
        });
    }));
    ['html', 'js', 'json', 'css', 'png', 'jpg', 'jpeg', 'gif'].forEach((ext) => {
        test(`404s ${ext} files`, () => __awaiter(this, void 0, void 0, function* () {
            const app = start_server_1.getApp({ root });
            yield supertest(app).get('/foo.' + ext).expect(404);
        }));
    });
    suite('compilation', () => {
        const testCompilation = (options) => () => __awaiter(this, void 0, void 0, function* () {
            const url = options.url;
            const agent = options.agent;
            const compile = options.compile;
            const result = options.result;
            const app = start_server_1.getApp({
                root: root,
                componentDir: path.join(root, 'bower_components'),
                compile: compile,
            });
            let request = supertest(app).get(url);
            if (agent) {
                request = request.set('User-Agent', agent);
            }
            const response = yield request;
            const isCompiled = response.text.indexOf('class A {}') === -1;
            const shouldCompile = result === 'compiled';
            if (isCompiled && !shouldCompile) {
                throw new Error('Source was compiled');
            }
            else if (!isCompiled && shouldCompile) {
                throw new Error('Source was not compiled');
            }
        });
        test('compiles external component JS when --compile=always', testCompilation({
            url: '/components/test-component/test.js',
            compile: 'always',
            result: 'compiled',
        }));
        test('compiles external app JS when --compile=always', testCompilation({
            url: '/test.js',
            compile: 'always',
            result: 'compiled',
        }));
        test('compiles inline component JS when --compile=always', testCompilation({
            url: '/components/test-component/test.html',
            compile: 'always',
            result: 'compiled',
        }));
        test('compiles inline app JS when --compile=always', testCompilation({
            url: '/test.html',
            compile: 'always',
            result: 'compiled',
        }));
        test('doesn\'t compile external JS when --compile=never', testCompilation({
            url: '/components/test-component/test.js',
            compile: 'never',
            result: 'uncompiled',
        }));
        test('doesn\'t compile inline JS when --compile=never', testCompilation({
            url: '/components/test-component/test.html',
            compile: 'never',
            result: 'uncompiled',
        }));
        test('doesn\'t compile external JS when --compile=auto and agent is Chrome', testCompilation({
            url: '/components/test-component/test.js',
            agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.52 Safari/537.36',
            compile: 'auto',
            result: 'uncompiled',
        }));
        test('compiles external JS when --compile=auto and agent is unknown', testCompilation({
            url: '/components/test-component/test.js',
            compile: 'auto',
            result: 'compiled',
        }));
    });
    suite('proxy', () => {
        let consoleError;
        let consoleWarn;
        let proxyServer;
        let app;
        function setUpProxy(path) {
            return __awaiter(this, void 0, void 0, function* () {
                app = yield start_server_2.startServer({ root });
                return proxyServer = yield start_server_2.startServer({
                    port: 0,
                    root: __dirname,
                    proxy: {
                        path: path,
                        target: `http://localhost:${app.address().port}/`
                    }
                });
            });
        }
        setup(() => {
            consoleError = console.error;
            consoleWarn = console.warn;
        });
        teardown(() => __awaiter(this, void 0, void 0, function* () {
            console.error = consoleError;
            console.warn = consoleWarn;
            yield Promise.all([
                proxyServer && new Promise((resolve, _) => proxyServer.close(resolve)),
                new Promise((resolve, _) => app.close(resolve)),
            ]);
        }));
        test('rewrites directory with proxy', () => __awaiter(this, void 0, void 0, function* () {
            yield setUpProxy('normally-non-existing-path');
            yield supertest(proxyServer)
                .get('/normally-non-existing-path/bower_components/test-component/test-file.txt')
                .expect(200, 'TEST COMPONENT\n');
        }));
        test('warns when path contains special regex characters', () => __awaiter(this, void 0, void 0, function* () {
            const spy = sinon.spy();
            console.warn = spy;
            app = yield start_server_2.startServer({ root: __dirname, proxy: { path: '+regex?path*', target: 'target' } });
            assert.equal(spy.callCount, 3);
        }));
        test('handles additional slashes at start or end of path', () => __awaiter(this, void 0, void 0, function* () {
            yield setUpProxy('/api/v1/');
            yield supertest(proxyServer)
                .get('/api/v1/bower_components/test-component/test-file.txt')
                .expect(200, 'TEST COMPONENT\n');
        }));
        test('does not set up proxy that starts with components', () => __awaiter(this, void 0, void 0, function* () {
            const spy = sinon.spy();
            console.error = spy;
            app = yield start_server_2.startServer({ root: __dirname, proxy: { path: 'components', target: 'target' } });
            assert.isTrue(spy.calledOnce);
        }));
        test('redirects to root of proxy', () => __awaiter(this, void 0, void 0, function* () {
            yield setUpProxy('api/v1');
            yield supertest(proxyServer)
                .get('/api/v1/')
                .expect(200)
                .expect((res) => {
                chai_1.expect(res.text).to.have.string('INDEX');
            });
        }));
    });
    suite('h2', () => {
        let _certFile;
        let _keyFile;
        let _nodeVersion;
        let _serverOptions;
        let _stubServer;
        _setupNodeVersion();
        suiteSetup(() => {
            _setupServerOptions();
            _setupStubServer();
        });
        suiteTeardown(() => {
            _teardownStubServer();
        });
        test('rejects unsupported Node version (< 5) only', function () {
            if (_nodeVersion < 5) {
                return assert.isRejected(start_server_2.startServer(_serverOptions));
            }
            else {
                return assert.becomes(_startStubServer(_serverOptions), _stubServer);
            }
        });
        // Only run h2 tests for Node versions that support ALPN
        const suiteDef = (_nodeVersion < 5) ? suite.skip : suite;
        suiteDef('node5+', () => {
            setup(() => {
                _setupServerOptions();
            });
            test('generates new TLS cert/key if unspecified', () => __awaiter(this, void 0, void 0, function* () {
                const createCertSpy = sinon.spy(pem, 'createCertificate');
                // reset paths to key/cert files so that default paths are used
                _serverOptions.keyPath = undefined;
                _serverOptions.certPath = undefined;
                const certFilePath = 'cert.pem';
                const keyFilePath = 'key.pem';
                _deleteFiles([certFilePath, keyFilePath]);
                try {
                    const server = yield _startStubServer(_serverOptions);
                    assert.isOk(server);
                    yield sinon.assert.calledOnce(createCertSpy);
                    yield Promise.all([
                        fs.readFile(certFilePath)
                            .then(buf => _assertValidCert(buf.toString())),
                        fs.readFile(keyFilePath)
                            .then(buf => _assertValidKey(buf.toString()))
                    ]);
                    yield _deleteFiles([certFilePath, keyFilePath]);
                    yield new Promise((resolve) => server.close(resolve));
                }
                finally {
                    createCertSpy.restore();
                }
            }));
            test('generates new TLS cert/key if specified files blank', () => __awaiter(this, void 0, void 0, function* () {
                const createCertSpy = sinon.spy(pem, 'createCertificate');
                try {
                    const server = yield _startStubServer(_serverOptions);
                    assert.isOk(server);
                    yield sinon.assert.calledOnce(createCertSpy);
                    yield Promise.all([
                        // _certFile and _keyFile point to newly created (blank) temp
                        // files
                        fs.readFile(_certFile.name)
                            .then(buf => _assertValidCert(buf.toString())),
                        fs.readFile(_keyFile.name)
                            .then(buf => _assertValidKey(buf.toString()))
                    ]);
                    yield new Promise((resolve) => server.close(resolve));
                }
                finally {
                    createCertSpy.restore();
                }
            }));
            test('reuses TLS cert/key', () => __awaiter(this, void 0, void 0, function* () {
                _serverOptions.keyPath = path.join(root, 'key.pem');
                _serverOptions.certPath = path.join(root, 'cert.pem');
                const createCertSpy = sinon.spy(pem, 'createCertificate');
                try {
                    const server = yield _startStubServer(_serverOptions);
                    assert.isOk(server);
                    yield sinon.assert.notCalled(createCertSpy);
                    yield new Promise((resolve) => server.close(resolve));
                }
                finally {
                    createCertSpy.restore();
                }
            }));
            test('throws error for blank h2-push manifest', () => {
                const dummyFile = tmp.fileSync();
                _serverOptions.pushManifestPath = dummyFile.name;
                assert.throws(() => start_server_1.getApp(_serverOptions));
            });
            test.skip('pushes only files specified in manifest', () => {
                // TODO: Implement
            });
            test.skip('pushes only files specified in link-preload header', () => {
                // TODO: Implement
            });
            test.skip('does not push files specified as nopush in link-preload header', () => {
                // TODO: Implement
            });
            test.skip('rejects nonexistent file in manifest', () => {
                // TODO: Implement
            });
            test.skip('accepts root path in manifest', () => {
                // TODO: Implement
            });
        });
        function _setupServerOptions() {
            _keyFile = tmp.fileSync();
            _certFile = tmp.fileSync();
            _serverOptions = {
                root,
                protocol: 'h2',
                keyPath: _keyFile.name,
                certPath: _certFile.name
            };
        }
        function _setupNodeVersion() {
            const matches = /(\d+)\./.exec(process.version);
            if (matches) {
                _nodeVersion = Number(matches[1]);
            }
        }
        let createServerStub;
        function _setupStubServer() {
            _stubServer =
                sinon.createStubInstance(http['Server']);
            createServerStub = sinon.stub(http, 'createServer').returns(_stubServer);
            _stubServer.close = (cb) => cb.call(_stubServer);
        }
        function _teardownStubServer() {
            createServerStub.restore();
        }
        function _startStubServer(options) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise(resolve => {
                    _stubServer.listen = (() => resolve(_stubServer));
                    start_server_2.startServer(options);
                });
            });
        }
        function _assertValidCert(cert) {
            return new Promise((resolve, reject) => {
                if (!cert) {
                    reject(new Error('invalid cert'));
                }
                else {
                    pem.readCertificateInfo(cert, (err) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve();
                        }
                    });
                }
            });
        }
        function _assertValidKey(key) {
            return new Promise((resolve, reject) => {
                if (/BEGIN[^]+?KEY[^]+END[^]+?KEY/.test(key)) {
                    resolve();
                }
                else {
                    reject(new Error('invalid key'));
                }
            });
        }
        function _deleteFiles(files) {
            for (const file of files) {
                try {
                    fs.unlinkSync(file);
                }
                catch (e) {
                    // ignore
                }
            }
        }
    });
});
suite('startServers', () => {
    suite('variants', () => {
        const variantsRoot = path.join(root, 'variants');
        let prevCwd;
        setup(() => {
            prevCwd = process.cwd();
            process.chdir(variantsRoot);
        });
        teardown(() => {
            process.chdir(prevCwd);
        });
        test('serves files out of a given components directory', () => __awaiter(this, void 0, void 0, function* () {
            const servers = yield start_server_2.startServers({});
            if (servers.kind !== 'MultipleServers') {
                throw new Error('Expected startServers to start multiple servers');
            }
            const mainlineServer = servers.mainline;
            yield supertest(mainlineServer.server)
                .get('/components/contents.txt')
                .expect(200, 'mainline\n');
            const fooServer = servers.variants.find(s => s.variantName === 'foo');
            yield supertest(fooServer.server)
                .get('/components/contents.txt')
                .expect(200, 'foo\n');
            const barServer = servers.variants.find(s => s.variantName === 'bar');
            yield supertest(barServer.server)
                .get('/components/contents.txt')
                .expect(200, 'bar\n');
            const dispatchServer = servers.control;
            const dispatchTester = supertest(dispatchServer.server);
            const apiResponse = yield dispatchTester.get('/api/serverInfo').expect(200);
            assert.deepEqual(JSON.parse(apiResponse.text), {
                packageName: 'variants-test',
                mainlineServer: { port: mainlineServer.server.address().port },
                variants: [
                    { name: 'bar', port: barServer.server.address().port },
                    { name: 'foo', port: fooServer.server.address().port }
                ]
            });
            const pageResponse = yield dispatchTester.get('/').expect(200);
            // Assert that some polyserve html is served.
            assert.match(pageResponse.text, /<html>/);
            assert.match(pageResponse.text, /Polyserve/);
        }));
    });
});
//# sourceMappingURL=start_server_test.js.map