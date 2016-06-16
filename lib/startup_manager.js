"use strict";

var fs = require('fs'),
    fsHelper = require('./fs_helper'),
    path = require('path'),
    childProcess = require('child_process'),
    opener = require('./opener');


/* This function sets whether or not this program will launch on startup
* I don't know how it works on other OSes, but on windows we are going to 
* launch by placing a lnk to our file in the startup folder, which 
* gets executed every time at startup. 
*
* If the user doesn't want this application to launch on startup, we remove the lnk 
* from that folder entirely
*/
exports.setState = function( state ){

    if (process.platform === "win32"){

        let startupPath = path.join( process.env.APPDATA, 'Microsoft', 'Windows','Start Menu', 'Programs', 'Startup'); 
        let filePath = path.join( startupPath, 'SpotifySaveHotkey.lnk');

        if (fs.existsSync(startupPath)){
            
            if (state === "true" || typeof state === "boolean" && state){

                // we are going to use our VBS file with cscript to make the link
                let args = [];
                
                args.push( fsHelper.getFullPath('../linker.vbs') );
                args.push( filePath );
                args.push( fsHelper.getFullPath('../node') );
                args.push( fsHelper.getFullPath('../entry.js') );
                args.push( fsHelper.getFullPath('../w_icon.ico') );
                
                args = args.map( arg => '"' + arg + '"' );
                
                childProcess.execSync('start /MIN /WAIT cscript ' + args.join(" "));
                
            } else { // user doesn't want to launch on startup
                
                if (fs.existsSync( filePath ))
                    fs.unlinkSync( filePath );
                
            }
        }
    }
}


/* This returns whether or not we are launching on startup
* This is currently used to tell the Jar what to display
*/
exports.getState = function(){
    
    if (process.platform === "win32"){
        
        let startupPath = path.join( process.env.APPDATA, 'Microsoft', 'Windows','Start Menu', 'Programs', 'Startup'); 
        let filePath = path.join( startupPath, 'SpotifySaveHotkey.lnk');
        
        return fs.existsSync( filePath );
    }
    
}