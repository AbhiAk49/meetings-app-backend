const mongoose = require( 'mongoose' );

const Meetings = mongoose.model( 'Meetings' );
const Users = mongoose.model( 'User' );
const createMeetings = (req, res, next) => {
    let meeting = req.body;
    if( !meeting || Object.keys( meeting ).length === 0 ){
        const error = new Error( 'Meeting details missing' );
        error.status = 400;
        return next( error );
    }

    

    let attendees = meeting.attendees.map( attendee => attendee.email );
    Users.find( {
        email: {
            $in:  attendees
        }
    }, 
    {
        email: 1,
        name: 1,
        _id:1
    }
    )
    .then( ( attendeesFromUser ) => {
        let updatedMeeting = {
            name : meeting.name,
            description : meeting.description,
            startDate: meeting.startDate,
            endDate: meeting.endDate,
            startTime:meeting.startTime,
            endTime:meeting.endTime,
            attendees: attendeesFromUser
        };
    
        return Meetings.create( updatedMeeting );
    } )
    .then( updatedMeeting => {
        res.status( 201 ).json( updatedMeeting )
    } )
    .catch( err => {
        //console.log( JSON.stringify( err, null, 4 ) );

        if( err.name === 'ValidationError' ){
            err.status = 400;
        }else {
            err.status = 500;
        }

        return next( err );
    } );
}

const searchMeetings = (req,res,next) => {
    const currentUSER = res.locals.claims.email;
    //need another way
    const period = req.query.period;
    let keywords = req.query.search || null;
    let today = new Date();
    today.setHours(0)
    today.setMinutes(0)
    today.setSeconds(0)
    today.setMilliseconds(0)

    const tomorrow = new Date(today.getTime()+( 3600 * 1000 * 24)).toString();
    today = today.toString();
    if(keywords===null){
        keywords='';
    }
    searchExp = new RegExp(keywords);

    if(period==='all'){
        Meetings.find({
            "attendees.email" : currentUSER,
            description:{
                $regex: searchExp,
                $options:'i'
            }
        })
        .then(results=>res.status( 201 ).json(results))
        .catch( err => {
            //console.log( JSON.stringify( err, null, 4 ) );
            return next( err );
        } );
    }
    if(period==='past'){
        Meetings.find({
            "attendees.email" : currentUSER,
            description:{
                $regex: searchExp,
                $options:'i'
            },
            startDate:{
                $lt:today
            }
        })
        .then(results=>res.status( 201 ).json(results))
        .catch( err => {
            //console.log( JSON.stringify( err, null, 4 ) );
            return next( err );
        } );
    }
    if(period==='present'){
        Meetings.find({
            "attendees.email" : currentUSER,
            description:{
                $regex: searchExp,
                $options:'i'
            },
            startDate:{
                $gte:today,
                $lt:tomorrow
            }
        })
        .then(results=>res.status( 201 ).json(results))
        .catch( err => {
            //console.log( JSON.stringify( err, null, 4 ) );
            return next( err );
        } );
    }
    if(period==='future'){
        Meetings.find({
            "attendees.email" : currentUSER,
            description:{
                $regex: searchExp,
                $options:'i'
            },
            startDate:{
                $gt:today,
                $gte:tomorrow
            }
        })
        .then(results=>res.status( 201 ).json(results))
        .catch( err => {
            //console.log( JSON.stringify( err, null, 4 ) );
            return next( err );
        } );
    }
}

const addAndLeaveMeeting = (req,res,next) => {
    const action = req.query.action || null;
    const meetingId = req.params.meetingId;
    const attendeeEmail = req.query.userEmail || null;
    const currentUSER = res.locals.claims.email;
    if( action === null ){
        Meetings.find({
            _id : meetingId,
            "attendees.email" : currentUSER
        })
        .then(meeting=>{
            res.status(201).json(meeting);
        })
        .catch( err => {
            return next( err );
        } );
    }
    else if( action === "leave_meeting" ){
        Meetings    
        .findByIdAndUpdate(meetingId,{
            $pull:{
                attendees: {
                    email: currentUSER
                }
            }
        })
        .then(meeting=>{
            res.status(201).json(meeting);
        })
        .catch( err => {
            return next( err );
        } );
    }
    else if( action === "add_attendee" ){
        if( attendeeEmail === null || attendeeEmail === ''){
            const err = new Error('invalid attendee email');
            err.status = 400;
            return next(err);
        }
        else{   
                Users.find( {
                    email: {
                        $in:  attendeeEmail
                    }
                }, 
                {
                    email: 1,
                    name: 1,
                    _id:1
                }
                )
                .then(attendee => {
                    return Meetings    
                            .findByIdAndUpdate(meetingId,{
                                $push:{
                                    attendees: attendee
                                }
                            })
                })
                .then(meeting=>{
                    res.status(201).json(meeting);
                })
                .catch( err => {
                    return next( err );
                } );
        }
        
    }
    else{
        const err = new Error('invalid action');
        err.status = 400;
        return next(err);
    }
    
}


module.exports = {
    createMeetings,
    searchMeetings,
    addAndLeaveMeeting,
    
}