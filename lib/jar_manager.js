var childProcess = require('child_process'),
    fsHelper = require('./fs_helper'),
    fs = require('fs'),
    hotkey = require('./hotkey_loader'),
    saveSong = require('./save_song'),
    opener = require('./opener'),
    startup = require('./startup_manager');
    

var jar;

exports.start = function( keypress ){
    
    jar = childProcess.spawn('java', ['-jar', fsHelper.getFullPath('./Hotkeyz.jar') ], { detached: true });
    
    // record the PID of this process
    var pidsPath = fsHelper.getFullPath('../pids');
    
    if (fs.existsSync( pidsPath )){
        var pids = fs.readFileSync( pidsPath, "utf8");
        pids += " " + jar.pid;
        fs.writeFileSync( pidsPath, pids);
    }
    
    // handle not having java in our path
    jar.on('error', err => {
        
        console.error( err );
        console.error("This most likely happened because you don't have `java` in your path, or it's not installed");
        process.exit(1);

    });

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
                    
                    if (typeof parts[2] !== "undefined"){
                        
                        startup.setState(parts[2]);
                        data = "";
                    }
                }
            }
        }
        
        
    });
    
    
    // send startup information to the jar
    jar.stdin.write("hotkey\n");
    jar.stdin.write( hotkey() + "\n" );
    
    // only send runOnStartup info if it's supported on this OS
    var startUpState = startup.getState();
    if (typeof startUpState !== "undefined"){
        
        jar.stdin.write("config\nstartup\n");
        jar.stdin.write( startUpState + "\n");
    }
}

exports.alert = function(){
    
    jar.stdin.write("play_alert\n");
    
}