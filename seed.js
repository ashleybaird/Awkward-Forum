var fs = require('fs');
var ejs = require('ejs');
var express = require('express');
var app = express();
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('forum.db');
app.use(express.static('public'));
var request = require('request');


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
	db.all("SELECT  * FROM people INNER JOIN posts ON people.id = posts.people_id ORDER BY id DESC", function(error, rows){
	    var html = fs.readFileSync('./views/posts.html', 'utf8');
	    var render = ejs.render(html, {rows: rows});
		res.send(render);
       
	});
});

app.get('/posts/likes', function(req, res){
	db.all("SELECT  * FROM people INNER JOIN posts ON people.id = posts.people_id ORDER BY votes DESC", function(error, rows){
	    var html = fs.readFileSync('./views/votes.html', 'utf8');
	    var render = ejs.render(html, {rows: rows});
		res.send(render);
       
	});
});

app.get('/posts/comments', function(req, res){
	db.all("SELECT  * FROM people INNER JOIN posts ON people.id = posts.people_id ORDER BY comments DESC", function(error, rows){
	    var html = fs.readFileSync('./views/popular.html', 'utf8');
	    var render = ejs.render(html, {rows: rows});
		res.send(render);
       
	});
});

app.put('/posts/user', function(req, res){
	db.get("SELECT*FROM people", function(error, rows){
		if (error) {
			console.log(error);
		} else if(rows.username == req.body.username && rows.password == req.body.password) {
			res.redirect('/posts');
		} else if (rows.username !== req.body.username || rows.password !== req.body.password) {
			db.run("INSERT INTO people (username, password, image) VALUES (?, ?, ?)", req.body.username, req.body.password, req.body.image, function(error, rows){
            res.redirect('/posts');
          });
		}
	});
});
app.get('/posts/new', function(req, res) {
	var html = fs.readFileSync('./views/add.html', 'utf8');
	res.send(html);
});


app.post('/posts', function(req, res){
	var requestedUrl = "http://ipinfo.io/geo";

	request.get(requestedUrl, function(error, response, body){
      
	    db.all("SELECT*FROM people", function(error, rows){
	    	if (error) {
	    		console.log(error);
	    	} else  {
	    		var votes = 0;
	    		var comments = 0;
	    		var parsed = JSON.parse(body);
	    		rows.forEach(function(e){
		            if (req.body.username === e.username && req.body.password === e.password) {
		            	

		    		db.run("INSERT INTO posts(subject, entry, votes, comments, city, country, people_id) VALUES (?, ?, ?, ?, ?, ?, ?)", req.body.subject, req.body.post, votes, comments, parsed.city, parsed.country, e.id, function(error, rows){
		                res.redirect('/posts');
		    			});
		    		}
		    			
		    	})	
	        } 
	    });
	});
});

app.post('/posts/search', function(req, res){

	if(req.body.author.length > 0) {
	    db.all("SELECT*, posts.id AS posts_id FROM posts INNER JOIN people WHERE people.id = posts.people_id AND username=?", req.body.author, function(error, rows){
	    	var html = fs.readFileSync('./views/search.html', 'utf8');
	    	var render = ejs.render(html, {rows: rows});
	    	res.send(render);
	    });
	} else if (req.body.subject.length > 0) {
		  db.all("SELECT*, posts.id AS posts_id FROM posts INNER JOIN people WHERE people.id = posts.people_id AND subject=?", req.body.subject, function(error, rows){
	    	var html = fs.readFileSync('./views/search.html', 'utf8');
	    	var render = ejs.render(html, {rows: rows});
	    	res.send(render);
	    });
		
	} else if (req.body.subject.length > 0 && req.body.author.length > 0) {
		 db.all("SELECT*, posts.id AS posts_id FROM posts INNER JOIN people WHERE people.id = posts.people_id AND subject=? AND username=?", req.body.subject, req.body.username, function(error, rows){
	    	var html = fs.readFileSync('./views/search.html', 'utf8');
	    	var render = ejs.render(html, {rows: rows});
	    	res.send(render);
	    });
	}
});



app.get('/posts/:id', function(req, res){
   var html = fs.readFileSync('./views/show.html', 'utf8');
   db.all("SELECT *, posts.id AS posts_id FROM people INNER JOIN posts WHERE people.id = posts.people_id AND posts.id=?", req.params.id, function(error, rows){
   	if(error) {
   		console.log(error);
   	} else  {
   		var post = rows;
   				
   		
   		db.all("SELECT*FROM people INNER JOIN comments WHERE people.id = comments.people_id AND comments.posts_id=?", req.params.id, function(error, rows){
   			if(error) {
   				console.log(error);
   			} else {
   		
		   		var render = ejs.render(html, {post: post, rows: rows});
   				
   			}
		   		res.send(render);
   		});
   	}
   });

});

app.put('/posts/:id', function(req, res){
	db.get("SELECT * FROM posts WHERE id=?", req.params.id, function(error, rows){
 		if(error) {
 			console.log(error);
 		} else {
 			var votes = rows.votes;
 			if(req.body.vote == 1) {
 				votes++;
 				db.run("UPDATE posts SET votes=? WHERE id=?", votes, req.params.id, function(error){

 				});
 				res.redirect('/posts');
 			} else {
 				votes--;
 				db.run("UPDATE posts SET votes=? WHERE id=?", votes, req.params.id, function(error){

 				});
 				res.redirect('/posts');
 			}
          

 		}
	});
		
	
    
});

app.post('/posts/:id/comments', function(req, res){
	var requestedUrl = "http://ipinfo.io/geo";

	request.get(requestedUrl, function(error, response, body){
	    db.get("SELECT *, posts.id AS posts_id FROM people INNER JOIN posts WHERE people.id = posts.people_id AND posts.id=?", req.params.id, function(error, rows){
	    
	    	if (error) {
	    		console.log(error);
	    	} else {
	    		var comments = rows.comments;
	    		comments++;
	    		var parsed = JSON.parse(body);
	    		db.run("INSERT INTO comments (message, city, country, posts_id, people_id) VALUES (?, ?, ?, ?, ?)", req.body.message, parsed.city, parsed.country, req.params.id, rows.id, function(error){
	    				if (error) {
	    					console.log(error);
	    				} else {
	    					db.run("UPDATE posts SET comments=? WHERE id=?", comments, req.params.id, function(error){
	                            res.redirect('/posts');
	    					});
	    				}
	    		});
	    	}
	    });
	})
	
});