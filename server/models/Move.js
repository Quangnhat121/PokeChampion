import mongoose from 'mongoose';

// All 18 official Pokémon types
const POKEMON_TYPES = [
  'Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice',
  'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug',
  'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy',
];

const moveSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Move name is required'],
    unique: true,
    trim: true,
  },
  type: {
    type: String,
    required: [true, 'Move type is required'],
    enum: POKEMON_TYPES,
  },
  category: {
    type: String,
    required: [true, 'Move category is required'],
    enum: ['Physical', 'Special', 'Status'],
  },
  power: {
    type: Number,
    default: 0,
  },
  accuracy: {
    type: Number,
    default: 100,
  },
  pp: {
    type: Number,
    required: [true, 'PP is required'],
  },
  effect: {
    type: String,
  },
  strategyNote: {
    type: String,
  },
  pokemonLearned: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pokemon',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Move = mongoose.model('Move', moveSchema);

export default Move;
