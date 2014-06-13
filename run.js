var Express = require('express'),
    Morgan = require('morgan'),
    BodyParser = require('body-parser')
    FolderContents = require('folder-contents'),
    Colors = require('colors');

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

app.set('title', 'Formation');

app.use(Express.static(__dirname + '/public'));
app.use('/sharing', Express.static(__dirname + '/sharing'));

app.use(BodyParser.json());       // to support JSON-encoded bodies
app.use(BodyParser.urlencoded()); // to support URL-encoded bodies

app.get('/api/folder/list', function(req, res){
    console.time("Duration");
    var options = {
        "path":".",
        "recursively":true,
        "useFullPath":true,
        "date":"yyyy/mm/dd - HH:MM:ss",
        "size":{
            "b":" B...",
            "kb":" kB...",
            "mb":" mB...",
            "gb":" gB...",
            "tb":" tB..."
        }
    };
    var jsonResult = FolderContents(options);
    console.timeEnd("Duration");
    res.send(JSON.stringify(jsonResult));
});

app.post('/api/contents/list', function(req, res){
    console.log(req.body);
    console.time("Duration");
    var options = {
        "path":req.body.path,
        "date":"yyyy/mm/dd HH:MM:ss",
        "size":{
            "b":" o",
            "kb":" ko",
            "mb":" mo",
            "gb":" go",
            "tb":" to"
        }
    };
    var jsonResult = FolderContents(options);
    console.timeEnd("Duration");
    res.send(JSON.stringify(jsonResult));
});

app.listen(3000);