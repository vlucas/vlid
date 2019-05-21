# vlid.js

![Min Size](https://badgen.net/bundlephobia/min/vlid) ![Minzipped Size](https://badgen.net/bundlephobia/minzip/vlid)

Lightweight validation library with NO dependencies targeting web browsers and Node.js. A nice Joi alternative
with a similar API.

NOTE: `vlid.js` targets language features supported in 90%+ browsers. This means that it does use some more
widely-supported ES6 features, and thus requires a modern-ish browser and/or Node 8+. Most notably, IE11 is
not supported. All versions of Firefox, Safari, Chrome, and Edge released within the past several years are
fully supported.

## Size

Bundle size is very important, and a lot of attention is paid to keeping the code lean and small. We try to
strike a balance of providing all the core validations and logic that you most commonly need, while making it
easy to provide your own custom validation rules for anything else.

## Installation

Install from NPM or Yarn:

```shell
npm install vlid --save
```
```shell
yarn add vlid
```

Use in your JavaScript:

```javascript
const v = require('vlid');`
```

Or with `import`:

```javascript
import v from 'vlid';
```

## Usage

### v.any()

The base validation object, can be used to represent any value or as a base for completely custom new
validation rules.

```javascript
let result = v.validateSync(v.any(), 'whatever you want'); // result.isValid = true
```

Full API docs coming soon. Still working on what the full public API will be.
