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
app.use(cors({
    origin: '*'
}));

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.use(cookieParser());
app.use(bodyParser.json());
app.use('/login', route);
app.use('/test', "Success");
// app.set('trust proxy', true); //To take the IP address
app.use('/details', Details);

Mongoose.connect(process.env.MONGO_PROD_URI, () => console.log("second connected"))

app.listen(port, (req, res) => { console.log("Server is running") });
