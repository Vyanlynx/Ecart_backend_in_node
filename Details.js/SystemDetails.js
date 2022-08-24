const { json } = require('body-parser');
const express = require('express');
const route = express();
// const Post_details_json = require('../datas.json');
const fs = require('fs');
// const Saved_data = []
// var read_file = fs.readFileSync("datas.json");
const Post_details = require("./DetailsDB");
// var data_details = JSON.parse(read_file);


route.get('/store', async (request, response) => {
  var ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress || null;
  var Post_details_DB = new Post_details({
    IP: ip + ":" + Date()
  });
  try {
    const saved = await Post_details_DB.save();
    response.status(200).send();
  }
  catch (err) {
    response.send("Error");
  }
  // Saved_data.push(ip);


  // data_details[Date()] = ip;
  // fs.writeFile('datas.json', JSON.stringify(data_details), (err) => {
  //   if (err) response.json(err);
})
// console.log(request.ip);
// response.json("Welcome");
// Take server IP details and username password details to front end admin id.
// })
route.get("/show", async(req, res) => {
  // res.json(JSON.parse(fs.readFileSync("datas.json")));
const show_all = await Post_details.find();
res.json(show_all);
})
module.exports = route;