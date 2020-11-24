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

DBinit();

function DBinit () {
	connection.connect(function (err) {
		if (err) {
			console.error('error connecting: ' + err.stack);
			return;
		}
		console.log('SQL connected as id ' + connection.threadId);
		console.log("search DB: todos");
		connection.query("use todos;", function (err, res) {
			if (err) {
				console.log("DB seems Unavailable, Trying to create DB.");
				connection.query("CREATE DATABASE `todos`;", function (err, res) {
					if (err) {
						console.log("DB create errored. error:" + err);
					} else {
						// console.log(res);
						console.log("DB create done");
						DBinit();
					}
				})
			} else {
				// console.log(res);
				console.log("DB Available.");
				connection.query("SELECT 1 FROM `todo` LIMIT 1;", function (err, res) {
					if (err) {
						console.log("table Unavailable, Trying to create Table.");
						connection.query("CREATE TABLE `todo` ( id_todo INT AUTO_INCREMENT PRIMARY KEY, todo_whose VARCHAR(128) , todo_title VARCHAR(255) , what_todo VARCHAR(20000) , addDate_todo TIMESTAMP);",function (err,res) {
							if (err) {
								console.log("Table create errored. error:" + err);
							} else {
								// console.log(res);
								console.log("Table create done.")
								DBinit();
							}
						});
					} else {
						// console.log(res);
						console.log("table Available.");
					}
				});
			}
		});
	});
}

function showlists(userid) {
	connection.execute('SELECT * FROM `todo` WHERE `todo_whose`=?;', [userid],function (err,res){
		console.log(res);
		return res;
	});
}

app.get('/list', (req,res) => {
	console.log("req.query.value="+req.query.value);
	res.send("your list: "+showlists(req.query.value));
});

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
