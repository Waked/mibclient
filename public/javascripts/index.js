window.onload = function () {
  var tree;

  $.ajax('/data').done(function(data, status, jqXHR) {
    //console.log(data);
    treedata = data;
    tree = $("#tree").tree(treedata);
  });

  $('#btnGetRequest').on('click', function () {
    var selections = tree.getSelections();
    var nodeData = tree.getDataById(selections[0]);

    var fullOID = nodeData.OID + '.0';

    $.ajax('/get', {
      method: 'POST',
      data: fullOID, // Pass only the OID
      processData: false // Do not convert or stuff
    }).done(function(data, status, jqXHR) {
        console.log(data);
        $('#responseField').text(nodeData.text + ": " + data); // Insert results in result field
    });
  });

  $('#btnGetNextRequest').on('click', function () {
    var selections = tree.getSelections();
    var nodeData = tree.getDataById(selections[0]);

    var fullOID = nodeData.OID + '.' + nodeData.oid;

    $.ajax('/getnext', {
      method: 'POST',
      data: fullOID, // Pass only the OID
      processData: false // Do not convert or stuff
    }).done(function(data, status, jqXHR) {
        console.log(data);
        $('#responseField').text(nodeData.text + ": " + data); // Insert results in result field
    });

    console.log(nodeData);
  });

  $('#btnCheckOid').on('click', function() {
    var selections = tree.getSelections();
    var nodeData = tree.getDataById(selections[0]);
    $('#responseField').text(nodeData.text + " OID is " + nodeData.OID);
  });
}
