const { json } = require('body-parser');
const express = require('express');
const route = express();
const Post_details_json = require('../datas.json');
const fs = require('fs');
const Saved_data = []
var read_file = fs.readFileSync("datas.json");
var data_details = JSON.parse(read_file);
route.get('/store', async (request, response) => {

  // var Post_details_DB = new Post_details({
  //  latitude:request.params.latitude,
  //  longitude:request.params.longitude,
  //  IP:request.params.IP,
  //  postal:request.params.postal
  // });
  // try{
  // const saved = await Post_details_DB.save();
  // response.status(200).send();
  //  }
  // catch(err){
  //  response.send("Error");
  // }
  //  Saved_data.push( ip );
  var ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress || null;

  data_details[Date()] = ip;
  fs.writeFile('datas.json', JSON.stringify(data_details), (err) => {
    if (err) response.json(err);
  })
  // console.log(request.ip);
  response.json("Welcome");
  // Take server IP details and username password details to front end admin id.
})
route.get("/show", (req, res) => {
  res.json(JSON.parse(fs.readFileSync("datas.json")));
})
module.exports = route;