const jwt = require( 'jsonwebtoken' );

const authenticate = ( req, res, next ) => {
    const token = req.header( 'Authorization' );

    if( !token ){
        const error = new Error( 'Go away intruder' );
        error.status = 401;
        return next( error );

    }

    jwt.verify( token, 'asdf', (err, claims) => {
        if( err ){
            const error = new Error( 'Go away intruder' );
            error.status = 403;
            return next( error );
        }

        res.locals.claims = claims;
        next();
    } );    
    
}

module.exports = authenticate