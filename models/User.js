const mongoose = require( 'mongoose' );
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

userSchema.path( 'email' ).validate(
    email => emailRegex.test( email ), 'Invalid email format'
)

userSchema.path( 'password' ).validate(
    password => passwordRegex.test( password ), 'Invalid password - Password must contain atleast 1 lower case, 1 upper case, 1 special character, 1 numeric character'
)

const SALT_FACTOR = 10;

userSchema.pre( 'save', function( done ) {

    const user = this;

    if( !user.isModified( 'password' ) ) {
        return done();
    }

    bcrypt.genSalt( SALT_FACTOR, ( err, salt ) => {
        if( err ) {
            return done( err );
        }

        bcrypt.hash( user.password, salt, ( err, hashedPassword ) => {
            if( err ) {
                return done( err );
            }

            user.password = hashedPassword;
            done();
        });
    });
});

userSchema.methods.checkPassword = function( password, done ) {
    bcrypt.compare( password, this.password, ( err, isMatch ) => {
        done( err, isMatch );
    });
};

mongoose.model( 'User', userSchema )