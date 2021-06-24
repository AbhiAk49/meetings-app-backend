const express = require( 'express' );
const { createTeam,getTeams,addAndLeaveTeam } = require( '../controllers/teams' );

const authenticate  = require( '../middleware/auth' );

const router = express.Router();

router.post( '/', authenticate, createTeam );
router.get( '/', authenticate, getTeams );
router.patch('/:teamId',authenticate,addAndLeaveTeam)

module.exports = router;