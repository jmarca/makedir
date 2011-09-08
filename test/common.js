//
// totally ripping off felixge because I like his test approach
//

var common = exports;

var path = require('path');
var root = path.dirname(__dirname);

common.dir = {
  lib: root + '/lib',
};

common.assert = require('assert');
common.fs = require('fs');
common._ = require('underscore')._;
