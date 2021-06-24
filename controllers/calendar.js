const mongoose = require( 'mongoose' );

const Meetings = mongoose.model( 'Meetings' );
const getMeetingforDay = (req, res, next) => {
    const dateQuery = req.query.date||null;
    const currentUSER = res.locals.claims.email;
    const day = new Date(dateQuery).toString();
    if(dateQuery === null ){
        const err = new Error('invalid date');
        err.status = 400;
        return next(err);
    }
    else{
        let nextDate = new Date(dateQuery);
        nextDate.setDate(nextDate.getDate() + 1);
        let nextDay = nextDate.toString();
    
        Meetings.find({
            "attendees.email" : currentUSER,
            startDate:{
                $gte:day,
                $lt:nextDay
            }
        })
        .then( meetings => {
            res.status( 201 ).json( meetings )
        } )
        .catch( err => {
            return next( err );
        } );
    }
    
}

module.exports = {
    getMeetingforDay
}