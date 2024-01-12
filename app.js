var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser= require('body-parser');
const mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

mongoose.connect("mongodb://127.0.0.1:27017/api");

const apiSchema = {
    name: String,
    desc: String
};

const apiArticle = mongoose.model("item", apiSchema);

// const apiat = mongoose.model("item");

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', indexRouter);
//app.use('/users', usersRouter);

app.get('/home',(req,res)=>{
    apiArticle.find({}).then(data =>{
        res.send(data);
    }).catch(err=>{
        res.send(err);
    });
});
app.post('/home', (req,res)=>{
    const title = req.body.title;
    const desc = req.body.description;
     const item = new apiArticle({
        name: title,
        desc: desc
     });
     item.save().then(data =>{
        res.send("inserted");
     }).catch(err =>{
        res.send(err);
     });
});
app.delete('/home', (req,res)=>{
    apiArticle.deleteMany().then( data=>{
        res.send("deleted");
    }).catch(err =>{
        res.send(err);
    });
});

app.get('/home/:name',(req,res)=>{
    const atName = req.params.name;
    apiArticle.findOne({name: atName}).then( data=>{
        res.send(data);
    }).catch(err =>{
        res.send(err);
    });
});
app.delete('/home/:name', (req,res)=>{
    const atName =req.params.name;
    apiArticle.deleteOne({name:atName}).then( data =>{
        res.send("Deleted");
    }).catch(err =>{
        res.send(err);
    });
});
app.put('/home/:name',(req,res)=>{
    const atName = req.params.name;
    apiArticle.updateOne({name: atName},
        {name: req.body.name,
         desc: req.body.desc}, {overwrite: true}).then( data=>{
            res.send("updated");
         }).catch(err =>{
            res.send(err);
         });
});

app.patch('/home/:name', (req,res)=>{
    const atName = req.params.name;
    apiArticle.updateOne({name:atName},
        {$set: {desc: req.body.desc}}).then( data=>{
            res.send("Successfull");
        }).catch(err =>{
            res.send(err);
        });
});



module.exports = app;
