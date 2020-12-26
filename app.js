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
app.disable('x-powered-by');

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
app.disable('x-powered-by');

DBinit();

function DBinit () {
	connection.connect(function (err) {
		if (err) {
			console.error('error connecting: ' + err.stack);
			return;
		}
//		console.log('SQL connected as id ' + connection.threadId);
		console.log('SQL connected.');
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

/*function showlists(userid) {
  var ret = "pien";
	connection.execute('SELECT todo_title,what_todo,addDate_todo FROM `todo` WHERE `todo_whose`=?;', [userid],function (err,res){
    ret = JSON.stringify(res);
    console.log("intheexefunc,ret:"+ret);
    console.log("res:"+JSON.stringify(res));
    return ret;
  });
  return ret;
}*/

app.get('/getlist', async function (req,res) {
  var man = req.query.name;
	console.log("who asked list: "+man);
// 	res.send(showlists());
//  res.send("You seems requested list.");
//   console.log("todo: "+showlists("tester"));
  var ret = await "fuga";

  var self = res;

  await connection.execute('SELECT todo_title,what_todo,addDate_todo FROM `todo` WHERE `todo_whose`=?;', [man],
     function (err,res){
      var ret = JSON.stringify(res);
      console.log("res:"+JSON.stringify(res));
//       console.log("ret:"+ret);

      self.send(ret);

    });
//   await console.log("ret_final:"+ret);
//   await res.send("todo: "+ret);
});

app.post('/post', function (req, res) {
    // リクエストボディを出力
    console.log(JSON.stringify(req.body));
    res.send("You sent POST data.");
    res.end()
})

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
