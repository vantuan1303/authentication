db = db.getSiblingDB('db');
db.createUser({
    user: "tuan" , 
    pwd: "12345678", 
    roles: [  
        { role:"readWrite", db: "db" }
    ]
});