module.exports = saveSong;

var https = require('./https_helper'),
    currentSong = require('./current_song'),
    queryString = require('querystring'),
    oauth = require('./oauth_manager'),
    jar = require('./jar_manager');

function saveSong(){
    
    // get the current song
    var song = currentSong();
    
    // if there's no song playing, just return
    if (!song) return;
    
    console.log("current playing song", song);
    
    var url_options = {
        method: "GET",
        hostname: "api.spotify.com"
    };
    
    var queries = {
        q: "artist:" + song.artist + " track:" + song.track,
        limit: 1,
        type: "track"
    };
    
    url_options.path = "/v1/search?" + queryString.stringify( queries ); 
    
    https( url_options, null, json => {
        
        if (json.tracks.items.length >= 1){
            
            // we have our song id
            var songId = json.tracks.items[0].id;
            
            oauth.getBearerToken( access_token => {
                
                url_options.headers = {
                    Authorization: "Bearer " + access_token
                }
                
                url_options.path = "/v1/me/tracks?ids=" + songId;
                url_options.method = "PUT";
                
                https( url_options, null, res => {
                    
                    if (res === 200){
                        
                        console.log("Successfully saved song " + song.track + " by " + song.artist);
                        jar.alert();
                        
                    } else {
                        
                        console.error("Could not save track " + song.track + " by " + song.artist);
                        console.error( res );
                        
                    }
                    
                });
                

            });
            
        }
        
    });
    
    
}