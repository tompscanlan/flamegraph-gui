/* jshint node: true */

'use strict';

var util = require('util');
var express = require('express');
var app = express();

var sys = require('sys')
var exec = require('child_process').exec;


app.all('*', function(req, res, next) {
	console.log('req: %s', util.inspect(req, {
		showHidden: false,
		depth: 3,
		colors: true
	}));
	next();
})

app.get('/', function(req, res) {

	var child = exec("ps -ef", function(error, stdout, stderr) {
		res.write('stdout: ' + stdout);
		res.write('stderr: ' + stderr);
		if (error !== null) {
			res.write('exec error: ' + error);
		}

		res.end()
	});

});

var server = app.listen(3000, function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);
});
