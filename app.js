const express = require('express');
const app = express();
const userRoute = require('./routes/user');
const mongoose= require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost:27017/project',{useNewUrlParser: true})
.then(x => {
        console.log(
            `Connected to Mongo! Database name: "${x.connections[0].name}"`,
        );
})
    .catch(err => {
        console.error('Error connecting to mongo', err);
    });  

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use('/user', userRoute);

app.use((req,res,next)=>{
    res.status(404).json({
        error : 'this page not found '
    });
});

module.exports = app;

