const express = require('express');
const mongoose = require('mongoose');

const User = require('./user');
const uri = process.env.MONGODB_URI;
require('dotenv').config();
const port = process.env.PORT || 4000; 

//express app
const app = express();

//connect to mongodb
const connectionString = 'mongodb://localhost:27017/userapp';



//Connect to mongodb
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true, 
  useFindAndModify: false
}, (err)=> {
  if (err) {
    console.log(err)
  } else {
    console.log('database connection successful')
  }
})




//Using Our Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }));


//POST ROUTE
//POST request to /users to create a new user
app.post('/users', (req,res)=> {
  //Retrieve new book from req.body
  User.create({
    name: req.body.name,
    email: req.body.email,
    country: req.body.country
  },(err, newUser) => {
     if(err) {
       return res.status(500).json({message: err})
     } else {
       return res.status(200).json({message: "New user created", newUser})
     }
  })

}) 





app.get('/users', (req, res)=> {
  //Fetching all users
  User.find({}, (err, users) => {
    if(err) {
      return res.status(500).json({ message: err })
    } else {
      return res.status(200).json({message: users})
    }
  })
})
//GET request to fetch a single user
app.get('/users/:id', (req, res) => {
  User.findById(req.params.id, (err, user)=> {
    if (err) {
      return res.status(500).json({ message: err})
    }
     else if (!user) {
       return res.status(404).json({ message: "user not found"})
     } 
     else {
      return res.status(200).json({ user })
    }
  })
})

//PUT request to /users/id to update a single user
app.put('/users/:id', (req, res)=> {
  User.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    email:req.body.email,
    country: req.body.country
  }, (err, user) => {
     if (err) {
      return res.status(500).json({message: err})
    } else  if (!user) {
     return res.status(404).json({message: "book not found"})
    } else {
      user.save((err, savedUser)=> {
        if (err) {
          return res.status(400).json({message: err})
        } else {
          return res.status(200).json({message: "user updated successfully" })
        }
      })
    }
  })
})

//DELETE request to /users/:id to delete
app.delete('/users/:id', (req, res)=> {
  User.findByIdAndDelete(req.params.id, (err, user) =>{
    if(err) {
      return res.status(500).json({message: err})
    } else if (!user) {
      return res.status(404).json({message: "user not found"})
    }
    else {
      return res.status(200).json({message: "user deleted successfully"})
    }
  })
})





app.listen(port, ()=> console.log(`app is listening on ${port}`));
