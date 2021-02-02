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
		connection.query("use todos;", function (err) {
			if (err) {
				console.log("DB seems Unavailable, Trying to create DB.");
				connection.query("CREATE DATABASE `todos`;", function (err) {
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
				connection.query("SELECT 1 FROM `todo` LIMIT 1;", function (err) {
					if (err) {
						console.log("table Unavailable, Trying to create Table.");
						connection.query("CREATE TABLE `todo` ( id_todo INT AUTO_INCREMENT PRIMARY KEY, todo_whose VARCHAR(128) , todo_title VARCHAR(255) , what_todo VARCHAR(20000) , addDate_todo TIMESTAMP);",function (err) {
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
	connection.execute('SELECT todo_title,what_todo,addDate_todo FROM `to_do` WHERE `todo_whose`=?;', [userid],function (err,res){
    ret = JSON.stringify(res);
    console.log("intheexefunc,ret:"+ret);
    console.log("res:"+JSON.stringify(res));
    return ret;
  });
  return ret;
}*/

app.get('/getlist', async function (req,res) {
  var personsname_who_reqested_list = req.query.name;
	console.log("who asked list: "+personsname_who_reqested_list);
// 	res.send(showlists());
//  res.send("You seems requested list.");
//   console.log("to_do: "+showlists("tester"));
  var ret = await "fuga";

  var self = res;

  await connection.execute('SELECT todo_title,what_todo,addDate_todo FROM `todo` WHERE `todo_whose`=?;', [personsname_who_reqested_list],
     function (err,res){
      var ret = JSON.stringify(res);
      console.log("res:"+JSON.stringify(res));
//       console.log("ret:"+ret);

      self.send(ret);

    });
//   await console.log("ret_final:"+ret);
//   await res.send("to_do: "+ret);
});

app.post('/post', function (req, res) {

	if(req.body.do != undefined) {
		console.log("seems be delete or close");
		if (req.body.do == delete_todo()) {
			//todo DELETE FROM todo WHERE condition;
		} else {
			connection.execute('UPDATE todo SET WHERE id_todo = ?')
		}
	} else {
		console.log("seems be post new todo");
		// リクエストボディを出力
		// console.log(JSON.stringify(req.body));

		var name_whose_posted = (req.body.name);
		var postedtodo = (req.body.data);
		var someones_todo_title = "this is a test value";
		console.log(name_whose_posted+" posted "+postedtodo+".");
		try {
			connection.execute('insert into todo (todo_title,what_todo,todo_whose)values(?,?,?)', [someones_todo_title, postedtodo, name_whose_posted]);
		} catch (e) {
			console.log(e);
		}
		res.send("You sent POST data.");
		res.end()
	}
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
