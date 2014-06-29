var Express = require('express'),
    Morgan = require('morgan'),
    BodyParser = require('body-parser'),
    FolderContents = require('folder-contents'),
    Util = require('util'),
    Colors = require('colors'),
    Config = require('./server/config.js'),
    CookieParser = require('cookie-parser'),
    Session = require('express-session'),
    DatabaseManager = require('./server/DatabaseManager.js');

/*
var cronJob = require('cron').CronJob;
new cronJob('0 * * * * *', function(){
    console.log('You will see this message every second');
}, null, true, "America/Los_Angeles");
*/

Colors.setTheme({
    info: 'green',
    verbose: 'cyan',
    service: 'magenta',
    error: 'red',
    debug: 'blue'
});

/****************************************************************
* INIT
****************************************************************/

var databasePath = __dirname + "/test.db";
DatabaseManager.initDatabase(databasePath);

if (Config.server_public_base == "") Config.server_public_base = __dirname;
if (Config.server_sharing_base == "") Config.server_sharing_base = __dirname;

var app = Express();

//app.use(Morgan());
app.use(BodyParser.json());       // to support JSON-encoded bodies
app.use(BodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies
app.use(Session({ secret: 'My great secret', cookie: { maxAge: 60*60*1000 }}));
app.use(CookieParser());

// Filter to use a token
app.all('/media/token/*',function(req, res, next){
    //console.log(req.cookies);
    next();
});

// Ip filter
app.all('*/*',function(req, res, next){
    Util.log(("Request : "+ req.method + " " + req.url).service);
    next();
});

Util.log(("Public web folder : " + Config.server_public_base + Config.server_public_dir).bold.info);
app.use(Express.static( Config.server_public_base + Config.server_public_dir ));

/*
app.post('/api/auth', function(req, res){

});

app.get('/api/session', function(req, res){

});
*/

// Session is needed for next methods of api
app.all('*/*',function(req, res, next){
    // if auth request
    if (req.url == "/api/auth"){
        var username = req.body.username;
        var password = req.body.password;
        DatabaseManager.getUser(username,password,function(err, row){
            if(row){
                DatabaseManager.addSession(req,row.id);
                // TODO add connexion history ?
                res.send(row);
            } else {
                Util.log(("Error 404 : "+ req.method + " " + req.url).error);
                res.send('404','Not found');
            }
        });
    // if session auth request
    } else if (req.url == "/api/session") {
        DatabaseManager.getSessionUser(req,null,function(err, row){
            if (row) {
                res.send(row);
            } else {
                Util.log(("Error 403 : "+ req.method + " " + req.url).error);
                res.send('403','Forbiden');
            }
        });
    // else test session for next steps
    } else {
        DatabaseManager.sessionExist(req,null,function(exist){
            if (exist) next();
            else {
                Util.log(("Error 403 : "+ req.method + " " + req.url).error);
                res.send('403','Forbiden');
            }
        });
    }
});

Util.log(("Sharing web folder : " + Config.server_sharing_base + Config.server_sharing_dir).bold.info);
app.use(Config.server_sharing_ui_path, Express.static( Config.server_sharing_base + Config.server_sharing_dir ));

app.post('/api/folder/list', function(req, res){

    var options = req.body;

    Util.log(("Request : " + JSON.stringify(options)).service);

    // force usage of basepath to false
    options.useBasePath = false;
    options.useFullPath = true;
    // force to use server base path
    options.path = Config.server_sharing_base + Config.server_sharing_dir + options.path;

    var jsonResult = FolderContents(options);

    Util.log("Result : ".service);
    Util.log((JSON.stringify(jsonResult)).service);

    res.send(jsonResult);

});

app.post('/api/folder/delete', function(req, res){});
app.post('/api/folder/rename', function(req, res){});
app.post('/api/file/delete', function(req, res){});
app.post('/api/file/rename', function(req, res){});

app.listen(Config.server_port);

