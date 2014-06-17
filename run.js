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

if (Config.server_dir == "") Config.server_dir = __dirname;

//console.log(Config.server_dir + Config.server_public);

Util.log(("Public web folder : " + Config.server_dir + Config.server_public).help);
app.use(Express.static( Config.server_dir + Config.server_public));

Util.log(("Sharing web folder : " + Config.server_dir + Config.server_sharing).help);
app.use(Config.server_sharing, Express.static( Config.server_dir + Config.server_sharing));

app.use(BodyParser.json());       // to support JSON-encoded bodies
app.use(BodyParser.urlencoded()); // to support URL-encoded bodies

app.post('/api/folder/list', function(req, res){
    Util.log(JSON.stringify(req.body).input);
    var options = req.body;
    var jsonResult = FolderContents(options);
    res.send(JSON.stringify(jsonResult));
});

app.post('/api/folder/delete', function(req, res){});
app.post('/api/folder/rename', function(req, res){});
app.post('/api/file/delete', function(req, res){});
app.post('/api/file/rename', function(req, res){});

app.listen(Config.server_port);