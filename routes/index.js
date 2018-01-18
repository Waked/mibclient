var express = require('express');
var router = express.Router();

import path from "path";
import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import * as config from "./webpack.dev.config.js";

/* GET home page. */
router.get('/', function(req, res, next) {

  

  res.render('index', { title: 'Klient MIB' });
});

module.exports = router;
