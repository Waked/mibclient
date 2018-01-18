// import 'jquery/dist/jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../public/stylesheets/narrow-jumbotron.css';
import 'bootstrap-treeview/dist/bootstrap-treeview.min.js';
import 'bootstrap-treeview/dist/bootstrap-treeview.min.css';

// Code here

function click() {
  alert($().jquery);
}

//const $ = jquery;

var data = [
  {
    text: "mib-2",
    nodes: [
      {
        text: "system"
      },
      {
        text: "interfaces"
      }
    ]
  }
];

$("#tree").treeview(data);
