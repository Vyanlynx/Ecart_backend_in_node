const Express = require('express');
const Route = Express.Router(); //Router instance is needed to run the routes in EXpress
// const PostData = require('./DBmodel.js/DBschema'); // Importing Database model and schema
const bcrypt = require('bcryptjs'); // Hashing the password before sending to DB and After receiving from DB. 
const Jwt = require('jsonwebtoken') // JWT Autherization 
require("dotenv").config();

const User_data = [{
    UserName: "ADMIN",
    Password: "DELL_Vostro_1123"
}]
//check if the user name is valid;
Route.get('/:name/:Password', async (request, response) => {
    //     const Check = await PostData.findOne({UserName:request.params.name});
    //     if(Check == ""){
    //          return response.status(400).json("User is not found"); // check if user is already available
    //     }
    //     else{
    //         try{
    //         const Verify_Password = await PostData.findOne({UserName:request.params.name});
    //         if(await bcrypt.compare(request.params.Password, Verify_Password.Password)) //comparing Password from Database
    //         {
    //             // const user_token = Jwt.sign(request.params.name,process.env.SECRET_KEY)
    //             // return response.json(user_token);
    //             // return response.status(200).json("Logged in Successfully");
    //         } 
    //         else{
    //             return response.status(401).json("please check your password");
    //         }}catch(error){
    //             return response.status(100).json("Server is too busy");
    //         }
    //     }

    // MongoDB is working slow, So storing values in server side, it's not safe but we don't have any other choices.
    const Check = User_data.filter(User => User.UserName == request.params.name);
    if (Check == "") {
        return response.status(400).json("User is not found"); // check if user is already available in server
    }
    else {
        const temp_var = Check.map(ret => ret.Password)
        if (await bcrypt.compare(request.params.Password, temp_var[0])) //comparing Password
        {
            const user_token = Jwt.sign(request.params.name, process.env.SECRET_KEY);
            console.log(user_token);
            return response.json({ accesstoken: user_token }).status(200);
            // return response.cookie("token", user_token).status(200).json("Logged in Successfully");
            // return response.status(200).json("Logged in Successfully");
        }
        else {
            return response.status(401).json("please check your password").send("Hi");
        }
    }
});

//create USER name and password
Route.post('/', async (request, response) => {
    if (User_data.some((User) => { return User.UserName == request.body.UserName })) {
        response.json("User name has already taken");
    }
    else {
        // (User_data.some((User)=> {console.log((User.UserName == request.body.UserName))}));
        const salt = await bcrypt.genSalt(); // Creating Salt
        const hashed_Password = await bcrypt.hash(request.body.Password, salt); // Creating Hashed password
        // const Posting_data = new PostData({  // Create Object for MongoDB model.
        //     UserName:request.body.UserName,
        //     Password:hashed_Password
        // });
        // try{
        // const saved = await Posting_data.save(); //Method in mongoose to send the data to MongoDB
        // response.status(202).json("Account Created Successfully");
        // }
        // catch(error){
        //     response.status(404).json("Server busy!");
        // }

        // MongoDB is working slow, So storing values in server side, it's not safe but we don't have any other choices.
        const data_test = ({
            UserName: request.body.UserName,
            Password: hashed_Password
        })
        User_data.push(data_test);
        const user_check = User_data.filter(User => User.UserName == request.body.UserName)
        if (user_check != null) {
            // response.status(200).json("Account Created Successfully");
            response.json(User_data)
        }
        else {
            response.status(404).json("Server busy!");
        }
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
    res.json(req.UserName); //Successfully able to authuorize..

})
function Token_Verification(req, res, next) {
    const auth_Header = req.headers['authorization'];
    // const token_data = auth_Header && auth_Header.split(" ")[1];
    console.log(auth_Header)
    // console.log(token_data)
    Jwt.verify(auth_Header, process.env.SECRET_KEY, (err, user) => {
        if (err) return res.json("Token verification failed")
        req.UserName = user;
        next();
    })

}
module.exports = Route;