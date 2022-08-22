const express = require('express');
const route = express();
// const Post_details = require('./DetailsDB');
const Saved_data = []
route.post('/serverdetails',async (request,response)=>{
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
   Saved_data.push({
   IP:request.socket.remoteAddress
   });
   // console.log(request.ip);
   response.json(Saved_data).send("Hello Kid!");
   // let ip = request.headers['x-forwarded-for']
   // let ip2 = request.headers['x-forwarded-for'].split(',')[0];
   // console.log(ip);
   // console.log(ip2);
})
module.exports = route;