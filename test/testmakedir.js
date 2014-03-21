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

var paths = [[rootdir , 'foo','bar','baz','bat']
            ,[rootdir , 'repos','jem','node-data-proxy','public','data','airbasins','monthly','2007']
            ,[rootdir , 'pos','jem','node-data-proxy','public','data','airbasins','monthly','2007']
            ,[rootdir , 'os','jem','node-data-proxy','public','data','airbasins','monthly','2007']
            ,[rootdir , 's','jem','node-data-proxy','public','data','airbasins','monthly','2007']
            ,[rootdir , 'repos','jem','node-data-proxy','public','data','airbasins','monthly','2007']
            ,[rootdir , 'pos','jem','node-data-proxy','public','data','airbasins','monthly','2007']
            ,[rootdir , 'os','jem','node-data-proxy','public','data','airbasins','monthly','2007']
            ,[rootdir , 's','jem','node-data-proxy','public','data','airbasins','monthly','2007']
            ];

var relative_paths = [['./relative' , 'foo','bar','baz','bat']
            ,['./relative' , 'repos','jem','node-data-proxy','public','data','airbasins','monthly','2007']
            ,['./relative' , 'pos','jem','node-data-proxy','public','data','airbasins','monthly','2007']
            ,['./relative' , 'os','jem','node-data-proxy','public','data','airbasins','monthly','2007']
            ,['./relative' , 's','jem','node-data-proxy','public','data','airbasins','monthly','2007']
            ,['./relative' , 'repos','jem','node-data-proxy','public','data','airbasins','monthly','2007']
            ,['./relative' , 'pos','jem','node-data-proxy','public','data','airbasins','monthly','2007']
            ,['./relative' , 'os','jem','node-data-proxy','public','data','airbasins','monthly','2007']
            ,['./relative' , 's','jem','node-data-proxy','public','data','airbasins','monthly','2007']
            ];

var modepaths=[];
for (var i = 0; i < 5; i++) {
    var d = ['./modes'];
    for (var j = 0; i < 5; i++){
        d.push( Math.floor(Math.random() * Math.pow(16,4)).toString(16) );
    }
    modepaths.push(d);
}

after(function(done){
    //return done()
    function rmdir(p){
        var len = p.length
        for(var i = 0; i < p.length-1; i++){
            var rmp=p.slice(0,len - i).join('/')
            try{
                fs.rmdirSync(rmp)
            } catch (x) {
                //console.log(x)
                // don't care
            }
        }
        return null
    }
    rmdir(path_components)
    paths.forEach(rmdir)
    relative_paths.forEach(rmdir)
    modepaths.forEach(rmdir)
    fs.rmdirSync('relative')
    fs.rmdirSync('modes')

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
                       makedir.makedir(p.join('/'),function(err){
                           should.not.exist(err)
                           return cb()
                       })
                       return null
                   }
                  ,function(e){
                       should.not.exist(e)
                       // make sure all of the paths exist

                       paths.forEach(function(p){

                           var stats = fs.statSync(p.join('/'))
                           stats.isDirectory().should.be.ok

                       })
                       return done()
                   });
        return null

    })

    it('should create many relative path dirs at once',function(done){
        async.each(relative_paths
                  ,function(p,cb){
                       var path = //'./test/'+
                           p.join('/')
                       makedir.makedir(path,function(err){
                           should.not.exist(err)
                           return cb()
                       })
                       return null
                   }
                  ,function(e){
                       should.not.exist(e)
                       // make sure all of the paths exist

                       paths.forEach(function(p){

                           var stats = fs.statSync(p.join('/'))
                           stats.isDirectory().should.be.ok

                       })
                       return done()
                   });
        return null

    })


    it('should create modes',function(done){
        async.each(modepaths
                  ,function(p,callback){
                       // set up a private function, so when p gets reassigned we don't lose it
                       var mode_path = p.join('/')
                       var checkp = function(err){
                           should.not.exist(err)
                           fs.stat(mode_path,function(err,stat){
                               should.not.exist(err)
                               should.exist(stat)
                               var test = (stat.mode & 0777 )
                               console.log(test)
                               test.should.equal(0744)
                               return callback()
                           })
                           return null
                       }

                       makedir.makedir(mode_path
                                      ,0744
                                      ,checkp)
                       return null
                   }
                  ,done)
    });
})
