var jsonType = require('json-value-type')

module.exports = jsonMerge

function jsonMerge(tgt) {
	var tgtType = jsonType(tgt)

	if (tgtType !== jsonType.ARRAY && tgtType !== jsonType.OBJECT) return
	for (var i=1; i<arguments.length; ++i) {
		tgt = mergePair(tgt, arguments[i])
		if (!tgt) return
	}
	return tgt
}
function mergePair(tgt, src) {
	switch (jsonType(src)) {
		case jsonType.OBJECT: return fromObject(tgt, src)
		case jsonType.ARRAY: return fromArray(tgt, src)
	}
}
function fromObject(tgt, src) {
	for (var i=0, ks=Object.keys(src); i<ks.length; ++i) {
		if (src[ks[i]] === undefined) delete tgt[ks[i]]
		else tgt[ks[i]] = src[ks[i]]
	}
	return tgt
}
function fromArray(tgt, src) {
	for (var i=0; i<src.length; ++i) tgt[i] = src[i]
	return tgt
}
