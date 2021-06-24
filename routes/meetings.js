const express = require( 'express' );
const { createMeetings,searchMeetings,addAndLeaveMeeting } = require( '../controllers/meetings' );

const authenticate  = require( '../middleware/auth' );

const router = express.Router();

router.post( '/', authenticate, createMeetings );
router.get( '/search', authenticate, searchMeetings );
router.patch('/:meetingId',authenticate,addAndLeaveMeeting)

module.exports = router;