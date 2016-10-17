var jsonType = require('json-value-type'),
		jsonMerge = require('./json-merge')

var $SCHEMA = 'http://json-schema.org/schema#',
		clear$schema = {$schema: undefined}

module.exports = autoJsonSchema

function autoJsonSchema(model) {
	var schema = {}
	if (arguments.length > 1) for (var i=1; i<arguments.length; ++i) jsonMerge(schema, arguments[i])
	schema = fromModel(model, schema)
	if (!schema) return
	if (!schema.$schema) schema.$schema = $SCHEMA
	return schema
}
function fromModel(model, schema) {
	if (isSchema(model)) return jsonMerge(model, schema, clear$schema)
	var jType = jsonType(model)
	if (!jType) return
	if (schema.type === undefined) schema.type = jType
	switch (jType) {
		case jsonType.OBJECT: return fromObject(model, schema)
		case jsonType.ARRAY: return fromArray(model, schema)
	}
	return schema
}
function isSchema(val) {
	return val && val.$schema && val.$schema.constructor === String
}
function fromObject(model, schema) {
	if (jsonType(schema.properties) !== jsonType.OBJECT) schema.properties = {}
	for (var i=0, ks=Object.keys(model); i<ks.length; ++i) {
		schema.properties[ks[i]] = fromModel(model[ks[i]], schema.properties[ks[i]] || {})
	}
	return schema
}
function fromArray(model, schema) {
	// uniform array - imposed
	if (jsonType(schema.items) === jsonType.OBJECT) schema.items = fromModel(model[0], schema.items)
	// tupple - imposed
	else if (Array.isArray(schema.items)) schema.items = model.map(function(v,i) {
		return fromModel(v, schema.items[i] || {})
	})
	// uniform array - default
	else if (model.length === 1) schema.items = fromModel(model[0], {})
	// tupple - default
	else if (model.length > 1) schema.items = model.map(function(v) {
		return fromModel(v, {})
	})
	return schema
}
