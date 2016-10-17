'use strict'
var ct = require('cotest'),
		imjv = require('is-my-json-valid'),
		S = require('./index')

ct('primitives-number', function() {
	var sch = S(1),
			val = imjv(sch)
	ct('==', val(0.1), true)
	ct('==', val('a'), false)
})
ct('primitives-integer with overriding options', function() {
	var sch = S(1, {minimum:0, type: 'integer'}, {minimum:1}),
			val = imjv(sch)
	ct('==', val(2), true)
	ct('==', val(0), false)
	ct('==', val(1.1), false)
})
ct('primitives-string with options', function() {
	var sch = S('abcd', {pattern:'[a-z]{4}'}),
			val = imjv(sch)
	ct('==', val('aaaa'), true)
	ct('==', val('aaa'), false)
	ct('==', val('as'), false)
	ct('==', val(0.1), false)
	ct('==', val({}), false)
})
ct('edge cases -undefined value type and schema', function() {
	var sch = S()
	ct('==', sch, undefined)
})
ct('null', function() {
	var sch = S(null),
			val = imjv(sch)
	ct('==', val(null), true)
	ct('==', val(1), false)
})
ct('null value on existing type', function() {
	var obj = S({a:1}),
			sch = S(null, S(null, obj)),
			val = imjv(sch)
	ct('==', val(null), false)
	ct('==', val({a:-1.1}), true)
})
ct('array only', function() {
	var sch = S([]),
			val = imjv(sch)
	ct('==', val([1,2,'3']), true)
})
ct('simple list', function() {
	var sch = S([1]),
			val = imjv(sch)

	ct('==', val([1,2,3]), true)
	ct('==', val([1,2,'c']), false)
})
ct('simple tupple', function() {
	var def = [1,'a']
	var sch = S(def),
			val = imjv(sch)

	ct('==', val([2,'b']), true)
	ct('==', val(1,2), false)
})

ct('empty', function() {
	var def = {},
			sch = S(def),
			val = imjv(sch)

	ct('==', val({a:1}), true)
	ct('==', val({}), true)
})
ct('simple obj', function() {
	var sch = S({a:1, b:'c'}),
			val = imjv(sch)

	ct('==', val({a:5}), true)
	ct('==', val({b:'df'}), true)
	ct('==', val([]), false)
	ct('==', val({b:2}), false)
})
ct('augmented obj', function() {
	var sch1 = S({a:1, b:'c'}),
			sch = S({c:1}, sch1),
			val = imjv(sch)
	ct('==', val({a:2}), true)
	ct('==', val({a:'a'}), false)
	ct('==', val({b:2}), false)
	ct('==', val({b:'b'}), true)
	ct('==', val({c:5}), true)
	ct('==', val({c:'c'}), false)
})
ct('composed obj', function() {
	var sCode = S('', {pattern:'[a-z]{4}'}),
			sch = S({c:sCode}),
			val = imjv(sch)

	ct('==', val({c:'ab'}), false, 'wrong prop pattern must fail')
	ct('==', val({c:'defg'}), true, 'right pattern must pass')
})
ct('nested obj with options', function() {
	var pred = {id:'a', pc:10},
			sPred = S(pred, {required:['id','pc']}),
			sItem = S({id:'id', pred:[sPred]}, {required: ['id', 'pred']}),
			val = imjv(sItem)
	ct('==', val({ id:'ab', pred:[] }), true)
	ct('==', val({ id:'ab', pred:[{id:'s', pc:0}] }), true)
	ct('==', val({ id:'ab', pred:[{id:'s'}] }), false, 'missing data')
})
ct('empty', function() {
	var def = S({a: 'somestring'}),
			sch = S(def)
	ct('{==}', def, sch, 'an existing schema without transformation should stay the same')
})
ct('more complex types', function() {
	var schN = S(1, {type: 'number'}),
			schA = S([schN]),
			sch = S([1,2,3.3], schA),
			val = imjv(sch)
	ct('==', schN.type, 'number', 'integets can be forced to number type')
	ct('==', val([1.1,2,3,4.4]), true)
})
