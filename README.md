<!-- markdownlint-disable MD004 MD007 MD010 MD041 MD022 MD024 MD032 -->
# auto-json-schema

*[json-schema](http://json-schema.org/) without pain*

• [Why](#why) • [What](#what) • [How](#how) • [License](#license) •

# Why

Because generating [json-schema](http://json-schema.org/) by hand is hard, complex and error prone.

# What

The boiler plate stuff are inferred from the values of a model.

```javascript
var autoS = require('auto-json-schema')
var tedious = {
	type: 'object',
	properties: {'qty': {type: 'number'}, uid:{type: 'string'}},
	$schema: 'http://json-schema.org/schema#'
}
var easy = autoS({
  qty:0,
  uid:''
}) //same result as tedious
```

The model can contain nested [json-schema](http://json-schema.org/) and
additional optional [json-schema](http://json-schema.org/) fragments can be provided to tweek the inferred values.

```javascript
var autoS = require('auto-json-schema')
var tedious = {
  required: ['uid'],
  type: 'object',
  properties: {
    user: {
      type: 'object',
      properties: {
        age: {
          minimum:18,
          type: 'number'
        },
        uid: {
          pattern: '[a-z]{4}',
          type: 'string'
        }
      }
    }
  },
  $schema: 'http://json-schema.org/schema#'
}
var easier = autoS({
  user: {
    age: autoS(0, { minimum:18 }),
    uid: autoS('', { pattern:'[a-z]{4}' })
  }
}, {
  required: ['uid']
}) //same result as tedious
```

# How

* `autoSchema(model, schemaFragment, schemaFragment, ...)`
* `model`: any valid json structure. The value can be sub-schema. Examples:
  * `3`: a standalone primitive
  * `{value: 3, password: anotherSchemaObject}`: a mix of values, tructures and schema
* `schemaFragment`: any valid parts of [the json-schema standard](http://json-schema.org/). Last entries take precedence.
  * `{type: 'integer'}`: to overide the inferred type

# License

Released under the [MIT License](http://www.opensource.org/licenses/MIT)
