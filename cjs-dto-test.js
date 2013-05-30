#!/usr/bin/env node
var express = require('express'),
    app = express(),
    http = require('http'),
    server = http.createServer(app),
    ws = new (require('ws').Server)({server: server}),
    fs = require('fs'),
    ByteBuffer = require('bytebuffer'),
    Faker = require('Faker');


var DTOs = require('./ProtoBuf').newBuilder().import({
    "package": null,
    "messages": [
        {
            "name": 'Foo',
            "fields": [
                {
                    "rule": "optional",
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
}).import({
        "package": null,
        "messages": [],
        "enums": [],
        "imports": [],
        "options": {},
        "extend": [
            {
                "name": "Foo",
                "fields": [
                    {
                        "rule": "optional",
                        "type": "string",
                        "name": "buzz",
                        "id": 3,
                        "options": {}
                    }
                ],
                "enums": [],
                "messages": [],
                "options": {}
            }
        ]
    }).build();


var foo = new DTOs.Foo({
    fizz: 'fizz',
    buzz: 'buzz'
});


app.use(express.static(__dirname + '/'));

//var exported = foo.toArrayBuffer(),
//	buff = '';
//for (var i = 0; i < exported.byteLength; ++i){
//	buff += String.fromCharCode(exported[i])
//}


// console.log(foo.toArrayBuffer(), buff);

server.listen(3333);

console.log(foo);


// var ab = foo.toArrayBuffer();
// var bb = new ByteBuffer();
// foo.encode(bb);
// console.log(ab);
// console.log(Buffer.isBuffer(ab));

ws.on('connection', function(ws){
    console.log(foo.toArrayBuffer() instanceof ArrayBuffer);
    // var b = new Buffer(foo, "utf8");
    // var bb = new ByteBuffer().wrap(b);
    // foo.encode(bb);
    setInterval(function(){
        var ab;
        foo.setFizz(Faker.Name.findName());
        foo.setBuzz(new Date().getTime());
        console.log('sending ', foo);
        ab = foo.toArrayBuffer();
        ws.send(ab, {binary: true, mask: true});
        console.log(ab);

    }, 1000);
    // console.log('connected');
});
// console.log(bb.toArrayBuffer());