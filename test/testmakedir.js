/*global require __dirname describe it after */
var should = require('should')
var fs = require('fs')
var async = require('async')

var makedir = require('../.')

// A lot of paths, and repeats, so that you have to handle multiple
// simultaneous makes

var path    = require('path')
var rootdir = path.normalize(__dirname)

var path_components = [rootdir,'foo','bar','baz','bat']

var paths = [rootdir + '/foo/bar/baz/bat'
            ,rootdir + '/repos/jem/node-data-proxy/public/data/airbasins/monthly/2007'
            ,rootdir + '/pos/jem/node-data-proxy/public/data/airbasins/monthly/2007'
            ,rootdir + '/os/jem/node-data-proxy/public/data/airbasins/monthly/2007'
            ,rootdir + '/s/jem/node-data-proxy/public/data/airbasins/monthly/2007'
            ,rootdir + '/repos/jem/node-data-proxy/public/data/airbasins/monthly/2007'
            ,rootdir + '/pos/jem/node-data-proxy/public/data/airbasins/monthly/2007'
            ,rootdir + '/os/jem/node-data-proxy/public/data/airbasins/monthly/2007'
            ,rootdir + '/s/jem/node-data-proxy/public/data/airbasins/monthly/2007'
            ];

after(function(done){
    try{
        fs.unlinkSync(path_components.join('/'))
    } catch (x) {
        // whatever
    }
    paths.forEach(function(path){
        try{
            fs.unlinkSync(path)
        } catch (x) {
            // whatever
        }
        return null

    });


    return done()
})

describe('create directories',function(){
    it('should create a directory and its parent',function(done){
        makedir.makedir(path_components.join('/'),function(err){
            should.not.exist(err)
            // make all of the pieces exist
            var path
            for(var i = 0; i < path_components.length; i++){

                path = path_components.slice(0,i+1)
                var stats = fs.statSync(path.join('/'))
                stats.isDirectory().should.be.ok

            }


            return done()
        })
    })

    it('should create many directories at once',function(done){
        async.each(paths
                  ,function(p,cb){
                       makedir.makedir(p,function(err){
                           should.not.exist(err)
                           return cb()
                       })
                       return null
                   }
                  ,function(e){
                       should.not.exist(e)
                       // make sure all of the paths exist

                       paths.forEach(function(p){

                           var stats = fs.statSync(p)
                           stats.isDirectory().should.be.ok

                       })
                       return done()
                   });
        return null

    })

})
