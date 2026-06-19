import Move from '../models/Move.js';
import Pokemon from '../models/Pokemon.js';
import translationService from '../services/translationService.js';

/**
 * @desc    Get all moves with filtering, sorting, and pagination
 * @route   GET /api/moves
 * @access  Public
 */
export const getMoves = async (req, res, next) => {
  try {
    const {
      search,
      type,
      category,
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

    if (type) {
      filter.type = type;
    }

    if (category) {
      filter.category = category;
    }

    // Build sort object
    const sortObj = {};
    sortObj[sort] = order === 'desc' ? -1 : 1;

    // Pagination
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const [moves, total] = await Promise.all([
      Move.find(filter)
        .sort(sortObj)
        .skip(skip)
        .limit(limitNum)
        .populate('pokemonLearned', 'name imageUrl'),
      Move.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: {
        moves,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          pages: Math.ceil(total / limitNum),
        },
      },
      message: 'Moves retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single move by ID
 * @route   GET /api/moves/:id
 * @access  Public
 */
export const getMoveById = async (req, res, next) => {
  try {
    const move = await Move.findById(req.params.id).populate(
      'pokemonLearned',
      'name imageUrl'
    );

    if (!move) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Move not found',
      });
    }

    res.status(200).json({
      success: true,
      data: move,
      message: 'Move retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new move
 * @route   POST /api/moves
 * @access  Private/Admin
 */
export const createMove = async (req, res, next) => {
  try {
    const moveData = { ...req.body };
    if (moveData.effect && !moveData.effectVi) {
      moveData.effectVi = await translationService.translate(moveData.effect, 'move');
    }
    const move = await Move.create(moveData);

    res.status(201).json({
      success: true,
      data: move,
      message: 'Move created successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a move
 * @route   PUT /api/moves/:id
 * @access  Private/Admin
 */
export const updateMove = async (req, res, next) => {
  try {
    const moveData = { ...req.body };
    if (moveData.effect && !moveData.effectVi) {
      moveData.effectVi = await translationService.translate(moveData.effect, 'move');
    }
    const move = await Move.findByIdAndUpdate(req.params.id, moveData, {
      new: true,
      runValidators: true,
    });

    if (!move) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Move not found',
      });
    }

    res.status(200).json({
      success: true,
      data: move,
      message: 'Move updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a move
 * @route   DELETE /api/moves/:id
 * @access  Private/Admin
 */
export const deleteMove = async (req, res, next) => {
  try {
    const move = await Move.findByIdAndDelete(req.params.id);

    if (!move) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Move not found',
      });
    }

    // Remove this move reference from all Pokémon that had it
    await Pokemon.updateMany(
      { moves: move._id },
      { $pull: { moves: move._id } }
    );

    res.status(200).json({
      success: true,
      data: null,
      message: 'Move deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
