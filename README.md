# makedir

Recursively and asyncronously make directories in node.js.

I needed this to make RESTful file system caches of rather
expensive-to-create database queries on a web server.  Other solutions
couldn't handle multiple simultaneous creates that you get from
asyncronous operation.
