const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://'+ process.env.DB_USER_PASS +'@cluster0.p4op1.mongodb.net/mern-project')
        .then(() => console.log('Connected to MongoDb!'))
        .catch((error) => console.log('Failed to connect to MongoDb', error));