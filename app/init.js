"use strict";

var Portfolio = require('./Portfolio');

$(document).ready(function() {
  window.pfl = new Portfolio();
  pfl.init();
});
