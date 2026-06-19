import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import moveRoutes from './routes/moveRoutes.js';
import pokemonRoutes from './routes/pokemonRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import pokedexRoutes from './routes/pokedexRoutes.js';

// Utils
import typeChart from './utils/typeChart.js';

// Models (for stats endpoint)
import Pokemon from './models/Pokemon.js';
import Move from './models/Move.js';

// ---------------------------------------------------------------------------
// Initialize Express
// ---------------------------------------------------------------------------
const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',').map((origin) => origin.trim()) : []),
].filter(Boolean);

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

// Parse JSON request bodies
app.use(express.json());

// Parse cookies
app.use(cookieParser());

// CORS — allow the front-end origin with credentials (cookies)
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
  })
);

// ---------------------------------------------------------------------------
// Mount API routes
// ---------------------------------------------------------------------------
app.use('/api/auth', authRoutes);
app.use('/api/moves', moveRoutes);
app.use('/api/pokemon', pokemonRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/pokedex', pokedexRoutes);

/**
 * @route   GET /api/types
 * @desc    Return the complete Pokémon type effectiveness chart
 * @access  Public
 */
app.get('/api/types', (req, res) => {
  res.status(200).json({
    success: true,
    data: typeChart,
    message: 'Type chart retrieved successfully',
  });
});

/**
 * @route   GET /api/stats
 * @desc    Return dashboard statistics
 * @access  Public
 */
app.get('/api/stats', async (req, res, next) => {
  try {
    const [totalPokemon, totalMoves, strongestMove] = await Promise.all([
      Pokemon.countDocuments(),
      Move.countDocuments(),
      Move.findOne().sort({ power: -1 }).select('name power type'),
    ]);

    // PokeAPI totals (from cache or static)
    const pokeApiTotals = {
      totalPokemonPokeApi: 1302,
      totalMovesPokeApi: 919,
    };

    res.status(200).json({
      success: true,
      data: {
        totalPokemon,
        totalMoves,
        strongestMove: strongestMove || null,
        totalTypes: typeChart.length,
        ...pokeApiTotals,
      },
      message: 'Dashboard stats retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
});

// ---------------------------------------------------------------------------
// Global error handler (must be after routes)
// ---------------------------------------------------------------------------
app.use(errorHandler);

// ---------------------------------------------------------------------------
// Start server
// ---------------------------------------------------------------------------
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(
      `🚀 PokedexChampion server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
    );
  });
};

startServer();
