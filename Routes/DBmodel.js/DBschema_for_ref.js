const mongoose = require('mongoose');

const DBschema_for_ref = mongoose.Schema({
    UserName:{
        type:String
    },
    Password:{
        type:String
    }
});

module.exports = mongoose.model('DB_ref',DBschema_for_ref);