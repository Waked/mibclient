var MIB = require('./lib/mib');
var mib = new MIB();
mib.LoadMIBs();

mib.WriteToFile('mib.JSON');

/*  ___snmp-native varbind parsing____*/
var snmp = require('snmp-native');
var session = new snmp.Session();
var oid = 'mib-2';

mib.GetObject(oid, function(Object) {
	//console.log(Object);
	var options = {
		host: '127.0.0.1',
		community: 'public',
		oid: '.' + Object.OID,
		timeouts: [5000]
	};
	session.getSubtree(options, function(error, varbinds, baseOid) {
		//console.log(varbinds);
		var NameSpaceTable = {};
		mib.DecodeVarBinds(varbinds, function (VarBinds) {
			//console.log(VarBinds);
			console.log(varbinds2goodjson(VarBinds));
			var NameSpace = {};
			VarBinds.forEach(function (vb) {
				if (!NameSpace[vb.NameSpace]) {
					NameSpace[vb.NameSpace] = {};
				}
				NameSpace[vb.NameSpace][vb.oid] = vb.Value;
			});
			//console.log(NameSpace);
			NameSpaceTable = delimiter2bracket(NameSpace, '.');
			var mib2 = NameSpaceTable.iso.org.dod.internet.mgmt;
			//console.log(JSON.stringify(mib2, null, 4));
		});
	});
});

// Function to convert decoded VarBinds into a format readable
// for front-end library bootstrap-treeview.
var varbinds2goodjson = function(varbinds) {
	// Output object - root element has the name of subtree root (oid)
	var outputJson = NewHierarchyLevel(oid);

	//console.log(varbinds);

	varbinds.forEach(function(varbind) {
		var hierarchy = varbind.NameSpace.split('.');
		var indices = varbind.OID.split('.');
		while (hierarchy.shift() != oid) { indices.shift() } // Remove trailing oids and indices
		indices.shift();
		console.log(hierarchy.toString());
		currentlevel = outputJson;
		while (hierarchy.length > 0) {
			currentoid = hierarchy.shift();
			currentidx = Number.parseInt(indices.shift());
			console.log(currentidx);
			// If there is no child node of the given index, push new
			if (currentlevel.nodes[currentidx - 1] == null) {
				currentlevel.nodes.push(NewHierarchyLevel(currentoid));
			}
			// Move further in the hierarchy
			currentlevel = currentlevel.nodes[currentidx - 1];
		}
	});

	return outputJson;
};

var NewHierarchyLevel = function(name) {
	return {
		text: name,
		nodes: []
	};
}

var delimiter2bracket = function(json, delimiter) {
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
