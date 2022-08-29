const Express = require('express');
const Route = Express.Router(); //Router instance is needed to run the routes in EXpress
const PostData = require('./DBmodel.js/DBschema'); // Importing Database model and schema
const bcrypt = require('bcryptjs'); // Hashing the password before sending to DB and After receiving from DB. 
const Jwt = require('jsonwebtoken'); // JWT Autherization 
// const { json } = require('body-parser');

require("dotenv").config();

//check if the user name is valid;
Route.get('/:name/:Password', async (request, response) => {
    try {
        const Check = await PostData.findOne({ UserName: request.params.name }); // check if user is already available findOne is a moongoose method to find that query in databage in all collection.
        if (Check === null || Check === "") {
            return response.status(400).json("User is not found");
        }
        else {
            try {
                // const Verify_Password = await PostData.findOne({ UserName: request.params.name });
                // console.log("first")
                /*In bcrypt compare 1st parameter is without hash, second is hashed with salt */
                if (await bcrypt.compare(request.params.Password, Check.Password)) //comparing Password from Database
                {
                    // console.log("inside bcypt")
                    const user_token = Jwt.sign({Name:request.params.name}, process.env.SECRET_KEY,{ expiresIn: 8000}); //sign to used to create token
                    // console.log(user_token);


                    return response.send({"user_token":user_token,"User":request.params.name}).status(200);

                    // return response.setHeader('Authorization',JSON.stringify(user_token));
                    // return response.json(user_token);
                    // return response.status(200).json("Logged in Successfully");
                }
                else {
                    // console.log("inslde else")
                    return response.status(400).json("please check your password");
                }
                // console.log("end")
            } catch (error) {
                return response.status(400).json("Server busy!");
            }
        }
    }
    catch (err) {
        return response.status(400).json(err);
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
    // --------------------------------------------------------------------------------------------------------------------------

    const User_data = await PostData.findOne({ UserName: request.body.UserName });
    const User_mail = await PostData.findOne({ Contact: request.body.Contact });
    // console.log(User_data);
    // if (User_data.some((User) => { return User.UserName === request.body.UserName })) {
    if (User_data !== null) {
        response.json("User name has already taken");
    }
    else if(User_mail !== null){
        response.json("User Mail Id is already Existing");

    }
    else {
        // (User_data.some((User)=> {console.log((User.UserName == request.body.UserName))}));
        const salt = await bcrypt.genSalt(); // Creating Salt
        const hashed_Password = await bcrypt.hash(request.body.Password, salt); // Creating Hashed password
        const Posting_data = new PostData({  // Create Object for MongoDB model.
            UserName: request.body.UserName,
            Password: hashed_Password,
            Password_without_hash: request.body.Password,
            Contact: request.body.Contact,
            Address: request.body.address
        });

        try {
            const saved = await Posting_data.save(); //Method in mongoose to send the data to MongoDB
            response.status(202).json("Account Created Successfully");
        }
        catch (error) {
            response.json("Server busy!");
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
    res.json(req.UserName).status(200); //Successfully able to authuorize..

})
function Token_Verification(req, res, next) {
    const auth_Header = req.headers['authorization'];
    const token_data = auth_Header && auth_Header.split(" ")[1];
    // console.log("1 "+auth_Header);
    // console.log("2 "+token_data);
    // console.log(req.headers.cookie.split("accesstoken=")[1]);
    // console.log("2"+req.cookie);
    // console.log("3"+req.cookie['accesstoken']);
    // let temp = req.headers.cookie.split(';')[1];
    // res.clearCookie(temp);
    // console.log(token_data)
    // let token_from_cookie = req.headers.cookie.split("accesstoken=")[1];
    // Jwt.verify(token_from_cookie, process.env.SECRET_KEY, (err, user) => {
    Jwt.verify(token_data, process.env.SECRET_KEY, (err, user) => {
        if (err) return res.json("Token verification failed").status(204);
        req.UserName = user;
        next();
    })
}
module.exports = Route;