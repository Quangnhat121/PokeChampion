import express from 'express';
import {
  getPokemonList,
  getPokemonDetail,
  getMoveList,
  getMoveDetail,
  getTypeList,
  getTypeDetail,
  getAbilityDetail,
} from '../controllers/pokedexController.js';

const router = express.Router();

// Pokemon
router.get('/pokemon', getPokemonList);
router.get('/pokemon/:nameOrId', getPokemonDetail);

// Moves
router.get('/moves', getMoveList);
router.get('/moves/:nameOrId', getMoveDetail);

// Types
router.get('/types', getTypeList);
router.get('/types/:nameOrId', getTypeDetail);

// Abilities
router.get('/abilities/:nameOrId', getAbilityDetail);

export default router;
