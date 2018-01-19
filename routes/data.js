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

var mibs = ['system', 'interfaces', 'at', 'ip', 'icmp', 'tcp', /*'udp',*/ 'egp', 'snmp'];

router.get('/', function(req, res, next) {

  var data = {
    dataSource: [
      {
        text: 'mib-2',
        OID: '1.3.6.1.2.1',
        children: []
      }
    ]
  };

  var categories = mibs.slice(); // Clone array

  var cat_obj = categories.shift();

  mib.GetObject(cat_obj, function getCallback(Object) {
    //console.log(Object);
    var session = new snmp.Session(snmpoptions);
    var getparameters = { oid: '.' + Object.OID }; // Need trailing dot
    session.getSubtree(getparameters, function(error, varbinds, baseOid) {
      session.close();
  		mib.DecodeVarBinds(varbinds, function (VarBinds) {
        data.dataSource[0].children.push(categoryFromVarBinds(cat_obj, VarBinds, Object.OID));
        if (categories.length > 0) {
          cat_obj = categories.shift();
          mib.GetObject(cat_obj, getCallback);
        } else {
          res.send(data);
        }
  		});
  	});
  });
});

var categoryFromVarBinds = function(name, VarBinds, cat_oid) {
  var element = {
    text: name,
    OID: cat_oid,
    children: []
  }
  VarBinds.forEach(function(VarBind) {
    var namespace = VarBind.NameSpace;
    var oid = VarBind.OID;
    var index = VarBind.oid;

    var split_namespace = namespace.split('.');
    var split_oid = oid.split('.');

    var current_element = split_namespace.shift(); // Element by element
    var current_index = split_oid.shift();

    while (current_element != element.text) {
      current_element = split_namespace.shift(); // Element by element
      current_index = split_oid.shift();
    }
    // Mamy tera hierarchię
    var previous_element = element;

    while (split_namespace.length > 0) {
      current_element = split_namespace.shift(); // Element by element
      current_index = split_oid.shift();

      var existing_element = previous_element.children.find(el => el.text == current_element);

      if (existing_element == null || existing_element == undefined) {
        existing_element = {
          text: current_element,
          OID: previous_element.OID + '.' + current_index,
          children: []
        };
        previous_element.children.push(existing_element);
      }
      previous_element = existing_element;
    }
  });
  return element;
}

module.exports = router;
