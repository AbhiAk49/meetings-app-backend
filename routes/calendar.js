const express = require( 'express' );
const { getMeetingforDay } = require( '../controllers/calendar' );

const authenticate  = require( '../middleware/auth' );
const router = express.Router();
router.get( '/', authenticate, getMeetingforDay );

module.exports = router;