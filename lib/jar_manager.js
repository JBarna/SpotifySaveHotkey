var childProcess = require('child_process'),
    fsHelper = require('./fs_helper'),
    hotkey = require('./hotkey_loader'),
    saveSong = require('./save_song'),
    opener = require('./opener');
    


exports.start = function( keypress ){
    
    var jar = childProcess.spawn('java', ['-jar', fsHelper.getFullPath('./Hotkeyz.jar') ]);
    
    // handle not having java in our path
    jar.on('error', err => {
        
        console.error( err );
        console.error("This most likely happened because you don't have `java` in your path, or it's not installed");
        process.exit(1);

    });
    
/*    // handle stderr
    jar.stderr.setEncoding('utf8');
    jar.stderr.on('data', chunk => {
        console.error("Error in Jarfile " + chunk);
        console.error("Exiting");
        process.exit(1);
    });*/


    // handle stdout 
    var data = "";
    jar.stdout.setEncoding('utf8');
    jar.stdout.on('data', chunk => {
        console.log("chunk", chunk);
        data += chunk;
        
        parse( data.split( /\r?\n/g ));
        function parse( parts ){

            if (parts[0] === "keypress"){
                
                saveSong();
                data = "";
                
            } else if (parts[0] === "about"){
                
                opener( "https://github.com/JBarna/SpotifySaveHotkey" );
                data = "";
                
            } else if (parts[0] === "exit"){
                
                process.exit(0);
                
            }else if (parts[0] === "config"){
                
                if (parts[1] === "changekey"){
                    
                    opener( fsHelper.getFullPath('./hotkey.txt'));
                    
                    data = "";
                }
                
                else if (parts[1] === "startup"){
                    
                    if (typeof parts[2] !== "undefined")
                        data = "";
                }
            }
        }
        
        
    });
    
    
    // send startup information to the jar
    jar.stdin.write("hotkey\n");
    jar.stdin.write( hotkey() + "\n");
    
    
}