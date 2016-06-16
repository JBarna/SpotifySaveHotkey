var fs = require('fs'),
	URL = require('url');

/* This script downloads Java. 
* It handles the multiple redirects that oracle throws at you
* and it also sets our cookie to have accepted the license agreement 
*/

/* Currently it only supports windows... I just need to update the URL and probably make 
* the OS to download for part of the command line arguments */

// need to access them dynamically due to rerouting
var protocol = {
    http: require('http'),
    https: require('https')
};

var ws = fs.createWriteStream(process.argv[2]);

var startURL;

if (process.argv[3] === "x64") startURL= "http://download.oracle.com/otn-pub/java/jdk/8u91-b14/jre-8u91-windows-x64.exe";
else startURL = "http://download.oracle.com/otn-pub/java/jdk/8u91-b14/jre-8u91-windows-i586.exe";

recurringRequest(startURL);

function recurringRequest( newLocation ){
    
    var newPath = URL.parse(newLocation);
    
    var url_options = {
		hostname: newPath.host,
		path: newPath.path,
		method: "GET",
		headers: {
			Cookie: "oraclelicense=accept-securebackup-cookie"
		}
	};
    
    // substr to get rid of the colon at the end of http: for example
    protocol[newPath.protocol.substr(0, newPath.protocol.length -1)].request(url_options, res => {
        
        if (res.statusCode == 302){
            
            recurringRequest( res.headers.location);
            
        } else if (res.statusCode == 200){
            // wow... we actually got the file
            res.pipe(ws);
            
        }  
    }).end();    
}