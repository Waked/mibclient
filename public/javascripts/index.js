// import 'jquery/dist/jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../stylesheets/narrow-jumbotron.css';
import 'bootstrap-treeview';

// Code here

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
