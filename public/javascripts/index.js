treedata = {};

window.onload = function () {
  $.ajax('/data').done(function(data, status, jqXHR) {
    //console.log(data);
    treedata = data;
    console.log(JSON.stringify(treedata));
    $("#tree").tree(treedata);
    $("#tree").tree(treedata);
  });
}
