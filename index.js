/* jshint node: true */

'use strict';

var util = require('util');
var express = require('express');
var bodyParser = require('body-parser')
var app = express();
app.use(bodyParser.urlencoded({
    extended: false
}));

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


app.get('/image', function(req, res) {
    var options = {
        root: "/tmp",
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };
    res.sendFile('flamegraph-gui.svg', options)
});

app.post('/', function(req, res) {
    var options = {
        cwd: "/tmp"
    }
    var child = exec(req.body.command + "; perf script > out.perf; stackcollapse-perf.pl out.perf > out.folded; flamegraph.pl out.folded > flamegraph-gui.svg; ", options, function(error, stdout, stderr) {
        writeForm(res);
        res.write('<pre>stdout: ' + stdout + "</pre>");
        res.write('<pre>stderr: ' + stderr + "</pre>");
        if (error !== null) {
            res.write('<pre>exec error: ' + error + "</pre>");
        }
        res.write('<br><a href="/image">generated image</a>');

        res.end()
    });
});

app.get('/', function(req, res) {
    writeForm(res);
    res.end()
});

var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});

 function writeForm(res) {
    res.type('html');
    res.write('<form action=/ method="post"> <input type="text" name="command"/> <input type="submit"/> </form>');
}

