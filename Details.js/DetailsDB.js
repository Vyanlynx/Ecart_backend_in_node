const mongoose = require('mongoose');
//React page needs to run geo location API immediately one time when the person click login page and send the data to backend.
//here it saves that to DB
//  https://geolocation-db.com/json/
const PostSchema_details = mongoose.Schema({
    latitude:{},
    longitude:{},
    IP:{},
    postal:{}
});
module.exports = mongoose.model('Post_details',PostSchema_details);