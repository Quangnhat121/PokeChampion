import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  name: {
    type: String,
    required: [true, 'Team name is required'],
    trim: true,
  },
  pokemonList: [
    {
      pokemon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pokemon',
      },
      moves: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Move',
        },
      ], // max 4 moves per Pokémon
    },
  ], // max 6 Pokémon per team
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Team = mongoose.model('Team', teamSchema);

export default Team;
