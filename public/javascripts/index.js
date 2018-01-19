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
    console.log(nodeData);
  });
  $('#btnGetNextRequest').on('click', function () {
    var selections = tree.getSelections();
    selections && selections.length && alert(selections.join());
  });
}
