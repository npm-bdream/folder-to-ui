var Express = require('express'),
    Morgan = require('morgan'),
    BodyParser = require('body-parser'),
    FolderContents = require('folder-contents'),
    Util = require('util'),
    Colors = require('colors'),
    Config = require('./server/config.js'),
    Fs = require("fs"),
    Sqlite3 = require("sqlite3").verbose();

Colors.setTheme({
    info: 'green',
    verbose: 'cyan',
    service: 'magenta',
    error: 'red',
    debug: 'blue'
});


var database = __dirname + "/test.db";
var databaseExists = Fs.existsSync(database);

if(!databaseExists) {
    console.log("Creating DB file.");
    Fs.openSync(database, "w");
}

var db = new Sqlite3.Database(database);

db.serialize(function() {
    if(!databaseExists) {
        db.run("CREATE TABLE Users (login TEXT,password TEXT,email TEXT )");
    }

    var stmt = db.prepare("INSERT INTO Users VALUES (?,?,?)");

//Insert random data
    var rnd;
    for (var i = 0; i < 10; i++) {
        rnd = Math.floor(Math.random() * 10000000);
        stmt.run(["login #" + rnd,"password #" + rnd,"email #" + rnd]);
    }

    stmt.finalize();
    db.each("SELECT rowid AS id, password FROM Users", function(err, row) {
        console.log(row.id + ": " + row.password);
    });
});

//db.close();


















var app = Express();

app.use(Morgan());

if (Config.server_public_base == "") Config.server_public_base = __dirname;
if (Config.server_sharing_base == "") Config.server_sharing_base = __dirname;

// simple logger
app.all(Config.server_sharing_ui_path+'/*',function(req, res, next){
    //res.send("404","Test restricted access");
    var testToreturn = "toto";
    db.serialize(function() {



        db.all("SELECT rowid AS id, password FROM Users", function(err, rows) {
            console.log(rows);
            res.send(rows);
        });


    });



    //res.redirect('/403.html');
    //next();
});

Util.log(("Public web folder : " + Config.server_public_base + Config.server_public_dir).bold.verbose);
app.use(Express.static( Config.server_public_base + Config.server_public_dir ));

Util.log(("Sharing web folder : " + Config.server_sharing_base + Config.server_sharing_dir).bold.verbose);
app.use(Config.server_sharing_ui_path, Express.static( Config.server_sharing_base + Config.server_sharing_dir ));

app.use(BodyParser.json());       // to support JSON-encoded bodies
app.use(BodyParser.urlencoded()); // to support URL-encoded bodies



app.post('/api/folder/list', function(req, res){

    var options = req.body;

    // force usage of basepath to false
    options.useBasePath = false;
    options.useFullPath = true;
    // force to use server base path
    options.path = Config.server_sharing_base + Config.server_sharing_dir + options.path;

    Util.log(("Requested folder : " + options.path).service);

    var jsonResult = FolderContents(options);


    Util.log("Result : ".service);
    Util.log((JSON.stringify(jsonResult)).service);

    res.send(JSON.stringify(jsonResult));

});

app.post('/api/folder/delete', function(req, res){});
app.post('/api/folder/rename', function(req, res){});
app.post('/api/file/delete', function(req, res){});
app.post('/api/file/rename', function(req, res){});



app.listen(Config.server_port);