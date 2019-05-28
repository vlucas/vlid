![vlid.js](./assets/logo.png)

[![NPM](https://badgen.net/npm/v/vlid)](https://www.npmjs.com/package/vlid)
[![Build
Status](https://travis-ci.org/vlucas/vlid.png?branch=master)](https://travis-ci.org/vlucas/vlid)
![Min Size](https://badgen.net/bundlephobia/min/vlid)
![Minzipped Size](https://badgen.net/bundlephobia/minzip/vlid)

Lightweight Joi-like validation library with NO dependencies targeting web browsers and Node.js. A nice Joi alternative
with a similar API.

NOTE: `vlid.js` targets language features supported in 90%+ browsers. This means that it does use some more
widely-supported ES6 features, and thus requires a modern-ish browser and/or Node 6+. Most notably, IE11 is
not supported. All versions of Firefox, Safari, Chrome, and Edge released within the past several years are
fully supported.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

  - [Size](#size)
  - [Installation](#installation)
  - [Principles](#principles)
- [Usage / vlid API](#usage--vlid-api)
  - [vlid.any()](#vlidany)
    - [any.allow(values: Any | [ Any ])](#anyallowvalues-any---any-)
    - [any.cast(Boolean | Function)](#anycastboolean--function)
    - [any.default(value: any)](#anydefaultvalue-any)
    - [any.required([err: String])](#anyrequirederr-string)
    - [any.rule(rule: Function [, message: String | Function, opts: Object])](#anyrulerule-function--message-string--function-opts-object)
  - [vlid.ref(field: String)](#vlidreffield-string)
  - [vlid.string()](#vlidstring)
    - [string.alphanum([err: String | Function])](#stringalphanumerr-string--function)
    - [string.email([err: String | Function])](#stringemailerr-string--function)
    - [string.min(min: Number [, err: String | Function])](#stringminmin-number--err-string--function)
    - [string.max(max: Number [, err: String | Function])](#stringmaxmax-number--err-string--function)
    - [string.regex(pattern: Regex [, err: String | Function])](#stringregexpattern-regex--err-string--function)
    - [string.url([err: String | Function])](#stringurlerr-string--function)
  - [vlid.number()](#vlidnumber)
    - [number.min(min: Number [, err: String | Function])](#numberminmin-number--err-string--function)
    - [number.max(max: Number [, err: String | Function])](#numbermaxmax-number--err-string--function)
  - [vlid.date()](#vliddate)
    - [date.min(min: Date [, err: String | Function])](#dateminmin-date--err-string--function)
    - [date.max(max: Date [, err: String | Function])](#datemaxmax-date--err-string--function)
    - [date.iso([err: String | Function])](#dateisoerr-string--function)
  - [vlid.boolean()](#vlidboolean)
  - [vlid.array()](#vlidarray)
    - [array.items(item: vlid.any)](#arrayitemsitem-vlidany)
    - [array.min(min: Number [, err: String | Function])](#arrayminmin-number--err-string--function)
    - [array.max(max: Number [, err: String | Function])](#arraymaxmax-number--err-string--function)
  - [vlid.object(data: Object)](#vlidobjectdata-object)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

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

## Principles

vlid.js has a few guiding principles:

- **Low bundle size** - Since vlid.js targets browsers as well as Node.js, we should aim to ship as few bytes as
possible. We transpile as little as possible and only use JavaScript features with 90%+ global browser
support. _This also means vlid.js does not support IE11 since it would require a significant amount of
additional transpilation_.
- **No dependencies** - Your validation library shouldn't have to pull in half of lodash and a bunch of other
3rd-party libraries just to do its job.
- **Simple API** - Keep the public API clean and simple (easy to learn), without too many ways to do the same
thing
- **Async validation** - Validation is done async so that async rules can be easily added at any time. You _can_
use `validateSync` if there are no async valiation rules (i.e. rules that return a `Promise` object). If there
are any, then `validateSync` with throw an error. All built-in rules can be run either async or sync.
- **80 / 20 rule** - vlid.js provides all the staple built-ins that you need in 80%+ of most typical apps, and
provides easy ways to add your own rules for the 20% or less of cases where you need something custom.  This
is an explicit trade-off to keep the core size smaller.

# Usage / vlid API

## Example Object Schema

Here is a more full-featured example of a possible object schema to validate new blog posts:

```javascript
const schema = v.object({
  tags: v.array().items(v.string()).min(1, 'Must have at least one tag').required(),
  title: v.string().required(),
  isPublished: v.boolean().required().cast(),
  authorId: v.number().cast().default(null),
  dtCreated: v.date().iso().required(),
});

const data = req.body; // JSON request data from Express.js

const result = await v.validate(schema, data); // result.isValid = true
```

## vlid.any()

The base validation object, can be used to represent any value or as a base for completely custom new
validation rules. All other validation rules extend from this.

```javascript
let result = await v.validate(v.any(), 'whatever you want'); // result.isValid = true
```

### any.allow(values: Any | [ Any ])

Use `allow` to allow specific values, even though they may not pass validation.

A common use is to allow `null` for string types:

```javascript
v.string().allow(null);
```

You can also pass in an array of values to allow:

```javascript
v.string().allow([null, undefined, '']);
```

### any.cast(Boolean | Function)

**Values are NOT CAST BY DEFAULT.** Casting must be explicitly turned on to allow type coercion.

Use no arguments, or use a boolean `true` or `false` to turn casting on or off:

```javascript
v.string().cast();      // Turns casting ON
v.string().cast(true);  // Turns casting ON
v.string().cast(false); // Turns casting OFF
```

Or pass in a function add your own casting method and turn casting ON:

```javascript
v.string().cast(v => v.trim());
```

If you use object validation, casting the parent object will automatically also cast all child values:

```javascript
const schema = v.object({
  username: v.string().required(),
  email: v.string().email().required(),
  password: v.string().required(),
  isAdmin: v.boolean().required().default(false),
}).cast(); // Turns casting ON for ALL fields and nested fields in this object
```

### any.default(value: any)

Set and allow a default value if no value is provided.

```javascript
v.string().required().default('');
```

NOTE: `default()` also calls `allow()` under the hood to make sure your provided default value will not
trigger a validation error.

### any.required([err: String])

Mark a field as required, meaning it cannot be `undefined`, `null`, or an empty string `''`. Accepts an
optional custom error message.

```javascript
v.string().required('Is required');
```

Use `.allow(value)` to re-allow any of those values if needed.

### any.rule(rule: Function [, message: String | Function, opts: Object])

Add a custom validation rule with optional custom error message and options. All of the internal validations
use `rule()` to add their validation rules.

Rules must either return boolean true/false is they can be run sync, or a `Promise` object if async.

```javascript
// Built-in
v.number().min(100);

// Custom
v.number().rule(value => value <= 100, 'Must be at least 100');
```

## vlid.ref(field: String)

Can only be used from within a `v.object()` based schema. References provided data from the provided path. All
references are evaluated at validation time, AFTER all values have been cast and formatted.

```javascript
const schema = v.object({
  content: v.string().required(),
  startDate: v.date().required(),
  endDate: v.date().min(v.ref('startDate')).required(), // References 'startDate' data as min.
});

const data = {
  content: 'My stuff here!',
  startDate: '2019-05-20',
  endDate: '2019-05-19',
};

const result = await v.validate(schema, data); // result.isValid = false (endDate not before startDate)
```

## vlid.string()

String validator.

### string.alphanum([err: String | Function])

Accepts only alphanumeric characters.

### string.email([err: String | Function])

Email validator.

### string.min(min: Number [, err: String | Function])

Minimum string length.

### string.max(max: Number [, err: String | Function])

Maximum string length.

### string.regex(pattern: Regex [, err: String | Function])

Tests input against supplied Regex pattern.

### string.url([err: String | Function])

Ensures input value is a valid URL.




## vlid.number()

```javascript
v.number().min(100);
```

### number.min(min: Number [, err: String | Function])

Minimum number that can be input.

### number.max(max: Number [, err: String | Function])

Maximum number that can be input.




## vlid.date()

```javascript
v.date().min(new Date());
```

### date.min(min: Date [, err: String | Function])

Minimum date that can be input.

### date.max(max: Date [, err: String | Function])

Maximum date that can be input.

### date.iso([err: String | Function])

Ensure provided date is a valid ISO-8601 format (default format that `JSON.stringify()` will format dates in).




## vlid.boolean()

Boolean validator.

```javascript
v.boolean().required();
```

Remember that you must explicitly `cast()` if you want vlid to cast string values to boolean.

```javascript
v.boolean().required().cast(); // NOW casting is ON
```

Casting accepts all these values:
```
let trueValues = [1, 'true', 't', 'on', 'yes'];
let falseValues = [0, 'false', 'f', 'off', 'no', ''];
```

## vlid.array()

Array validator.

### array.items(item: vlid.any)

Apply a validation rule to all items in an array.

```javascript
const schema = v.object({
  todos: v.array().items(
    v.object({
      title: v.string().required(),
      isDone: v.boolean().required(),
    });
  ),
});

const data = {
  todos: [
    {
      title: 'Task 1',
      isDone: false,
    },
    {
      title: 'Task 2',
      isDone: true,
    },
  ]
};

const result = await v.validate(schema, data); // result.isValid = true
```

### array.min(min: Number [, err: String | Function])

Minimum number of items that must be present in the array

```javascript
const result = await v.validate(v.array().min(1), []); // result.isValid = false (min. 1 items required)
```

### array.max(max: Number [, err: String | Function])

Maximum number of items that can be present in the array

```javascript
const result = await v.validate(v.array().max(2), [1, 2, 3]); // result.isValid = false (max. 2 items in array)
```



## vlid.object(data: Object)

Object schema validation. Specify keys with other validation rules as the values.

```javascript
const schema = v.object({
  title: v.string().required(),
  isDone: v.boolean().required(),
});

const data = {
  title: 'My todo task',
  isDone: false,
};

const result = await v.validate(schema, data); // result.isValid = true
```

## Validation Result Object

Each call to either `validate` or `validateSync` will resolve or return a validation result object.

```
{
  isValid: Boolean,
  errors: [], // Array of ValidationError objects
  value: Mixed, // whatever data was passed in, with casting applied
  results: [], // Array of failed validation results
}
```

## vlid.ValidationError

Each validation error will return a `ValidationError` object (extended from the built-in `Error` object) with
the following keys:

```
{
  message: String,
  path: String | null, // Path to nested key if in object validaiton, or null
  value: Mixed, // whatever data was passed in, with casting applied
}
```
