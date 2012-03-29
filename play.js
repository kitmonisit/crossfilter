#!/usr/local/bin/node

var repl = require("repl"),
    http = require("http"),
    bt = require("buffertools"),
    $ = require("jquery"),
    x = require("./crossfilter").crossfilter,
    context = repl.start().context;

// Start here
var obj = {};

var options = {
  host: "localhost",
  port: 8080,
  path: "/explore/read_fund/firstmetrosaveandlearnequityfundinc",
  method: "GET",
  headers: {
    "Content-Length": 0,
    "X-Requested-With": "XMLHttpRequest"
  }
};

var req = http.request(options, function(response) {
  var collector = new Buffer("");
  response.addListener("data", function(chunk) {
    collector = bt.concat(collector, chunk);
  });
  response.addListener("end", function() {
    var b = new Buffer(collector);
    obj.data = $.parseJSON(b.toString());
    context.harr = obj.data.history;
    context.h = x(obj.data.history);
    context.d = context.h.dimension(function(d) { return new Date(d[0]); });
    //console.log(context.d.filter([new Date("2011-01-01"), new Date("2012-01-01")]).top(Infinity));
    context.b = x.bisect.by(function(d) { return d[0]; });
  });
}).end();

context.x = x;
context.obj = obj;
