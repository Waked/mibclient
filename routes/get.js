var express = require('express');
var router = express.Router();
var MIB = require('../lib/mib');
var mib = new MIB();
mib.LoadMIBs();
var snmp = require('net-snmp');
var util = require('util');

router.post('/', function(req, res, next) {
  console.log(req.body);
  var fullOID = Object.keys(req.body)[0];

  var target = '127.0.0.1';
  var community = 'public';
  //var version = snmp.Version2c;
  var oids = [ fullOID.toString() ];

  var session = snmp.createSession(target, community, { timeout: 500 });

  session.get(oids, function(error, varbinds) {
  	if (error) {
  		console.error(error.toString ());
  	}
    else {
      // console.log(varbinds);
  		// for (var i = 0; i < varbinds.length; i++) {
  		// 	if (snmp.isVarbindError (varbinds[i]))
  		// 		console.error(snmp.varbindError (varbinds[i]));
  		// 	 else
  		// 		console.log (varbinds[i].oid + "|" + varbinds[i].value);
      // }
      res.json(varbinds[0].value.toString());
    }
    session.close();
  });
});

module.exports = router;
