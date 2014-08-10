var express = require('express'),
    http = require('http'),
    https = require('https'),
    fs = require('fs'),
    config = require('./config.json'),
    routes = require('./src/routes.js'),
    httpsApp = express(),
    httpApp = express();

//CORS
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'content-type, authorization, content-length, x-requested-with');
    next();
}

httpApp.use(allowCrossDomain);                  //allow CORS requests
routes.setup(httpApp);

httpApp.set('port', process.env.PORT || config.http.port);

//CREATE SERVER HTTP
http.createServer(httpApp).listen(httpApp.get('port'), function(){
    console.log("http  is listening on port", httpApp.get('port'));
});


if(config.https != null) {

    //MIDDLEWARE
    httpsApp.use(allowCrossDomain);                  //allow CORS requests
    routes.setup(httpsApp);

    //SSL MANAGEMENT
    var sslOptions = {},
        key = config.https.key,
        cert = config.https.cert,
        ca = config.https.ca;

    if(typeof key !== "undefined") {
        sslOptions.key = fs.readFileSync(key, 'utf8');
    }
    if(typeof cert !== "undefined") {
        sslOptions.cert = fs.readFileSync(cert, 'utf8');
    }
    if(typeof ca !== "undefined") {
        sslOptions.ca = [];
        for(var ci = 0; ci < ca.length; ci++) {
            var caFile = ca[ci];
            sslOptions.ca.push(fs.readFileSync(caFile, 'utf8'));
        }
    }

    //CREATE SERVER HTTPS
    https.createServer(sslOptions, httpsApp).listen(config.https.port, function(){
        console.log("http  is listening on port", config.https.port);
    });
}