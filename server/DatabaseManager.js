var jsSHA = require("jssha"),
    Sqlite3 = require("sqlite3").verbose(),
    Util = require('util'),
    Fs = require("fs"),
    DatabaseManager = function () {};

DatabaseManager.db;

/*******************************************
 * Init and create
 *******************************************/

DatabaseManager.initDatabase = function (databasePath) {
    var databaseExists = Fs.existsSync(databasePath);
    if(!databaseExists) {
        Util.log("Creating DB file.".bold.info);
        Fs.openSync(databasePath, "w");
    }
    DatabaseManager.db = new Sqlite3.Database(databasePath);
    DatabaseManager.createDatabase(databaseExists);

    // Remove all sessions
    Util.log("Delete all sessions from DB.".bold.info);
    DatabaseManager.deleteAllSessions();
};

DatabaseManager.createDatabase = function (exists) {
    if (!exists) {
        var db = DatabaseManager.db;
        db.serialize(function () {
            db.run("CREATE TABLE _users (username TEXT, password TEXT, email TEXT, theme TEXT, isAdmin INT)");
            db.run("CREATE TABLE _sessions (userid TEXT, userip TEXT, sid TEXT, cookies TEXT, expires TEXT)");
            db.run("CREATE TABLE _server_allow_ip (value TEXT UNIQUE)");
            db.run("CREATE TABLE _server_ignore_extension (value TEXT UNIQUE)");
            db.run("CREATE TABLE _server_ignore_file (value TEXT UNIQUE)");
            db.run("CREATE TABLE _server_ignore_folder (value TEXT UNIQUE)");

            var shaObj = new jsSHA("admin", "TEXT");
            var hash = shaObj.getHash("SHA-512", "HEX");

            var stmt = db.prepare("INSERT INTO _users VALUES (?,?,?)");
            stmt.run(["admin", hash, "npm.dream@gmail.com"]);
            stmt.finalize();

            var stmt = db.prepare("INSERT INTO _users VALUES (?,?,?)");
            stmt.run(["admin1", hash, "npm.dream@gmail.com"]);
            stmt.finalize();

            var stmt = db.prepare("INSERT INTO _users VALUES (?,?,?)");
            stmt.run(["admin2", hash, "npm.dream@gmail.com"]);
            stmt.finalize();
        });
    }
};

/*******************************************
 * Users
 *******************************************/

DatabaseManager.getUsers = function (returnFunc) {
    var db = DatabaseManager.db;
    db.all("SELECT rowid AS id, username, email FROM _users", function(err, rows) {
        returnFunc(err, rows);
    });
};

DatabaseManager.getUser = function (username,password,returnFunc) {
    var db = DatabaseManager.db;
    var sha_password = new jsSHA(password, "TEXT");
    var hash_password = sha_password.getHash("SHA-512", "HEX");
    var sql = "SELECT rowid AS id, username, email FROM _users WHERE username = '"+username+"' AND password = '"+hash_password+"'";
    db.get(sql, function(err, row) {
        returnFunc(err, row);
    });
};

/*******************************************
 * Sessions & cookies
 *******************************************/

DatabaseManager.getSessionUser = function (req,userid,returnFunc) {
    var session = DatabaseManager.utils.formatSession(req,userid);
    if(session.sid && session.userip && session.expires && session.cookies) {
        var db = DatabaseManager.db;
        var sql = "SELECT u.rowid AS id, u.username, u.email FROM _sessions s ";
        sql += "JOIN _users u ON s.userid = u.rowid ";
        sql += "WHERE s.userip = '" + session.userip + "' ";
        if (userid != null) sql += "AND s.userid = '" + session.userid + "' ";
        sql += "AND s.sid = '" + session.sid + "' ";
        sql += "AND s.cookies = '" + session.cookies + "' ";

        db.get(sql, function (err, row) {
            returnFunc(err, row);
        });
    }
};

DatabaseManager.sessionExist = function (req,userid,returnFunc) {
    var session = DatabaseManager.utils.formatSession(req,userid);
    if(session.sid && session.userip && session.expires && session.cookies) {
        var db = DatabaseManager.db;
        var sql = "SELECT rowid AS id, userid FROM _sessions WHERE ";
        sql += "userip = '" + session.userip + "' ";
        if (userid!=null) sql += "AND userid = '" + session.userid + "' ";
        sql += "AND sid = '" + session.sid + "' ";
        sql += "AND cookies = '" + session.cookies + "'";
        db.get(sql, function (err, row) {
            if ( row ) {
                returnFunc(true);
            } else {
                returnFunc(false);
            }
        });
    } else {}
};

DatabaseManager.getSessions = function (returnFunc) {
    var db = DatabaseManager.db;
    var sql = "SELECT s.rowid AS id, s.userid, s.userip, s.cookies, u.username FROM _sessions s JOIN _users u ON s.userid = u.rowid";
    db.all(sql, function(err, rows) {
        returnFunc(err, rows);
    });
};

DatabaseManager.getUserSession = function () {

};

DatabaseManager.getUserSessions = function (userid,returnFunc) {
    var db = DatabaseManager.db;
    var sql = "SELECT s.rowid AS id, s.userid, s.userip, s.cookies, u.username FROM _sessions s JOIN _users u ON s.userid = u.rowid WHERE s.userid = "+userid;
    db.all(sql, function(err, rows) {
        returnFunc(err, rows);
    });
};

DatabaseManager.addSession = function (req,userid) {
    var session = DatabaseManager.utils.formatSession(req,userid);
    if(session.sid && session.userid && session.userip && session.expires && session.cookies) {
        DatabaseManager.sessionExist (req,userid,function(exist){
            if (!exist) {
                Util.log("There is a new session to add to db.".bold.info);
                var db = DatabaseManager.db;
                var stmt = db.prepare("INSERT INTO _sessions VALUES (?,?,?,?,?)");
                stmt.run([session.userid, session.userip, session.sid, session.cookies, session.expires]);
                stmt.finalize();
            } else {
                Util.log("Session already exist.".bold.info);
            }
        });
    } else {}
};

DatabaseManager.deleteCurrentSession = function (req,userid,returnFunc) {
    var session = DatabaseManager.utils.formatSession(req,userid);
    if(session.sid && session.userip && session.expires && session.cookies) {
        var db = DatabaseManager.db;
        var sql = "DELETE FROM _sessions WHERE ";
        sql += "userip = '" + session.userip + "' ";
        if (userid!=null) sql += "AND userid = '" + session.userid + "' ";
        sql += "AND sid = '" + session.sid + "' ";
        sql += "AND cookies = '" + session.cookies + "'";
        db.run(sql, function (err) {
            if ( err ) {
                returnFunc(err);
            } else {
                returnFunc(err);
            }
        });
    } else {
        returnFunc("Session not find");
    }
};

DatabaseManager.deleteAllSessions = function () {
    var db = DatabaseManager.db;
    db.run("DELETE FROM _sessions");
};
DatabaseManager.clearAllSessions = function () {

};

/*******************************************
 * Utils NO SQL HERE
 *******************************************/

DatabaseManager.utils = function () {};
DatabaseManager.utils.formatSession = function (req,userid) {
    var session = {};
    session.sid = req.sessionID;
    session.userid = userid;
    session.userip = req.ip;
    session.expires = req.session.cookie._expires;
    session.cookies = req.cookies["connect.sid"];
    return session;
};

module.exports = DatabaseManager;