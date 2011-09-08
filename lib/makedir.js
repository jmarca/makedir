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
function makeme (dir,cb){
    var callback = function(err,parent){
        //console.log('makeme: ',dir)
        if(err) throw new Error(err)
        if(parent){
            // replace root of dir with parent
            dir = path.join(parent,path.basename(dir));
        }
        fs.mkdir(dir,0777,function(err){
            if(err) {
                if(
                    err.code==='EEXIST' &&
                        err.path === dir){
                    // do nothing.  some other processed did it
                }else{
                    //console.log(JSON.stringify(err));
                    throw new Error(err);
                }
            }
            if(cb) cb(null,dir);
            return 1;
        });
    };
    return callback;
};

//
// function to handle stat
//
function handleStatforPath(p, parent,next){
    return function(exists){
        if(!exists){
            //console.log('no path ' + p + ' so recurse');
            return makedir(parent,
                           makeme(p,next));
        }else{
             // console.log('have path, recursing ends at ',p);
            next();
        }
        return 1;
    };
}

// the function that gets exported, but doesn't actually do any directory making
// checks if a directory parent exists using stat.  If not, recurs into parent.
function makedir(p,next){
    // recursively make sure that directory exists.
    //

    var parent = path.dirname(p);
    if(parent){
        // console.log('handling: ',parent);
        path.exists(p,handleStatforPath(p,parent,next));
    }else{
        // todo
        //
        // following convention, if the path is actually a dot at this
        // point, prepend the current process root dir and carry on
        // back up the stack.
        //
        if(p === '.'){
            // replace . with rootdir
            p = rootdir;
            // recurse back up with that value
            next(null,p)
        }

        //
        // not sure what is up.  path.dirname should create '.' for
        // parent of relative path names
        //
        console.log('in make parent dir, no parents left for : '+p+' try prepending the process root dir');
        throw new Error('parent failure ' + p);
    }
    return;
}
exports.makedir = makedir;
