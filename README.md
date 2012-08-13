# makedir

Recursively and asyncronously make directories in node.js.

There is another great library called mkdirp that a lot more people
use.

I wrote this one independently of that one, and after comparing the
code, they do about the same thing.

If you want a widely used, well supported mkdirp, use mkdirp.  On the
other hand, this one works too.

The primary use case I wrote this library for was to make RESTful file
system caches of rather expensive-to-create database queries on a web
server.  Other solutions couldn't handle multiple simultaneous creates
that you get from asyncronous operation.  For example, if a request
asks for `foo/bar/baz/batch.txt`, and another, simultaneous request
asks for `foo/bar/bit/bang.txt`, then both requests will try to create
directories `foo/bar`.  Unless they are careful, one of the processes
will erroneously try to create a directory that already exists, and
will crash.  At the time I wrote this way long time ago, the other
libraries I tested would crash.

To install, do

    npm install makedir



To run the tests, such as it is

     npm install -d

Then

     make test

The make test will create a bunch of directories under

    makedirtests/  and
    /tmp/makedirtests/


I have recently gotten more clue on testing, and so I will soon update
the tests to use mocha.  Until then, you'll have to remove the created
directories manually.  Sorry about that

    rm makedirtests/ -rf
    rm /tmp/makedirtests/ -rf

To use, just pass the directory that you want to make.  It will climb
up the directory tree until it finds something that exist, and then
will recursively create all of the directories that are needed.  Pass
it a callback to do something with that directory once it is created.  For
example

    var makedir = require('makedir');
    var p = '/home/james/some/crazy/long/path'
    function doSomethingToPath(path){
          return function(err){
              if(err) throw new Error (err);
              console.log('made '+path);
          };
    };
    makedir.makedir(p,doSomethingToPath(p));

# Copyright

Copyright (c) 2012 James E. Marca, using the MIT licence.











