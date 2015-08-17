## User Story
1. On the index page the user can see all of the topics listed by popularity.
2. If the user clicks the Add Post button it will render a page where the post can be written.
3. After they submit the post it is automatically saved to the database and they will be redirected to the index page.
4. There will be a navigation tab that will lead to a page that will be listed the posts that have the highest votes or comments.
5. When a user clicks on a post it will render a page with the post and its comments.
6. The posts will be ordered from newest to oldest.
7. At the bottom of the page a user can add a comment to that post.
8. The user can also upvote or downvote a post.
9. A user can search by author or title.

##Wireframes
1. In public folder

## Features
1. Add Post button that submits form to database
2. Add Comment button that attaches a comment to a post
3. Create a username with an avatar
4. See each post with their comments
5. Search by author or title
6. See posts by popularity or number of comments

## Tasks
Day 1
  1. Pseudo code the project
  2. Set up the database

Day 2
 Aim:
  1. Create HTML for Add Post page
  2. List posts on the index page by number of comments
  3. Create HTML for showing the post
  4. Render the post and all of the comments
  5. Add a login page
 Time Expected:
  1. HTML 30 mins
  2. List 1 hour
  3. HTML for showing 30 mins
  4. Render 1 hour
  5. login 1 hour
  Success:
  1. Finished all the tasks
  2. Was able to add posts
  Failures:
  1. Login took longer to do

Day 3
  Aim:
  1. Can add comments
  2. Save votes and comments to the database
  3. Search by popularity
  4. Can like or dislike a posts
  Time Expected:
  1. add comments 1 hour
  2. popularity 1 hour
  3. like or dislike 1 hour and a half
  Success:
  1. Finished all of the basic MVP
  2. Likes and dislikes took more time than expected
  3. Had to change the database and add  votes and comments rows
  Failures:
  1. Had trouble joining the tables
  2. Was forced to refactor database many times to properly have access to the data
  3. Did not properly think out how to order the votes and comments


  Day 4
  Aim:
  1. Add geolocation
  2. Style the webpage
  Time Expected
  1. geolocation 2 hours
  2. Styling all day
  Success
  1. Added geolocation very fast
  2. Was not able to style a lot of the page and will have to push to day 5 and 6
  Failures:
  1. Had a lot of trouble with the grid system
  2. Spent all day styling, but the page was not much improved.

  Day 5 and 6
  Aim:
  1. Style with CSS
  Time Expected
  1. All day
  Success:
  1. Finished styling
  Failures:
  1. The page was not as styled as I would like.



## Pseudo
On index page:

Welcoming button- redirects to ('/posts');
app.post('/posts/users', function(req, res){
  take in username, password, and avatar and persist to people table
});

app.get('/posts', function(req, res){
   take information from posts table and render out posts using ejs  
});

app.get('/posts/new', function(req, res){
   redirect to the add post page  
});

app.get('/posts/search', function(req, res){
  compares the input to the posts database and render the results
});

app.post('/posts', function(req, res){
  compare the username and password to the people database.
  if correct:
  take the input and persist the data to the posts table
});

app.get('/posts/:id', function(req, res){
  render a page with the post information and its comments
});

app.post('/posts/:id', function(req, res){
  take the input of the comment and persist it to the comments table;
  connect the comment with the post
});



## Routes
1. To render the index page - ('/')
2. To add a post - ('/posts')
3. To go to a post's page - ('/posts/:id')
4. To go to a page ordered by like ('/posts/likes')
5. To go to a page ordered by comments ('/posts/comments')
6. To add a post to a comment ('/posts/:id/comments')
