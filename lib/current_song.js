module.exports = currentSong;

var childProcess = require('child_process');

function currentSong(){
    
    
    if (process.platform === "win32"){
        
        var windowTitle = childProcess.execSync( 'tasklist /fi "imagename eq spotify.exe" /fo list /v' )
                            .toString()
                            .split('\r\n')
                            .filter( line => line.indexOf("Window Title") === 0)
                            .map ( line => line.split(": ")[1] )
                            .filter( line => line !== "AngleHiddenWindow" && line !== "OleMainThreadWndName")
                            [0];
                            
        if ( windowTitle === "Spotify")
            return false;
        
        else {
            
            var parts = windowTitle.split(" - ");
            
            return {
                artist: parts[0],
                track: parts[1]
            };
            
        }
        
    }
}