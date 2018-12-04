Node JS Authentication
##Run with Docker
First: Download and install Docker
Second: Go to myweb/database/database.js
Change: url = 'mongodb://tuan:12345678@mongo:27017/db'
Third: go to Folder: Authentication and run: ./build.sh

##Run normally by NodeJS
#First: Run command:
+ cd myweb
+ yarn

#Second: Create a new database with mongo:
+ mkdir data 
(if non-exits)
+ mongod --dbpath ./data --port 27017
Conect from client: 
+ mongo --port 27017
+ use db
+ db.createUser({user:"tuan", pwd:"12345678", roles: ["readWrite", "dbAdmin", "dbOwner"]});

#Restart server: 
+ mongod --dbpath /Users/admin/mongodb/ --port 27017 --auth

#Conect againt from client:
+ mongo --port 27017 -u "tuan" -p "12345678" --authenticationDatabase "db"

##All router:

#User router:

Register user: POST http://localhost:3000/users/registerUser

Active user: GET http://localhost:3000/users/activateUser

Login user: POST http://localhost:3000/users/loginUser

Admin delete/block user: POST http://localhost:3000/users/admin/blockOrDeleteUsers

#BlogPost router

Insert BlogPost: POST http://localhost:3000/blogposts/insertBlogPost

Show BlogPost: GET http://localhost:3000/blogposts/queryBlogPosts

Show BlogPost by Date: GET http://localhost:3000/blogposts/queryBlogPostsByDateRange

Get detail BlogPost: GET http://localhost:3000/blogposts/getDetailBlogPost

Update BlogPost: PUT http://localhost:3000/blogposts/updateBlogPost

Delete BlogPost: DELETE http://localhost:3000/blogposts/deleteBlogPost


How to use git
Remove cached: git rm -r --cached .
Add all: git add .
