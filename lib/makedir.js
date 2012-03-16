/* global process require __dirname exports console */
/** makedir.js
 * How I make directories recursively in node.js
 *
 * If you pass it a directory that you want to exist, it will traverse
 * the directory tree up until it finds a directory that does exist,
 * and then it will go back down the directory structure making all
 * directories as needed.
 *
 * For example, if you have /home/james and you want to create
 * /home/james/node/repository/makedir,
 *
 * then it will look for
 *   /home/james/node/repository/makedir
 * then
 *   /home/james/node/repository
 * then
 *   /home/james/node then /home/james,
 * will find that directory, and
 * then it will create
 *   /home/james/node
 * and then
 *   /home/james/node/repository
 * and then
 *   /home/james/node/repository/makedir
 */

var fs = require('fs');
var path = require('path');
var rootdir = __dirname;

// do the actual directory making.  probably should add mode as a
// parameter somewhere

function makeme (dir,mode,cb){

    var callback = function(err,parent){
        //console.log('makeme: ',dir)
        if(err) throw new Error(err)
        if(parent){
            // replace root of dir with parent
            dir = path.join(parent,path.basename(dir));
        }
        fs.mkdir(dir,mode,function(err){
            if(err !== null){
                if( err.code === 'EEXIST'
                 && err.path === dir){
                    // make sure the directory really does exist
                    fs.stat(dir,function(staterr,stat){
                        // as mkdirP guys say, this is very strange
                        if(staterr || !stat.isDirectory()){
                            if(cb) cb(err);
                        }
                        if(cb) cb(null,dir);
                        return null;
                        // if the stat is good, do nothing.  some other processed did it
                    });

                }else{
                    console.log(err);
                    throw new Error(err);
                }
            }else{
                if(cb) cb(null,dir);
            }
            return 1;

        });
    };
    return callback;
};

//
// function to handle stat
//
function handleStatforPath(p, mode, parent,next){
    return function(exists){
        if(!exists){
            //console.log('no path ' + p + ' so recurse');
            return makedir(parent,
                           mode,
                           makeme(p,mode,next));
        }else{
             // console.log('have path, recursing ends at ',p);
            next();
        }
        return 1;
    };
}


// March 2012, cribbing some things from mkdirP --- file mode

// the function that gets exported, but doesn't actually do any directory making
// checks if a directory parent exists using stat.  If not, recurs into parent.
function makedir(p,mode,next){
    if (typeof mode === 'function' || mode === undefined) {
        next = mode;
        mode = 0777 & (~process.umask());
    }
    if (typeof mode === 'string') mode = parseInt(mode, 8);
    p = path.resolve(p);
    // recursively make sure that directory exists.
    //

    var parent = path.dirname(p);
    if(parent){
        path.exists(p,handleStatforPath(p,mode,parent,next));
    }else{
        // following convention, if the path is actually a dot at this
        // point, prepend the current process root dir and carry on
        // back up the stack.
        //
        if(p === '.'){
            // replace . with rootdir
            p = rootdir;
            // recurse back up with that value
            return next(null,p)
        }

        //
        // not sure what is up.  path.dirname should create '.' for
        // parent of relative path names
        //
        console.log('in make parent dir, no parents left for : '+p+' try prepending the process root dir');
        throw new Error('parent failure ' + p);
    }
    return null;
}
exports.makedir = makedir;
