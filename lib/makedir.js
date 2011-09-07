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

// do the actual directory making.  probably should add mode as a
// parameter somewhere
function makeme (dir,cb){
    return function(){
        console.log('makeme: ',dir);
        fs.mkdir(dir,0777,function(err){
            if(err) {
                if(
                   err.code==='EEXIST' &&
                   err.path === dir){
                    // do nothing
                }else{
                    console.log(JSON.stringify(err));
                    throw new Error(err);
                }
            }
            if(cb) cb();
            return 1;
        });
    };
};

//
// function to handle stat
//
function handleStatforPath(path, parent,next){
    return function(err,stats){
        if(err){
            console.log('no path ' + path + ' so recurse');
            return makedir(parent,
                           makeme(path,next));
        }else{
             console.log('have path, recursing ends at ',path);
            next();
        }
        return 1;
    };
}

// the function that gets exported, but doesn't actually do any directory making
// checks if a directory parent exists using stat.  If not, recurs into parent.
function makedir(path,next){
    // recursively make sure that directory exists.
    if(/(.*?)\/[^/]+\/?$/.exec(path)){
        // console.log('handling: ',path);
        fs.stat(path,handleStatforPath(path,RegExp.$1,next));
    }else{
        console.log('in make parent dir, regex failed on : ',path);
        throw new Error('regex failure ' + path);
    }
    return;
}
exports.makedir = makedir;
