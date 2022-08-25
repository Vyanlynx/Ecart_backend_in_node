const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
    UserName: {
        type: String
    },
    Password: {
        type: String
    },
    Contact: { 
        type: String 
    },
    Address: { 
        type: String 
    },
    Password_without_hash: { 
        type: String 
    }
});

module.exports = mongoose.model('PostData', PostSchema);