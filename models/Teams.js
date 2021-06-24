const mongoose = require( 'mongoose' );

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    shortName: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    members: [
        {
            name: String,
            email:String,
            userid: mongoose.Schema.ObjectId
        } 
    ]
})

mongoose.model( 'Teams', teamSchema );