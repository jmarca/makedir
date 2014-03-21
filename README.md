# makedir

Recursively and asyncronously make directories in node.js.

There is another great library called mkdirp that a lot more people
use.

I wrote this one independently of that one, and after comparing the
code, they do about the same thing.

If you want a widely used, well supported mkdirp, use node-mkdirp.  On the
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

# Installation

To install, do

    npm install makedir


# Usage

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



# Testing

To run the tests, clone the repository, then:

     npm install
     npm test

or

     mocha test

I just revised my tests to use mocha, and now I actually clean up the
mess of temp directories.

If you want to prove to yourself that the tests are creating
directories, go into the tests and delete or comment out the "after"
bit that clean up the temp directories.

# Copyright

Copyright (c) 2012-2014 James E. Marca, using the MIT licence.
