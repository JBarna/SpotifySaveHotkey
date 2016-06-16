var fs = require('fs'),
    path = require('path');


/* This module helps write files using the correct path.
* You always have to be careful when using fs with relative paths
* Because it's relative to process.cwd()
* 
* So this module aways makes sure we're relative to our root directory
*/

/* Write file in JSON to the relative path */
exports.writeFile = function( relativePath, data ){
    
    var filePath = exports.getFullPath( relativePath );
    
    fs.writeFileSync( filePath, JSON.stringify(data, null, '\t'));
    
}

/* Returns the full path from this relative path */
exports.getFullPath = function( relativePath ){
    
    var mainDir = path.join( __dirname, "..");
    var filePath = path.join( mainDir, relativePath);
    
    return filePath;
}