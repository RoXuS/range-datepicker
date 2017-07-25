## Shady CSS Parser

The motivation for Shady CSS Parser is to provide a fast, small and flexible
CSS parser suitable for facilitating runtime parsing and transformation of CSS.
The Polymer library and the Polymer Designer tool are both example cases where
fast and flexible CSS parsing and transformation is a critical feature.

### Goals

 -  Feasibility of being used in conjunction with Polymer or Polymer
Designer.
 -  Parse CSS loosely and flexibly. This parser is not spec-compliant, however
 it will parse all spec-compliant CSS.
 -  Parse CSS quickly and efficiently. This parser is a suitable tool to aide in
 the design and implementation of runtime transformations.
 -  Graceful error recovery. Malformed CSS will be parsed by this
parser as closely as possible to the way a browser would parse it.

### Installing

With `node` and `npm` installed, run the following command:

```sh
npm install shady-css-parser
```

### Building

Run the following commands from the project root:

```sh
npm install
gulp
```

This will create a `dist` directory containing distributable artifacts.

### Usage

#### Basic parsing

```js
var css = 'body { color: red; }';
var parser = new shadyCss.Parser();
var ast = parser.parse(css);
```

#### Custom parsing

```js
/* Step 1: Inherit from NodeFactory */
function CustomNodeFactory() {
  shadyCss.NodeFactory.apply(this, arguments);
}

CustomNodeFactory.prototype = Object.create(shadyCss.NodeFactory.prototype);

/* Step 2: Implement a custom node factory method. Here we override the default
 * factory for Expression nodes */
CustomNodeFactory.prototype.expression = function(text) {
  if (/^darken\(/.test(text)) {
    return {
      type: 'darkenExpression',
      color: text.replace(/^darken\(/, '').replace(/\)$/, '')
    };
  } else {
    return shadyCss.NodeFactory.prototype.expression.apply(this, arguments);
  }
}

var css = 'body { color: darken(red); }';
/* Step 3: Instantiate a Parser with an instance of the specialized
 * CustomNodeFactory */
var parser = new shadyCss.Parser(new CustomNodeFactory());
var ast = parser.parse(css);
```

#### Basic stringification

```js
var stringifier = new shadyCss.Stringifier();
stringifier.stringify(ast);
```

Note: the built-in Parser and Stringifier discard most insignficiant whitespace
from parsed CSS.

#### Custom stringification

```js
/* Step 1: Inherit from Stringifier. */
function CustomStringifier() {
  shadyCss.Stringifier.apply(this, arguments);
}

CustomStringifier.prototype = Object.create(shadyCss.Stringifier.prototype);

/* Step 2: Implement a stringification method named after the type of the node
 * you are interested in stringifying. In this case, we are implementing
 * stringification for the Darken Expression nodes we implemented parsing for
 * above. */
CustomStringifier.prototype.darkenExpression = function(darkenExpression) {
  // For the sake of brevity, please assume that the darken function returns
  // a darker version of the color parameter:
  return darken(darkenExpression.color);
};

/* Step 3: Use the custom stringifer: */
var stringifier = new CustomStringifier();
var css = stringifier.stringify(ast);
```

### Example ASTs

#### Custom property declaration

```css
.container {
  --nog: blue;
}
```
```js
{
  "type": 1, /* stylesheet */
  "rules": [
    {
      "type": 4, /* ruleset */
      "selector": ".container",
      "rulelist": {
        "type": 7, /* rulelist */
        "rules": [
          {
            "type": 6, /* declaration */
            "name": "--nog",
            "value": {
              "type": 5, /* expression */
              "text": "blue"
            }
          }
        ]
      }
    }
  ]
}
```

#### Mixin declaration

```css
ruleset {
  --mixin-name: {
    /* rules */
  };
}
```
```js
{
  "type": 1, /* stylesheet */
  "rules": [
    {
      "type": 4, /* ruleset */
      "selector": "ruleset",
      "rulelist": {
        "type": 7, /* rulelist */
        "rules": [
          {
            "type": 6, /* declaration */
            "name": "--mixin-name",
            "value": {
              "type": 7, /* rulelist */
              "rules": [
                {
                  "type": 2, /* comment */
                  "value": "\/* rules *\/"
                }
              ]
            }
          }
        ]
      }
    }
  ]
}
```

#### Mixin application

```css
.title {
  @apply(--my-toolbar-title-theme);
}
```
```js
{
  "type": 1, /* stylesheet */
  "rules": [
    {
      "type": 4, /* ruleset */
      "selector": ".title",
      "rulelist": {
        "type": 7, /* rulelist */
        "rules": [
          {
            "type": 3, /* at rule */
            "name": "apply",
            "parameters": "(--my-toolbar-title-theme)",
            "rulelist": null
          }
        ]
      }
    }
  ]
}
```

#### Pathological comments

```css
/* unclosed
@fiz {
  --huk: {
    /* buz */
    baz: lur;
  };
}
```
```js
{
  "type": 1, /* stylesheet */
  "rules": [
    {
      "type": 2, /* comment */
      "value": "\/* unclosed\n@fiz {\n  --huk: {\n    \/* buz *\/"
    },
    {
      "type": 6, /* declaration */
      "name": "baz",
      "value": {
        "type": 5, /* expression */
        "text": "lur"
      }
    },
    {
      "type": 8, /* discarded */
      "text": "};\n"
    },
    {
      "type": 8, /* discarded */
      "text": "}"
    }
  ]
}
```

### Example stringification

#### Basic ruleset

```css
/* before */
body {
  margin: 0;
  padding: 0px
}
```
```css
/* after */
body{margin:0;padding:0px;}
```

#### At rules

```css
/* before */
@import url('foo.css');

@font-face {
  font-family: foo;
}

@charset 'foo';
```
```css
/* after */
@import url('foo.css');@font-face{font-family:foo;}@charset 'foo';
```

#### Custom properties

```css
/* before */
:root {
  --qux: vim;
  --foo: {
    bar: baz;
  };
}

#target {
  gak: var(--qux);
  @apply(--foo);
}
```
```css
/* after */
:root{--qux:vim;--foo:{bar:baz;};}#target{gak:var(--qux);@apply (--foo);}
```
