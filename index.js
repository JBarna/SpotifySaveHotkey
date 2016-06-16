var oauth = require('./lib/oauth_manager'),
    jarManager = require('./lib/jar_manager'),
    currentSong = require('./lib/current_song'),
    hotkey = require('./lib/hotkey_loader');

// Perform Oauth2 right away with no callback
oauth.getBearerToken( Function.prototype );

// launch our Jar file
jarManager.start();
