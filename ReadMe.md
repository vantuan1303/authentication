#MongoDB:
Info: /database/database.js

Source NoSQL: mongo-database

mongod --dbpath /Volumes/Data/Learning/LearnWeb/authentication/myweb/mongo-database  --port 27018 --auth


#All router:

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
