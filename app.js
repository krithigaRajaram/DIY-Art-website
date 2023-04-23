var express=require("express");
var bodyParser=require("body-parser");
var mongoose = require('mongoose');
var ejs=require('ejs');
mongoose.connect('mongodb://localhost:27017/diy');
var db=mongoose.connection;
db.on('error', console.log.bind(console, "connection error"));
db.once('open', function(callback){
    console.log("connection succeeded");
})  
var app=express()
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.set('view engine','ejs');
app.engine('html',require('ejs').renderFile)
app.set('views',"./views");
app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended:true
}))
var mail;
app.post("/signup",function(req,res){
    var name = req.body.name;
     mail = req.body.mail;
    var password = req.body.password;
    var contact = req.body.contact;
    var data = {
        "name": name,
        "mail" : mail,
        "password": password,
        "contact" : contact
    }
    console.log(mail);

    db.collection('customers').insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log("Record Inserted Successfully");
    });
    return res.redirect('home.html');
})
//contact us
app.get('/',(req,res)=>{
        
    res.render('home.html')
 })


app.post('/message',(req,res)=>{
 var name=req.body.name;
 var mail=req.body.mail;
 var message=req.body.message;

 var data={
    "name":name,
    "mail":mail,
    "message":message
 }
 db.collection('customers').findOne({mail:mail,code:1}).then(customers=>{
     if(customers!=null){
           db.collection('contacts').insertOne(data,(err,collection)=>{
           if(err)
       console.log(err)
     
          else
          res.redirect('home.html')
         })
}

 else{
    res.redirect('login.html')
 }

})

})


var mail;
 var password;
 const loginsSchema= new mongoose.Schema({
    mail:String,
    password:String,
    code:Number
})
const Login=mongoose.model('Login',loginsSchema);

app.post("/login", function(req, res) {
    mail=req.body.mail;
     password=req.body.password;
     checkpass(req,res,mail,password)
})
app.get('/login',checkpass);
function checkpass(req,res){
    Login.find({mail:mail}).then(customers=>{
        if(customers!=null){
            console.log("Done Login");
           
            db.collection('customers').updateOne({mail:mail},{$set:{code:1}},(err,collection)=>{
                if(err){
                    throw err;
                }
                console.log("Record Inserted Successfully");
            })
                res.redirect('home.html')
				
			}      
        else{
			console.log("failed");
            res.redirect('login.html')
		}  
        })
    }
    app.get('/',(req,res)=>{
        res.render('home');
    })
    
    const customersSchema={
        name:String,
        mail:String,
        password:String,
     
        contact:String,
        code:Number
        
    }
    const Customer= mongoose.model('Customer',customersSchema);
    
    app.get('/',(req,res)=>{
        res.render('home.html');
    })
    app.get("/profile",(req,res)=>{
        Customer.find({mail:mail,code:1}).then(customers=>{
            if(customers!=null){
            
           res.render('profile',{
            customersList:customers,
           
           })
        }
    
        })
    })
    
    app.get('/',(req,res)=>{
        res.render('home');
    })


    
    
    app.get('/update',(req,res)=>{
        Customer.find({mail:mail}).then(customers=>{
            if(customers!=null){
           res.render('update',{
            customersList:customers,
           
           })
    
        }
    })
    })
     app.post("/update_pro",(req,res)=>{
    
            
            var newpass = req.body.new_pass;
            var password=req.body.confirm_pass;
         
            var number = req.body.number;
           
            if(newpass == password){
              
            db.collection('customers').updateOne({mail:mail},{$set:{password:password,contact:number}},(err,collection)=>{
                if(err){
                    throw err;
                }
                console.log("Record updated Successfully");
            });
        
             res.redirect('profile')
        }
        })


        //logout


        app.get('/logout',logopage)
        function logopage(req,res){
    
        
            db.collection('customers').updateOne({mail:mail},{$set:{code:0}},(err,logins)=>{
                     console.log('hello')
               
        
            })
            res.redirect('home.html');
        }
        
app.get('/',function(req,res){
    res.set({
        'Access-control-Allow-Origin': '*'
        });
    return res.redirect('home.html');
    }).listen(7005)
    console.log("server listening!");

