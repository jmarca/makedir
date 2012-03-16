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

var modepaths=[];
for (var i = 0; i < 5; i++) {
    var d = ['/tmp/makedirtests/mode'];
    for (var j = 0; i < 5; i++)
        d.push( Math.floor(Math.random() * Math.pow(16,4)).toString(16) );
    modepaths.push(d.join('/'));
}

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

// fixed, no longer fails these paths
// var failtest = function(dirs) {
//     assert.throws(
//         function(){
//             common._.each(dirs
//                          ,function(p){
//                              makedir.makedir(p
//                                             ,function(path){
//                                                 return function(err){
//                                                     if(err) throw new Error (err);
//                                                     console.log('made '+path);
//                                                 };
//                                             }(p));
//                              return 1;
//                          });
//         }, "parent failure"
//     );
// };

var modetest = function(dirs) {
    assert.doesNotThrow(
        function(){
            common._.each(dirs
                         ,function(p){
                              makedir.makedir(p
                                             ,0744
                                             ,function(path){
                                                  return function(err){
                                                      if(err) throw new Error (err);
                                                      console.log('made '+path);
                                                      common.fs.stat(path,function(err,stat){
                                                          if(stat && (stat.mode & 0777 ) !== 0744) {
                                                              console.log(stat);
                                                              throw new Error('bad stat mode');
                                                          }
                                                      });
                                                  };
                                              }(p));
                              return 1;
                          });
        }
    );
    };

passtest(common._.flatten([relpaths,abspaths,failpaths]));
modetest(common._.flatten(modepaths));

