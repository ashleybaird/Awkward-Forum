var fs = require('fs');
var ejs = require('ejs');
var express = require('express');
var app = express();
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('forum.db');


var bodyParser = require('body-parser');
var urlencodedBodyParser = bodyParser.urlencoded({extended: false});
app.use(urlencodedBodyParser);
var methodOverride = require('method-override');
app.use(methodOverride('_method'));

app.listen(3000, function(req, res){
	console.log('listening');
});



app.get('/', function(req, res){
	var html = fs.readFileSync('./views/index.html', 'utf8');
    res.send(html);
});

app.get('/posts', function(req, res){
	db.all("SELECT  * FROM people INNER JOIN posts ON people.id = posts.people_id", function(error, rows){
	    var html = fs.readFileSync('./views/posts.html', 'utf8');
	    var render = ejs.render(html, {rows: rows});
		res.send(render);
       
	});
});

app.put('/posts/user', function(req, res){
	db.get("SELECT*FROM people", function(error, rows){
		if (error) {
			console.log(error);
		} else if(rows.username === req.body.username && rows.password === req.body.password) {
			res.redirect('/posts');
		} else if (rows.username !== req.body.username) {
			db.run("INSERT INTO people (username, password, image) VALUES (?, ?, ?)", req.body.username, req.body.password, req.body.image, function(error, rows){
            var html = fs.readFileSync('./views/posts.html', 'utf8');
			res.send(html);
          });
		}
	});
});
app.get('/posts/new', function(req, res) {
	var html = fs.readFileSync('./views/add.html', 'utf8');
	res.send(html);
});


app.post('/posts', function(req, res){
    db.get("SELECT*FROM people", function(error, rows){
    	if (error) {
    		console.log(error);
    	} else if (req.body.username === rows.username && req.body.password === rows.password) {
    		var votes = 0;

    		db.run("INSERT INTO posts(subject, entry, votes, people_id) VALUES (?, ?, ?, ?)", req.body.subject, req.body.post, votes, rows.id, function(error, rows){
                res.redirect('/posts');
    		});
    	} else if (req.body.username !== rows.username || req.body.password !== rows.password) {
            $('wrong').toggle();
     }
    })
});

app.get('/posts/:id', function(req, res){
   var html = fs.readFileSync('./views/show.html', 'utf8');
   db.get("SELECT*FROM posts INNER JOIN people WHERE people.id = posts.people_id", function(error, rows){
   	if(error) {
   		console.log(error);
   	} else if (rows.id == req.params.id) {
   		var post = rows;
   		
   		db.all("SELECT*FROM people INNER JOIN comments WHERE people.id = comments.people_id", function(error, rows){
   			if(error) {
   				console.log(error);
   			} else {
		   		var render = ejs.render(html, post {rows: rows});
   				
   			}
		   		res.send(render);
   		});
   	}
   });

});

app.post('/posts/:id/comments', function(req, res){
    			
    db.get("SELECT*FROM people WHERE username=? AND password=?", req.body.username, req.body.password, function(error, rows){
    	console.log(rows);
    	if (error) {
    		console.log(error);
    	} else {
    		db.run("INSERT INTO comments (message, posts_id, people_id) VALUES (?, ?, ?)", req.body.message, req.params.id, rows.id, function(error){
    				res.redirect('/posts');
    		});
    	}
    });
	
});