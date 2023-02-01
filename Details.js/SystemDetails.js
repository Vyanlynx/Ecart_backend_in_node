const express = require('express');
const route = express();
// const Post_details_json = require('../datas.json');
const fs = require('fs');
// const Saved_data = []
// var read_file = fs.readFileSync("datas.json");
const Post_details = require("./DetailsDB");
// var data_details = JSON.parse(read_file);
// while creating Date object

route.get('/store', async (request, response) => {
  try {
    var ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress || null; // contains IP details
    var device = request.headers['user-agent']; //contains browser and other details
    // console.log("Hi"+device);
    var Post_details_DB = new Post_details({
      IP: ip,
      dt: Date(),
      Device_details: device
    });
    await Post_details_DB.save();
    response.header("Access-control-Allow-Origin","https://moonkartz.netlify.app")
    response.send({ Status: "Session captured successfully" })
  }
  catch (err) {
    response.send({ Error: err })
  }
  // try {
  //   const saved = await Post_details_DB.save();
  //   console.log("count1")
  //   response.status(200).send();
  // }
  // catch (err) {
  //   response.send("Error");
  //   console.log("Inside error")
  // }
  // Saved_data.push(ip);


  // data_details[Date()] = ip;
  // fs.writeFile('datas.json', JSON.stringify(data_details), (err) => {
  //   if (err) response.json(err);
})
// console.log(request.ip);
// response.json("Welcome");
// Take server IP details and username password details to front end admin id.
// })
route.get("/showdb", async (req, res) => {
  // res.json(JSON.parse(fs.readFileSync("datas.json")));
  try {
    const show_all = await Post_details.find();
    res.json(show_all);
  } catch (error) {
    res.send(error)
  }

})
module.exports = route;