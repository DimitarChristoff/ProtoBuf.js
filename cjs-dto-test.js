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



var foo = new Foo({
	fizz: '444 and a bottle of rum'
});




app.use(express.static(__dirname + '/'));

//var exported = foo.toArrayBuffer(),
//	buff = '';
//for (var i = 0; i < exported.byteLength; ++i){
//	buff += String.fromCharCode(exported[i])
//}


// console.log(foo.toArrayBuffer(), buff);

server.listen(3333);

io.on('connection', function(socket){
	console.log(foo.toArrayBuffer() instanceof ArrayBuffer);
	// var b = new Buffer(foo, "utf8");
	// var bb = new ByteBuffer().wrap(b);
	// foo.encode(bb);
	socket.emit('data', foo.toArrayBuffer());
	// console.log('connected');
});
// console.log(bb.toArrayBuffer());