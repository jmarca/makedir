# makedir

Recursively and asyncronously make directories in node.js.

I needed this to make RESTful file system caches of rather
expensive-to-create database queries on a web server.  Other solutions
couldn't handle multiple simultaneous creates that you get from
asyncronous operation.

To run the test, such as it is

     npm install -d

Then

     make test

Because I haven't figure out how to put this in the Makefile yet,
you'll have to remove the created directories manually.  Sorry about
that

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





