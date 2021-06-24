const pageNotFoundHandler = ( req, res, next ) => {
    const error = new Error( `Page not found (Cannot handle ${req.method} ${req.url})` );
    error.status = 404;
    next( error );
};

// error handling middleware
const errorHandler = ( error, req, res, next ) => {
    res.status( error.status || 500 );
    res.json({
        message: error.message
    });
};

module.exports = {
    pageNotFoundHandler,
    errorHandler
};