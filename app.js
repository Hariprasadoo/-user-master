require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');


const app = express();
const userRoutes = require('./routes/user');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});
app.use('/user',userRoutes); 
app.use((error, req, res, next)=>{
console.log(error)
const status = error.status || 500;
const message= error.message
req.status(status).json({message:message})
})


sequelize.sync()
  .then(result => {
    console.log(result);
    app.listen(3000);
  }).catch(err => {
    console.log(err);
  });
