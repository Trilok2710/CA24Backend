const express = require('express')
const app = express()
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
var routes = require('./route/routes');
const cors = require('cors');

// app.use(cors(
//   {
//     origin: "http://localhost:4200"
//   }

// ));

app.use(cors);

app.listen(9992,function check(err)
{
    if(err)
    console.log("error")
    else
    console.log("started")
});

// mongoose.connect("mongodb://localhost:27017/aavhan2",{useNewUrlParser: true,  useUnifiedTopology: true },
// function checkDb(error)
// {
//     if(error)
//     {
//         console.log("Error Connecting to DB");
//     }
//     else
//     {
//         console.log("successfully Connected to DB");
//     }
// });

async function connectToMongoDB() {
    try {
      await mongoose.connect(`mongodb+srv://aavhan24:pGybTxgSEaNIGFdV@unify23.wxhmz31.mongodb.net/?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Connected to MongoDB');
  
      // Your database operations can go here
  
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }
  }
  connectToMongoDB();
app.use(express.json());
app.use(routes);