const Express = require('express');
const app = Express();
const port = process.env.PORT || 8080;
const cors = require('cors');
const route = require('./Routes/Route.js');
const bodyParser = require('body-parser');
const Details = require("./Details.js/SystemDetails");
const Mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require("dotenv").config();
// To Resolve the CORS error, Use like this. Use * to ignore all.
app.use(cors());
// app.use(cors({
//     origin: '*'
// }));

app.use(cookieParser());
app.use(bodyParser.json());
app.use('/login', route);
app.use('/details', Details);
app.use("/testing", (req, res) => {
    res.json("Connected Succesfully")
})
// Mongoose.connect('mongodb+srv://test_user:KL123@cluster0.hrnxcoa.mongodb.net/?retryWrites=true&w=majority',()=> console.log("Connected to DB")).catch(err=>console.log(err))
Mongoose.connect("mongodb+srv://test_user:KL123@cluster0.hrnxcoa.mongodb.net/?retryWrites=true&w=majority", () => console.log("second connected"))

app.listen(port, (req, res) => { console.log("Server is running") });