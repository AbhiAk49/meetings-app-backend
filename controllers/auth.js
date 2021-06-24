const mongoose = require( 'mongoose' );
const jwt = require( 'jsonwebtoken' );

const User = mongoose.model( 'User' );

const register = ( req, res, next ) => {
    const user = req.body;

    if( !user ){
        const error = new Error( 'User details not sent in request body' );
        next( error );
        return;
    }

    User.create(  user )
    .then( updatedUser => {
        res.status( 201 ).json( { email: updatedUser.email , name: updatedUser.name} );
    })
    .catch( err => {
        if( err.name === 'ValidationError' ){
            err.status = 400;
        }else{
            err.status = 500;
        }
        return next(err);
    } );
};

const login = ( req, res, next ) => {
    const u = req.body;

    if( !u ) {
        const error = new Error( 'Login details not sent in request body' );
        next( error );
        return;
    }
    
    if( !u.email || !u.password ) {
        const error = new Error( 'Login details not sent in request body' );
        next( error );
        return;
    }

    User
        .findOne( { email: u.email } )
        .then( user => {
            if( !user ) {
                const error = new Error( 'No matching credentials' );
                error.status = 404;
                return next( error );
            }
            user.checkPassword( u.password, ( err, isMatch ) => {
                if( err ) {
                    const error = new Error( 'No matching credentials' );
                    error.status = 404;
                    return next( error );
                }

                if( !isMatch ) {
                    const error = new Error( 'No matching credentials' );
                    error.status = 404;
                    return next( error );
                }

                // generate the token
                const claims = {
                    name: user.name,
                    email: user.email,
                    role: user.role
                };

                jwt.sign( claims, 'asdf' /* process.env.JWT_SECRET */, { expiresIn: 24 * 60 * 60 }, ( err, token ) => {
                    if( err ) {
                        err.status = 500;
                        return next( err );
                    }

                    res.json({
                        name: user.name,
                        email: user.email,
                        token: token
                    });
                });
            });
        })
        .catch( err => {
            if( err.name === 'ValidationError' ) {
                err.status = 400;
            } else {
                err.status = 500;
            }

            return next( err );
        });
};
module.exports = {
    register,
    login
}