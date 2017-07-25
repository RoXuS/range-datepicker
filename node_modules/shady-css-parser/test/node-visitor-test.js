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
import { NodeVisitor } from '../src/shady-css/node-visitor';

class TestNodeVisitor extends NodeVisitor {
  constructor() {
    super();

    this.aCallCount = 0;
    this.bCallCount = 0;
  }

  a(a) {
    this.aCallCount++;
    if (a.callback) {
      a.callback();
    }
    return 'a';
  }

  b(b) {
    this.bCallCount++;
    if (b.child) {
      this.visit(b.child);
    }
    return 'b';
  }
}

describe('NodeVisitor', () => {
  let nodeVisitor;

  beforeEach(function() {
    nodeVisitor = new TestNodeVisitor();
  });

  it('visits nodes based on their type property', () => {
    nodeVisitor.visit({
      type: 'a'
    });
    expect(nodeVisitor.aCallCount).to.be.eql(1);
    expect(nodeVisitor.bCallCount).to.be.eql(0);
    nodeVisitor.visit({
      type: 'b'
    });
    expect(nodeVisitor.aCallCount).to.be.eql(1);
    expect(nodeVisitor.bCallCount).to.be.eql(1);
  });

  it('reveals the path of the recursive visitation of nodes', () => {
    let a1 = {
      type: 'a',
      callback: function() {
        expect(nodeVisitor.path).to.be.eql([a1]);
      }
    };
    let a2 = {
      type: 'a',
      callback: function() {
        expect(nodeVisitor.path).to.be.eql([b, a2]);
      }
    };
    let b =  {
      type: 'b',
      child: a2
    };

    nodeVisitor.visit(a1);
    expect(nodeVisitor.aCallCount).to.be.eql(1);
    nodeVisitor.visit(b);
    expect(nodeVisitor.aCallCount).to.be.eql(2);
    expect(nodeVisitor.bCallCount).to.be.eql(1);
  });
});
