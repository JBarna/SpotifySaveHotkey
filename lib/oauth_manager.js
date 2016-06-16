"use strict";

var URL = require('url'),
    fsHelper = require('./fs_helper'),
    server = require('./oauth_server'),
    https = require('./https_helper'),
    opener = require('./opener');


// get the token or create the new object
var token;
try {
    token = require('../token');
} catch(e){ token = {}; }


var tokenReadyCBs = [],
    refreshing = false,
    beganOauth = false;

exports.beginOauth = function(){
    beganOauth = true;
    server.setUp(exports.requestAccess);
}

exports.requestAccess = function(){

    var requestUrl = URL.parse( "https://accounts.spotify.com/authorize" );
    requestUrl.query = {
        "client_id": "0f5dde99fc944855a1c2196a49234611",
        "response_type": "code",
        "redirect_uri": "http://127.0.0.1:5060/authorize_callback",
        "scope": "user-library-modify"
    };
    
    opener( URL.format( requestUrl ));
    
    // If the user doesn't accept, or closes... relaunch in 30 seconds.
    setTimeout( () => {
        if (beganOauth){
            exports.requestAccess();
        }
    }, 30000 );
            
    
}

exports.getTokenFromSpotify = function(code, cb){
    
    var url_options = {
        hostname: "accounts.spotify.com",
        path: "/api/token",
        method: "POST",
        auth: "0f5dde99fc944855a1c2196a49234611:ce930566487249a5bec2f4f5affd769d",
        headers: {
            
            // have to include this or all goes to shit.
            "Content-Type": "application/x-www-form-urlencoded",
        }
    };
    
    var dataToSend = "grant_type=authorization_code&code=" + code + "&redirect_uri=http://127.0.0.1:5060/authorize_callback";
    
    https( url_options, dataToSend, returnedData => {
        
        token.access_token = returnedData.access_token;
        token.refresh_token = returnedData.refresh_token;
        token.token_time = Math.floor( Date.now() / 1000 );
        exports.writeTokenToFile();
        
        cb();
        beganOauth = false;
        
    });
    
}

exports.refreshToken = function(){
    refreshing = true;
    
    var url_options = {
        hostname: "accounts.spotify.com",
        path: "/api/token",
        method: "POST",
        auth: "0f5dde99fc944855a1c2196a49234611:ce930566487249a5bec2f4f5affd769d",
        headers: {
            
            // have to include this or all goes to shit.
            "Content-Type": "application/x-www-form-urlencoded",
        }
    };
    
    var dataToSend = "grant_type=refresh_token&refresh_token=" + token.refresh_token;
    
    https( url_options, dataToSend, returnedData => {
        
        
        token.access_token = returnedData.access_token;
        token.token_time = Math.floor( Date.now() / 1000 );
        exports.writeTokenToFile();
        
        for (var tokenCB of tokenReadyCBs)
            tokenCB(token.access_token);
        
        tokenReadyCBs = [];
        refreshing = false;
    });
    
}

exports.getBearerToken = function(cb){
    if (typeof token.access_token === "undefined"){
        if (!beganOauth) exports.beginOauth();
    
    }
    else {
        let currentTime = Math.floor( Date.now() / 1000 );
        
        if (currentTime - token.token_time >= 3600 ){
            if (!refreshing) exports.refreshToken();
                tokenReadyCBs.push(cb);
            
        }
        
         // keep this function asynchronous 
        else process.nextTick(() => cb(token.access_token));
    }
}


exports.writeTokenToFile = function(){
    
    fsHelper.writeFile('./token.json', token);
    
}                         