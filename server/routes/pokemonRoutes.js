import express from 'express';
import {
  getPokemon,
  getPokemonById,
  createPokemon,
  updatePokemon,
  deletePokemon,
} from '../controllers/pokemonController.js';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';

const router = express.Router();

// GET  /api/pokemon      — list all Pokémon (public)
// POST /api/pokemon      — create a Pokémon (admin only)
router.route('/').get(getPokemon).post(auth, admin, createPokemon);

// GET    /api/pokemon/:id — get single Pokémon (public)
// PUT    /api/pokemon/:id — update a Pokémon (admin only)
// DELETE /api/pokemon/:id — delete a Pokémon (admin only)
router
  .route('/:id')
  .get(getPokemonById)
  .put(auth, admin, updatePokemon)
  .delete(auth, admin, deletePokemon);

export default router;
