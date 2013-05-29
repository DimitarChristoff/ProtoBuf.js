#!/usr/bin/env node
var express = require('express'),
	app = express(),
	http = require('http'),
	server = http.createServer(app),
	io = require('socket.io').listen(server),
	fs = require('fs'),
	ByteBuffer = require('bytebuffer');



var Foo = require('./ProtoBuf').newBuilder().import({
	"package": null,
	"messages": [
		{
			"name": "Foo",
			"fields": [
				{
					"rule": "required",
					"type": "string",
					"name": "fizz",
					"id": 1,
					"options": {}
				}
			],
			"enums": [],
			"messages": [],
			"options": {}
		}
	],
	"enums": [],
	"imports": [],
	"options": {}
}).build('Foo');



var foo = new Foo('444 and a bottle of rum');


app.use(express.static(__dirname + '/'));

server.listen(3333);

io.on('connection', function(socket){
	var bb = new ByteBuffer(0);
	foo.encode(bb);
	socket.emit('data', bb.toHex());
	// console.log('connected');
});
// console.log(bb.toArrayBuffer());