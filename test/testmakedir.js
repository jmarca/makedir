var _ = require('underscore')._;
var fs = require('fs');

var dirs = require('../lib/makedir');

// A lot of paths, and repeats, so that you have to handle multiple
// simultaneous makes

var paths = ['/tmp/repos/jem/node-data-proxy/public/data/airbasins/monthly/2007'
            ,'/tmp/pos/jem/node-data-proxy/public/data/airbasins/monthly/2007'
            ,'/tmp/os/jem/node-data-proxy/public/data/airbasins/monthly/2007'
            ,'/tmp/s/jem/node-data-proxy/public/data/airbasins/monthly/2007'
            ,'/tmp/repos/jem/node-data-proxy/public/data/airbasins/monthly/2007'
            ,'/tmp/pos/jem/node-data-proxy/public/data/airbasins/monthly/2007'
            ,'/tmp/os/jem/node-data-proxy/public/data/airbasins/monthly/2007'
            ,'/tmp/s/jem/node-data-proxy/public/data/airbasins/monthly/2007'
            ];
_.each(paths
      ,function(p){
          dirs.makedir(p
                      ,function (path){
                          return function(err){
                              if(err){
                                  console.log('error making'+ path+ ' :'+ JSON.stringify(err));
                              }else{
                                  console.log('made'+ path) ;
                              }
                          };
                      }(p));
          return 1;
      });



