var Express = require('express'),
    Morgan = require('morgan'),
    BodyParser = require('body-parser'),
    FolderContents = require('folder-contents'),
    Util = require('util'),
    Colors = require('colors'),
    Config = require('./server/config.js'),
    Fs = require("fs"),
    Sqlite3 = require("sqlite3").verbose(),
    jsSHA = require("jssha"),
    CookieParser = require('cookie-parser'),
    Session = require('express-session');

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

var database = __dirname + "/test.db";
var databaseExists = Fs.existsSync(database);

if(!databaseExists) {
    Util.log("Creating DB file.".bold.info);
    Fs.openSync(database, "w");
}

var db = new Sqlite3.Database(database);
db.serialize(function() {
    if(!databaseExists) {
        db.run("CREATE TABLE _users (username TEXT,password TEXT,email TEXT )");
        db.run("CREATE TABLE _server_allow_ip (value TEXT UNIQUE)");
        db.run("CREATE TABLE _server_ignore_extension (value TEXT UNIQUE)");
        db.run("CREATE TABLE _server_ignore_file (value TEXT UNIQUE)");
        db.run("CREATE TABLE _server_ignore_folder (value TEXT UNIQUE)");

        var shaObj = new jsSHA("admin", "TEXT");
        var hash = shaObj.getHash("SHA-512", "HEX");

        var stmt = db.prepare("INSERT INTO _users VALUES (?,?,?)");
        stmt.run(["admin",hash,"npm.dream@gmail.com"]);
        stmt.finalize();
    }
    db.each("SELECT rowid AS id, password, username, email FROM _users", function(err, row) {
        Util.log(row.id + ": " + row.password);
    });
});


if (Config.server_public_base == "") Config.server_public_base = __dirname;
if (Config.server_sharing_base == "") Config.server_sharing_base = __dirname;

var app = Express();

//app.use(Morgan());
app.use(BodyParser.json());       // to support JSON-encoded bodies
app.use(BodyParser.urlencoded()); // to support URL-encoded bodies
app.use(Session({ secret: 'My great secret', cookie: { maxAge: 600000 }}));
app.use(CookieParser());

// External filter
app.all('*/*',function(req, res, next){
    console.log(JSON.stringify(req.cookies));
    //res.send("404","Test restricted access");
    /*
    var testToreturn = "toto";
    db.serialize(function() {

        db.all("SELECT rowid AS id, password FROM Users", function(err, rows) {
            console.log(rows);
            res.send(rows);
        });

    });
    */
    //res.redirect('/403.html');
    next();
});

// Ip filter
app.all('*/*',function(req, res, next){
    next();
});

// Session filter
app.all('*/*',function(req, res, next){

    next();
});

app.post('/api/auth', function(req, res){

    Util.log("Request : /api/auth".service);

    var req_username = req.body.username;
    var req_password = req.body.password;
    var sha_password = new jsSHA(req_password, "TEXT");
    var hash_password = sha_password.getHash("SHA-512", "HEX");

    var sql = "SELECT * FROM _users WHERE username = '"+req_username+"' AND password = '"+hash_password+"'";

    db.get(sql, function(err, row) {

        if(row){
            // if user found
            req.session.username = req_username;
            req.session.success = 'accepted';
            row.password = '';
            res.send(row);
            // Connexion history ?
        } else {
            // if user not found
            req.session.error = 'Authentication failed, please check your username and password.'
            res.send('403','forbiden');
        }

    });

});

// Other filters
app.all('*/*',function(req, res, next){
    next();
});

Util.log(("Public web folder : " + Config.server_public_base + Config.server_public_dir).bold.info);
app.use(Express.static( Config.server_public_base + Config.server_public_dir ));

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

//db.close();

app.listen(Config.server_port);

