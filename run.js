var Express = require('express'),
    Morgan = require('morgan'),
    BodyParser = require('body-parser')
    FolderContents = require('folder-contents'),
    Util = require('util')
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

app.post('/api/folder/list', function(req, res){
    Util.log(JSON.stringify(req.body).input);
    console.time("Duration");
    var options = req.body;
    var jsonResult = FolderContents(options);
    console.timeEnd("Duration");
    res.send(JSON.stringify(jsonResult));
});

app.listen(3000);