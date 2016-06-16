module.exports = Loader;

var fs = require('fs'),
    fsHelper = require('./fs_helper');


function Loader(){
    
    return fs.readFileSync( fsHelper.getFullPath('./hotkey.txt'), 'utf8').split(/\r?\n/)[0];

}