var Express = require('express'),
    Morgan = require('morgan'),
    BodyParser = require('body-parser')
    FolderContents = require('folder-contents'),
    Util = require('util'),
    Colors = require('colors'),
    Config = require('./server/config.js');



Colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red'
});

var app = Express();

app.use(Morgan());

app.set('title', 'folder-to-ui');

if (Config.server_public_base == "") Config.server_public_base = __dirname;
if (Config.server_sharing_base == "") Config.server_sharing_base = __dirname;

Util.log(("Public web folder : " + Config.server_public_base + Config.server_public_dir).help);
app.use(Express.static( Config.server_public_base + Config.server_public_dir ));

Util.log(("Sharing web folder : " + Config.server_sharing_base + Config.server_sharing_dir).help);
app.use(Config.server_sharing_ui_path, Express.static( Config.server_sharing_base + Config.server_sharing_dir ));

app.use(BodyParser.json());       // to support JSON-encoded bodies
app.use(BodyParser.urlencoded()); // to support URL-encoded bodies

app.post('/api/folder/list', function(req, res){

    /*
    Util.log("Request body : ".help);
    Util.log(JSON.stringify(req.body).input);
    */

    var options = req.body;

    // force usage of basepath to false
    options.useBasePath = false;
    // force to use server base path
    options.path = Config.server_sharing_base + Config.server_sharing_dir + options.path;

    Util.log(("Requested folder : " + options.path).debug);

    var jsonResult = FolderContents(options);

    /*
    Util.log("Result : ".help);
    Util.log(JSON.stringify(jsonResult));
    */
    res.send(JSON.stringify(jsonResult));

});

app.post('/api/folder/delete', function(req, res){});
app.post('/api/folder/rename', function(req, res){});
app.post('/api/file/delete', function(req, res){});
app.post('/api/file/rename', function(req, res){});

app.listen(Config.server_port);