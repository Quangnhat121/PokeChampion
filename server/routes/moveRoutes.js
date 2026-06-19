import express from 'express';
import {
  getMoves,
  getMoveById,
  createMove,
  updateMove,
  deleteMove,
} from '../controllers/moveController.js';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';

const router = express.Router();

// GET  /api/moves      — list all moves (public)
// POST /api/moves      — create a move (admin only)
router.route('/').get(getMoves).post(auth, admin, createMove);

// GET    /api/moves/:id — get single move (public)
// PUT    /api/moves/:id — update a move (admin only)
// DELETE /api/moves/:id — delete a move (admin only)
router
  .route('/:id')
  .get(getMoveById)
  .put(auth, admin, updateMove)
  .delete(auth, admin, deleteMove);

export default router;
