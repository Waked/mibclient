const snmp = require("net-snmp");

var session = snmp.createSession("127.0.0.1", "public");

var oids = [
    "1.3.6.1.2.1.1.4.0",
    "1.3.6.1.2.1.1.5.0",
    "1.3.6.1.2.1.2.2.1.2",
    "1.3.6.1.2.1.2.2.1.3"
];

var nonRepeaters = 2;

session.getBulk(oids, nonRepeaters, function (error, varbinds) {
    if (error) {
        console.error (error.toString());
    } else {
        // step through the non-repeaters which are single varbinds
        for (var i = 0; i < nonRepeaters; i++) {
            if (i >= varbinds.length)
                break;
            if (snmp.isVarbindError(varbinds[i]))
                console.error(snmp.varbindError (varbinds[i]));
            else
                console.log(varbinds[i].oid + "|" + varbinds[i].value);
        }

        // then step through the repeaters which are varbind arrays
        for (var i = nonRepeaters; i < varbinds.length; i++) {
            for (var j = 0; j < varbinds[i].length; j++) {
                if (snmp.isVarbindError (varbinds[i][j]))
                    console.error(snmp.varbindError (varbinds[i][j]));
                else
                    console.log(varbinds[i][j].oid + "|" + varbinds[i][j].value);
            }
        }
    }
});
