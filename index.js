const Express = require('express');
const app = Express();
const port = process.env.PORT || 8080;
const route = require('./Routes/Route.js')
// const Mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Details = require("./Details.js/SystemDetails");

app.use(bodyParser.json());
app.use('/login',route);
app.set('trust proxy', true); //To take the IP address
app.use('/details',Details);

// Mongoose.connect('mongodb+srv://test_user:KL123@cluster0.hrnxcoa.mongodb.net/?retryWrites=true&w=majority',()=> console.log("Connected to DB"));

app.listen(port,(req, res)=>{console.log("Server is running")})