import express from 'express';
import {
  getTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
} from '../controllers/teamController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// All team routes require authentication
router.use(auth);

// GET  /api/teams — list user's teams
// POST /api/teams — create a new team
router.route('/').get(getTeams).post(createTeam);

// GET    /api/teams/:id — get single team
// PUT    /api/teams/:id — update a team
// DELETE /api/teams/:id — delete a team
router.route('/:id').get(getTeamById).put(updateTeam).delete(deleteTeam);

export default router;
