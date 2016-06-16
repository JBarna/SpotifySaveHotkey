var spawn = require('child_process').spawn,
    path = require('path'),
    fs = require('fs');
    updater = require('./dlapp');


// the processes running off the bat
killOldProcesses();

// So originally I wanted to store the PIDs in a simple text file
// so we could kill them from the command line... well for some reason
// thanks to windows I can't kill them from BATCH because the file
// doesn't update or something in the file system... probaly an os
// issue with caching.
if (process.argv[2] === "uninstall"){
    
    // remove the process from startup
    require('./SpotifySaveHotkey/lib/startup_manager').setState(false);
    
    return;
}

// alright we're not uninstalling, so lets see if we're going to update
updater( () => {

    var pidsPath = path.join( __dirname, "pids");
    
    // start the main application as a detatched process...  
    // this is the only way I could get it running silently in the
    // background without a command prompt window open ( at least on windows )
    var indexPath = path.join( __dirname, "SpotifySaveHotkey", "index.js");
    var logPath = path.join( __dirname, "log.txt");

    var out = fs.openSync(logPath, 'a');
    var err = fs.openSync(logPath, 'a');

    var child = spawn('node', [ indexPath ], {
        detached: true,
        stdio: ['ignore', out, err]
    });

    // write the pid to file
    fs.writeFileSync( pidsPath, "" + child.pid );
    
    // unreference and exit
    child.unref();
    process.exit(0);

});

function killOldProcesses(){
    var pidsPath = path.join( __dirname, "pids");
    
    // kill the old processes 
    if (fs.existsSync( pidsPath )){
        var pids = fs.readFileSync( pidsPath, "utf8").split(/\s+/);
        try {
            process.kill(pids[0]);
            process.kill(pids[1]);
            
        } catch (e){}
    };
}