const Express = require('express');
const Route = Express.Router(); //Router instance is needed to run the routes in EXpress
const PostData = require('./DBmodel.js/DBschema'); // Importing Database model and schema
const DB_ref = require('../Routes/DBmodel.js/DBschema_for_ref');
const bcrypt = require('bcryptjs'); // Hashing the password before sending to DB and After receiving from DB. 
const Jwt = require('jsonwebtoken'); // JWT Autherization 
// const { json } = require('body-parser');

require("dotenv").config();

// Sending User name and password to client for testing purpose:
Route.get("/ADMIN", async (request, response) => {
    const Posting_data = new DB_ref({  // Create Object for MongoDB model.
        User__Name: request.body.UserName,
        Password__: hashed_Password
    });
    try {
        const saved = await Posting_data.save(); //Method in mongoose to send the data to MongoDB
        response.json("Good");
    }
    catch (err) {
        response.json("Some error");
    }
})

//check if the user name is valid;
Route.get('/:name/:Password', async (request, response) => {
    try {
        const Check = await PostData.findOne({ UserName: request.params.name }); // check if user is already available findOne is a moongoose method to find that query in databage in all collection.
        if (Check == "") {
            return response.status(400).json("User is not found");
        }
        else {
            try {
                const Verify_Password = await PostData.findOne({ UserName: request.params.name });
                /*In bcrypt compare 1st parameter is without hash, second is hashed with salt */
                if (await bcrypt.compare(request.params.Password, Verify_Password.Password)) //comparing Password from Database
                {
                    const user_token = Jwt.sign(request.params.name, process.env.SECRET_KEY); //sign to used to create token
                    return response.cookie("accesstoken",JSON.stringify(user_token)).send("Logged in Successfully");
                    // return response.json(user_token);
                    // return response.status(200).json("Logged in Successfully");
                }
                else {
                    return response.status(401).json("please check your password");
                }
            } catch (error) {
                return response.status(100).json("Server is busy");
            }
        }
    }
    catch (err) {
        return response.json(err);
    }
    // *******************************************************************************************************************

    // MongoDB is working slow, So storing values in server side, it's not safe but we don't have any other choices.

    // const Check = User_data.filter(User => User.UserName == request.params.name);
    // if (Check == "") {
    //     return response.status(400).json("User is not found"); // check if user is already available in server
    // }
    // else {
    //     const temp_var = Check.map(ret => ret.Password)
    //     if (await bcrypt.compare(request.params.Password, temp_var[0])) //comparing Password
    //     {
    //         const user_token = Jwt.sign(request.params.name, process.env.SECRET_KEY);
    //         console.log(user_token);
    //         return response.json({ accesstoken: user_token }).status(200).send("Logged in Successfully");
    //         // return response.cookie("token", user_token).status(200).json("Logged in Successfully");
    //         // return response.status(200).json("Logged in Successfully");
    //     }
    //     else {
    //         return response.status(401).json("please check your password");;
    //     }
    // }
});

// &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&


//create USER name and password
Route.post('/', async (request, response) => {

    const Posting_data_ref = new DB_ref({  // Create Object for MongoDB model.
        UserName: request.body.UserName,
        Password: request.body.Password
    });
    const saved = await Posting_data_ref.save(); //Method in mongoose to send the data to MongoDB

    // --------------------------------------------------------------------------------------------------------------------------

    const User_data = await PostData.findOne({ UserName: request.body.UserName });
    console.log(User_data);
    // if (User_data.some((User) => { return User.UserName === request.body.UserName })) {
    if (User_data !== null) {
        response.json("User name has already taken");
    }
    else {
        // (User_data.some((User)=> {console.log((User.UserName == request.body.UserName))}));
        const salt = await bcrypt.genSalt(); // Creating Salt
        const hashed_Password = await bcrypt.hash(request.body.Password, salt); // Creating Hashed password
        const Posting_data = new PostData({  // Create Object for MongoDB model.
            UserName: request.body.UserName,
            Password: hashed_Password,
            mail: request.body.email,
            Address: request.body.address
        });
        try {
            const saved = await Posting_data.save(); //Method in mongoose to send the data to MongoDB
            response.status(202).json("Account Created Successfully");
        }
        catch (error) {
            response.status(404).json("Server busy!");
        }

        // MongoDB is working slow, So storing values in server side, it's not safe but we don't have any other choices.
        // const data_test = ({
        //     UserName: request.body.UserName,
        //     Password: hashed_Password
        // })
        // User_data.push(data_test);
        // const user_check = User_data.filter(User => User.UserName == request.body.UserName)
        // if (user_check != null) {
        //     response.status(200).json("Account Created Successfully");
        //     // response.json(User_data)
        // }
        // else {
        //     response.status(404).json("Server busy!");
        // }
    }
});


// Change your password
// Route.patch('/', (request, response) => {
// })

// Route.delete('/', (data, response) => {
//     const del = Emoloyee.filter(Emp => { return Emp.name !== req.body.name });
//     res.send(del);
// })
Route.get('/test', Token_Verification, (req, res) => {
    res.json(req.UserName).status(200).send("token verification failed"); //Successfully able to authuorize..

})
function Token_Verification(req, res, next) {
    // const auth_Header = req.headers['authorization'];
    // const token_data = auth_Header && auth_Header.split(" ")[1];
    console.log(req.headers.cookie.split("accesstoken=")[1]);
    // console.log("2"+req.cookie);
    // console.log("3"+req.cookie['accesstoken']);
    // let temp = req.headers.cookie.split(';')[1];
    // res.clearCookie(temp);
    // console.log(token_data)
    let token_from_cookie = req.headers.cookie.split("accesstoken=")[1];
    Jwt.verify(token_from_cookie, process.env.SECRET_KEY, (err, user) => {
        if (err) return res.json("Token verification failed").status(204);
        req.UserName = user;
        next();
    })
}
module.exports = Route;