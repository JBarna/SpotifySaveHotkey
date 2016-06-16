"use strict"

var oauth = require('./oauth_manager'),
    http = require('http'),
    URL = require('url');


/* This module creates the server necessary for Oauth
* Listens on local host port 5050
*/

exports.setUp = function(cb){
    
    var httpServer = http.createServer( (req, res) => {
        
        var url = URL.parse(req.url, true);
        
        if (url.pathname === "/authorize_callback"){
            res.writeHead(200, {'Content-Type': 'text/plain'});
            
            if (url.query.error === "access_denied"){
                console.error("Authorization error", url.query.error);
                
                
                res.end("Access denied. Please click \"accept\" if you wish to use this service. Retrying in 5 seconds.");
                setTimeout( oauth.requestAccess, 5000);
                
            } else /* Success! */ {
                
                oauth.getTokenFromSpotify( url.query.code, () => {
                
                    httpServer.close();
                    res.end("You're all set!");

                });
                
            } 
            
        }
    });
    
    httpServer.listen(5060, () => {
        console.log("Listening on 5060");
        cb();
    });
    
}
