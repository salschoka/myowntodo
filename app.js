var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const mysql = require('mysql2')

const connection = mysql.createConnection({
	//This is just my case, You must reconfigure when use This repo!
	host      :'192.168.10.20',
	user      :'node',
	password  :'secret'
})

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

connection.connect(function(err) {
	if (err) {
		console.error('error connecting: ' + err.stack);
		return;
	}
	console.log('SQL connected as id ' + connection.threadId);
	console.log("search DB: todos");
	connection.query("SHOW DATABASES LIKE `todo`;",function (err,res) {
		console.log("DB seems '"+res+"'");
		if (res===undefined) {
			console.log("seems not existing");
			console.log("We must create DB, I'll do it.");
			connection.query("CREATE DATABASE IF NOT EXISTS todos;",function (er,res) {
				console.log("create error is '"+er+"' , result is "+res);
			});
		} else {console.log("seems exists DB")
		}})
	console.log("trying to use DB.")
	connection.query("USE `todos`;",function(er,res) {
		if (er){
			console.log(er);
		}
		console.log("use res:"+res);
	})
	connection.query("SELECT 1 FROM `todo` LIMIT 1;", function (err, results) {
		console.log("table seems '"+results+"'");
		if (results === undefined) {
			console.log("create table: todo");
			connection.query("CREATE TABLE todo (id_todo INT , todo_title VARCHAR(255) , what_todo VARCHAR(20000) , addDate_todo TIMESTAMP);",function (err) {
				console.log("error:"+err);

			});
		}
	});
	// connection.end();
});

async function showlists(userid) {
	await connection.beginTransaction();
	try {
		const [rows, fields] = await connection.execute('SELECT * FROM `todo` WHERE `name` = ?', [userid]);
		return true;
	} catch (e) {
		console.log(e)
	} finally {
		// connection.end();
	}
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
