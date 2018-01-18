var MIB = require('./lib/mib');

var mib = new MIB();
mib.LoadMIBs();

mib.WriteToFile('mib.JSON');

/*  ___snmp-native varbind parsing____*/
var snmp = require('snmp-native');
var session = new snmp.Session();
var oid = 'mib-2'

mib.GetObject(oid, function (Object) {
	console.log(Object);
	var options = {
		host: '127.0.0.1',
		community: 'public',
		oid: '.' + Object.OID,
		timeouts: [5000]
	};
	session.getSubtree(options, function (error, varbinds, baseOid) {
		console.log(varbinds);
		var NameSpaceTable = {};
		mib.DecodeVarBinds(varbinds, function (VarBinds) {
			var NameSpace = {};
			VarBinds.forEach(function (vb) {
				if (!NameSpace[vb.NameSpace]) {
					NameSpace[vb.NameSpace] = {};
				}
				NameSpace[vb.NameSpace][vb.oid] = vb.Value;
			});
			// console.log(NameSpace);
			NameSpaceTable = delimiter2bracket(NameSpace, '.');
			var mib2 = NameSpaceTable.iso.org.dod.internet.mgmt;
			// console.log(JSON.stringify(mib2, null, 4));
		});
	});
});

var delimiter2bracket = function (json, delimiter) {
	var bracket = {}, t, parts, part;
	for (var k in json) {
		t = bracket;
		parts = k.split(delimiter);

		var key = parts.pop(); //last part

		while (parts.length) {
			part = parts.shift(); //first part
			t = t[part] = t[part] || {};
		}
		t[key] = json[k];//set value
	}
	return bracket;
}
