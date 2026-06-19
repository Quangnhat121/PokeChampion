import Pokemon from '../models/Pokemon.js';
import Move from '../models/Move.js';

/**
 * @desc    Get all Pokémon with filtering, sorting, and pagination
 * @route   GET /api/pokemon
 * @access  Public
 */
export const getPokemon = async (req, res, next) => {
  try {
    const {
      search,
      type,
      role,
      sort = 'name',
      order = 'asc',
      page = 1,
      limit = 20,
    } = req.query;

    // Build filter object
    const filter = {};

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    // Match type against either primaryType or secondaryType
    if (type) {
      filter.$or = [{ primaryType: type }, { secondaryType: type }];
    }

    if (role) {
      filter.role = role;
    }

    // Build sort object
    const sortObj = {};
    sortObj[sort] = order === 'desc' ? -1 : 1;

    // Pagination
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const [pokemon, total] = await Promise.all([
      Pokemon.find(filter)
        .sort(sortObj)
        .skip(skip)
        .limit(limitNum)
        .populate('moves'),
      Pokemon.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: {
        pokemon,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          pages: Math.ceil(total / limitNum),
        },
      },
      message: 'Pokémon retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single Pokémon by ID
 * @route   GET /api/pokemon/:id
 * @access  Public
 */
export const getPokemonById = async (req, res, next) => {
  try {
    const pokemon = await Pokemon.findById(req.params.id).populate('moves');

    if (!pokemon) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Pokémon not found',
      });
    }

    res.status(200).json({
      success: true,
      data: pokemon,
      message: 'Pokémon retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new Pokémon
 * @route   POST /api/pokemon
 * @access  Private/Admin
 */
export const createPokemon = async (req, res, next) => {
  try {
    const pokemon = await Pokemon.create(req.body);

    res.status(201).json({
      success: true,
      data: pokemon,
      message: 'Pokémon created successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a Pokémon
 * @route   PUT /api/pokemon/:id
 * @access  Private/Admin
 */
export const updatePokemon = async (req, res, next) => {
  try {
    const pokemon = await Pokemon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!pokemon) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Pokémon not found',
      });
    }

    res.status(200).json({
      success: true,
      data: pokemon,
      message: 'Pokémon updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a Pokémon
 * @route   DELETE /api/pokemon/:id
 * @access  Private/Admin
 */
export const deletePokemon = async (req, res, next) => {
  try {
    const pokemon = await Pokemon.findByIdAndDelete(req.params.id);

    if (!pokemon) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Pokémon not found',
      });
    }

    // Remove this Pokémon reference from all moves that referenced it
    await Move.updateMany(
      { pokemonLearned: pokemon._id },
      { $pull: { pokemonLearned: pokemon._id } }
    );

    res.status(200).json({
      success: true,
      data: null,
      message: 'Pokémon deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
