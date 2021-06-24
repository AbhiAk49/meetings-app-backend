const mongoose = require( 'mongoose' );

const Users = mongoose.model( 'User' );

const getUsers = (req, res, next) => {

    Users
    .find({},{
        _id:1,
        name:1,
        email:1
    })
    .then( users => {
        res.status( 201 ).json( users )
    } )
    .catch( err => {
        err.status = 500;
        return next( err );
    } );
}

module.exports = {
    getUsers
}