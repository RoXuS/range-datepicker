/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { expect } from 'chai';
import * as fixtures from './fixtures';
import { Stringifier } from '../src/shady-css/stringifier';
import { Parser } from '../src/shady-css/parser';
import { NodeFactory } from '../src/shady-css/node-factory';

describe('Stringifier', () => {
  let nodeFactory;
  let stringifier;

  beforeEach(() => {
    nodeFactory = new NodeFactory();
    stringifier = new Stringifier();
  });

  describe('when stringifying CSS nodes', () => {
    it('can stringify an empty Stylesheet', () => {
      let cssText = stringifier.stringify(nodeFactory.stylesheet([]));
      expect(cssText).to.be.eql('');
    });

    it('can stringify an At Rule without a Rulelist', () => {
      let cssText = stringifier.stringify(nodeFactory.atRule('foo', '("bar")'));

      expect(cssText).to.be.eql('@foo ("bar");');
    });

    it('can stringify an At Rule with a Rulelist', () => {
      let cssText = stringifier.stringify(
          nodeFactory.atRule('foo', '("bar")', nodeFactory.rulelist([])));

      expect(cssText).to.be.eql('@foo ("bar"){}');
    });

    it('can stringify Comments', () => {
      let cssText = stringifier.stringify(nodeFactory.comment('/* hi */'));
      expect(cssText).to.be.eql('/* hi */');
    });

    it('can stringify Rulesets', () => {
      let cssText = stringifier.stringify(
          nodeFactory.ruleset('.fiz #buz', nodeFactory.rulelist([])));
      expect(cssText).to.be.eql('.fiz #buz{}');
    });

    it('can stringify Declarations with Expression values', () => {
      let cssText = stringifier.stringify(
          nodeFactory.declaration('color', nodeFactory.expression('red')));
      expect(cssText).to.be.eql('color:red;');
    });

    it('can stringify Declarations with Rulelist values', () => {
      let cssText = stringifier.stringify(
          nodeFactory.declaration('--mixin', nodeFactory.rulelist([])));
      expect(cssText).to.be.eql('--mixin:{};');
    });
  });

  describe('when stringifying CSS ASTs', () => {
    let parser;

    beforeEach(() => {
      parser = new Parser();
    });

    it('can stringify a basic ruleset', () => {
      let cssText = stringifier.stringify(parser.parse(fixtures.basicRuleset));
      expect(cssText).to.be.eql('body{margin:0;padding:0px;}');
    });

    it('can stringify at rules', () => {
      let cssText = stringifier.stringify(parser.parse(fixtures.atRules));
      expect(cssText).to.be.eql(
          '@import url(\'foo.css\');@font-face{font-family:foo;}@charset \'foo\';');
    });

    it('can stringify keyframes', () => {
      let cssText = stringifier.stringify(parser.parse(fixtures.keyframes));
      expect(cssText).to.be.eql(
          '@keyframes foo{from{fiz:0%;}99.9%{fiz:100px;buz:true;}}');
    });

    it('can stringify declarations without value', () => {
      let cssText =
          stringifier.stringify(parser.parse(fixtures.declarationsWithNoValue));
      expect(cssText).to.be.eql('foo;bar 20px;div{baz;}');
    });

    it('can stringify custom properties', () => {
      let cssText = stringifier.stringify(
          parser.parse(fixtures.customProperties));
      expect(cssText).to.be.eql(':root{--qux:vim;--foo:{bar:baz;};}');
    });

    describe('with discarded nodes', () => {
      it('stringifies to a corrected stylesheet', () => {
        let cssText = stringifier.stringify(
            parser.parse(fixtures.pathologicalComments));
        expect(cssText).to.be.eql(
            '.foo{bar:/*baz*/vim;}/* unclosed\n@fiz {\n  --huk: {\n    /* buz */baz:lur;@gak wiz;');
      });
    });
  });
});
