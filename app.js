require( './data/init' )
const cors = require('cors');   
const express = require( 'express' );
const authRouter = require( './routes/auth' );
const usersRouter = require( './routes/users' );
const meetingRouter = require( './routes/meetings' );
const teamRouter = require( './routes/teams' );
const calendarRouter = require( './routes/calendar' );
const { pageNotFoundHandler, errorHandler } = require( './middleware/error-handlers' );
const PORT = process.env.PORT || 3000;
const ALLOWED_ORIGINS = [
    `http://localhost:${PORT}`
  ]
const app = express();
app.use(cors());
app.use( express.json() );

app.use( express.urlencoded( { extended: false } ) );

app.use( '/auth', authRouter );
app.use( '/meetings', meetingRouter );
app.use( '/users', usersRouter );
app.use( '/teams', teamRouter );
app.use( '/calendar', calendarRouter );

app.use( pageNotFoundHandler );
app.use( errorHandler );


app.listen( PORT, error => {
    if( error ) {
        return console.error( error.message );
    }
    console.log( `Server running on ${PORT}` )
} );