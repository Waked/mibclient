var express = require('express');
var router = express.Router();
var MIB = require('../lib/mib');
var mib = new MIB();
mib.LoadMIBs();
var snmp = require('snmp-native');
var netsnmp = require('net-snmp');
var util = require('util');

var snmpoptions = {
  host: '127.0.0.1',
  community: 'public',
  timeouts: [5000]
};

var oid = 'mib-2';
var suboidsproto = ['system', 'interfaces', 'at', 'ip', 'icmp', 'tcp', /*'udp',*/ 'egp', 'snmp'];

router.get('/', function(req, res, next) {
  var suboids = suboidsproto.slice();

  var data = {
    dataSource: [
      {
        text: oid,
        children: []
      }
    ]
  };

  var _oid = suboids.shift();

  mib.GetObject(_oid, function getCallback(Object) {
  	//console.log(Object);
    var snmpoptions = {
      oid: '.' + Object.OID,
    };
    var session = new snmp.Session(snmpoptions);

    session.getSubtree(snmpoptions, function(error, varbinds, baseOid) {
      session.close();
  		mib.DecodeVarBinds(varbinds, function (VarBinds) {
  			//console.log(VarBinds);
        data.dataSource[0].children.push(varbinds2goodjson(VarBinds, _oid));
        if (suboids.length > 0) {
          _oid = suboids.shift();
          mib.GetObject(_oid, getCallback);
        } else {
          res.send(data);
        }
  		});
  	});
  });
});

// Function to convert decoded VarBinds into a format readable
// for front-end library bootstrap-treeview.
var varbinds2goodjson = function(varbinds, topoid) {
	// Output object - root element has the name of subtree root (oid)
	var outputJson = NewHierarchyLevel(topoid);

	//console.log(varbinds);

	varbinds.forEach(function(varbind) {
    console.log(varbind);
		var hierarchy = varbind.NameSpace.split('.');
		var indices = varbind.OID.split('.');
		while (hierarchy.shift() != topoid) { indices.shift() } // Remove trailing oids and indices
		indices.shift();
		var currentlevel = outputJson;
		while (hierarchy.length > 0) {
			currentoid = hierarchy.shift();
			currentidx = Number.parseInt(indices.shift());
			// If there is no child node of the given index, push new
			if (currentlevel.children[currentidx - 1] == undefined) {
				currentlevel.children.push(NewHierarchyLevel(currentoid));
			}
			// Move further in the hierarchy
			currentlevel = currentlevel.children[currentidx - 1];
		}
    if (currentlevel != undefined) {
      if (currentlevel.OID == undefined) {
        currentlevel.OID = varbind.OID;
        currentlevel.oid = varbind.oid;
        currentlevel.type = varbind.TYPE
      }
      else {
        if (!Array.isArray(currentlevel.oid)) {
          currentlevel.oid = [ currentlevel.oid ];
        }
        else {
          currentlevel.oid.push(varbind.oid);
        }
      }
    }
    //console.log(currentlevel);
	});

	return outputJson;
};

var NewHierarchyLevel = function(name) {
	return {
		text: name,
		children: []
	};
}

module.exports = router;
