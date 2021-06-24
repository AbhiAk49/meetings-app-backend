const mongoose = require( 'mongoose' );

const timeSchema = new mongoose.Schema({
    hours: {
        type: Number,
        min: 0,
        max: 23,
        required: true
    },
    minutes: {
        type: Number,
        min: 0,
        max: 59,
        required: true
    }
});

const meetingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    startTime: {
        _id: false,
        type: timeSchema,
        required: true
    },
    endTime: {
        _id: false,
        type: timeSchema,
        required: true
    },
    attendees: [
             {
                 name: String,
                 email: String,
                 userid: mongoose.Schema.ObjectId
             }                 
    ]
});

mongoose.model( 'Meetings', meetingSchema );