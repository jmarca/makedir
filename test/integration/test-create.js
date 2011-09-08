var common = require('../common');
var assert = common.assert;
var makedir = require(common.dir.lib + '/makedir');


var failpaths = ['makedirtests/repos/jem/node-data-proxy/public/data/airbasins/monthly/2007'
                ,'makedirtests/pos/jem/node-data-proxy/public/data/airbasins/monthly/2007'
                ,'makedirtests/os/jem/node-data-proxy/public/data/airbasins/monthly/2007'
                ,'makedirtests/s/jem/node-data-proxy/public/data/airbasins/monthly/2007'
                ];
var abspaths  = ['/tmp/makedirtests/repos/jem/node-data-proxy/public/data/airbasins/monthly/2007'
                ,'/tmp/makedirtests/pos/jem/node-data-proxy/public/data/airbasins/monthly/2007'
                ,'/tmp/makedirtests/os/jem/node-data-proxy/public/data/airbasins/monthly/2007'
                ,'/tmp/makedirtests/s/jem/node-data-proxy/public/data/airbasins/monthly/2007'
                ];
var relpaths  = ['./makedirtests/repos/jem/node-data-proxy/public/data/airbasins/monthly/2007'
                ,'./makedirtests/pos/jem/node-data-proxy/public/data/airbasins/monthly/2007'
                ,'./makedirtests/os/jem/node-data-proxy/public/data/airbasins/monthly/2007'
                ,'./makedirtests/s/jem/node-data-proxy/public/data/airbasins/monthly/2007'
                ];

//test making
var passtest = function(dirs) {
    assert.doesNotThrow(
        function(){
            common._.each(dirs
                         ,function(p){
                             makedir.makedir(p
                                            ,function(path){
                                                return function(err){
                                                    if(err) throw new Error (err);
                                                    console.log('made '+path);
                                                };
                                            }(p));
                             return 1;
                         });
        }
    );
};

var failtest = function(dirs) {
    assert.throws(
        function(){
            common._.each(dirs
                         ,function(p){
                             makedir.makedir(p
                                            ,function(path){
                                                return function(err){
                                                    if(err) throw new Error (err);
                                                    console.log('made '+path);
                                                };
                                            }(p));
                             return 1;
                         });
        }, "parent failure"
    );
};

passtest(common._.flatten([relpaths,abspaths,failpaths]));

