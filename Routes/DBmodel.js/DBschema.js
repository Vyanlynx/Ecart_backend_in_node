const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
    UserName:{
        type:String
    },
    Password:{
        type:String
    }
});

module.exports = mongoose.model('PostData',PostSchema);