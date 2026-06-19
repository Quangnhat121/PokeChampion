import mongoose from 'mongoose';

// All 18 official Pokémon types
const POKEMON_TYPES = [
  'Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice',
  'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug',
  'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy',
];

const pokemonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Pokémon name is required'],
    unique: true,
    trim: true,
  },
  imageUrl: {
    type: String,
    default: '',
  },
  primaryType: {
    type: String,
    required: [true, 'Primary type is required'],
    enum: POKEMON_TYPES,
  },
  secondaryType: {
    type: String,
    enum: [...POKEMON_TYPES, ''],
    default: '',
  },
  ability: {
    type: String,
    required: [true, 'Ability is required'],
  },
  stats: {
    hp: { type: Number, default: 0 },
    attack: { type: Number, default: 0 },
    defense: { type: Number, default: 0 },
    spAtk: { type: Number, default: 0 },
    spDef: { type: Number, default: 0 },
    speed: { type: Number, default: 0 },
  },
  role: {
    type: String,
    enum: ['Sweeper', 'Tank', 'Support', 'Special Attacker', 'Physical Attacker', ''],
    default: '',
  },
  moves: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Move',
    },
  ],
  pvpMoveset: {
    type: String,
  },
  strategyNote: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Pokemon = mongoose.model('Pokemon', pokemonSchema);

export default Pokemon;
