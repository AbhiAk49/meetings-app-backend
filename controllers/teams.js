const mongoose = require( 'mongoose' );

const Teams = mongoose.model( 'Teams' );
const Users = mongoose.model( 'User' );
const createTeam = (req, res, next) => {
    let team = req.body;
    if( !team || Object.keys( team ).length === 0 ){
        const error = new Error( 'Teams details missing' );
        error.status = 400;
        return next( error );
    }

    

    let members = team.members.map( member => member.email );
    Users.find( {
        email: {
            $in:  members
        }
    }, 
    {
        email: 1,
        name: 1,
        _id:1
    }
    )
    .then( ( membersFromUser ) => {
        let updatedTeam = {
            name : team.name,
            shortName : team.shortName,
            description:team.description,
            members: membersFromUser
        };
    
        return Teams.create( updatedTeam );
    } )
    .then( updatedTeam => {
        res.status( 201 ).json( updatedTeam )
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

const getTeams = (req, res, next) => {
    const currentUSER = res.locals.claims.email;
    Teams.find({
        "members.email" : currentUSER,
    })
    .then( Teams => {
        res.status( 201 ).json( Teams )
    } )
    .catch( err => {
        return next( err );
    } );
}

const addAndLeaveTeam = (req,res,next) => {
    const action = req.query.action || null;
    const teamId = req.params.teamId;
    const memberEmail = req.query.userEmail || null;
    const currentUSER = res.locals.claims.email;
    if( action === null ){
        Teams.find({
            _id : teamId,
            "members.email" : currentUSER
        })
        .then(team=>{
            res.status(201).json(team);
        })
        .catch( err => {
            return next( err );
        } );
    }
    else if( action === "leave_team" ){
        Teams    
        .findByIdAndUpdate(teamId,{
            $pull:{
                members: {
                    email: currentUSER
                }
            }
        })
        .then(team=>{
            res.status(201).json(team);
        })
        .catch( err => {
            return next( err );
        } );
    }
    else if( action === "add_member" ){
        if( memberEmail === null || memberEmail === ''){
            const err = new Error('invalid member email');
            err.status = 400;
            return next(err);
        }
        else{   
                Users.find( {
                    email: {
                        $in:  memberEmail
                    }
                }, 
                {
                    email: 1,
                    name: 1,
                    _id:1
                }
                )
                .then(member => {
                    return Teams    
                            .findByIdAndUpdate(teamId,{
                                $push:{
                                    members: member
                                }
                            })
                })
                .then(team=>{
                    res.status(201).json(team);
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
    createTeam,
    getTeams,
    addAndLeaveTeam
}