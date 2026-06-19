import Team from '../models/Team.js';

/**
 * @desc    Get all teams for the authenticated user
 * @route   GET /api/teams
 * @access  Private
 */
export const getTeams = async (req, res, next) => {
  try {
    const teams = await Team.find({ userId: req.user._id })
      .populate({
        path: 'pokemonList.pokemon',
        populate: { path: 'moves' },
      })
      .populate('pokemonList.moves');

    res.status(200).json({
      success: true,
      data: teams,
      message: 'Teams retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single team by ID (must belong to authenticated user)
 * @route   GET /api/teams/:id
 * @access  Private
 */
export const getTeamById = async (req, res, next) => {
  try {
    const team = await Team.findOne({
      _id: req.params.id,
      userId: req.user._id,
    })
      .populate({
        path: 'pokemonList.pokemon',
        populate: { path: 'moves' },
      })
      .populate('pokemonList.moves');

    if (!team) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Team not found',
      });
    }

    res.status(200).json({
      success: true,
      data: team,
      message: 'Team retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new team
 * @route   POST /api/teams
 * @access  Private
 */
export const createTeam = async (req, res, next) => {
  try {
    const { name, pokemonList } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Team name is required',
      });
    }

    // Validate team constraints
    if (pokemonList && pokemonList.length > 6) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'A team can have a maximum of 6 Pokémon',
      });
    }

    if (pokemonList) {
      for (const entry of pokemonList) {
        if (entry.moves && entry.moves.length > 4) {
          return res.status(400).json({
            success: false,
            data: null,
            message: 'Each Pokémon can have a maximum of 4 moves',
          });
        }
      }
    }

    const team = await Team.create({
      userId: req.user._id,
      name,
      pokemonList: pokemonList || [],
    });

    res.status(201).json({
      success: true,
      data: team,
      message: 'Team created successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a team
 * @route   PUT /api/teams/:id
 * @access  Private
 */
export const updateTeam = async (req, res, next) => {
  try {
    const { name, pokemonList } = req.body;

    // Validate team constraints
    if (pokemonList && pokemonList.length > 6) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'A team can have a maximum of 6 Pokémon',
      });
    }

    if (pokemonList) {
      for (const entry of pokemonList) {
        if (entry.moves && entry.moves.length > 4) {
          return res.status(400).json({
            success: false,
            data: null,
            message: 'Each Pokémon can have a maximum of 4 moves',
          });
        }
      }
    }

    const team = await Team.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { name, pokemonList },
      { new: true, runValidators: true }
    );

    if (!team) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Team not found',
      });
    }

    res.status(200).json({
      success: true,
      data: team,
      message: 'Team updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a team
 * @route   DELETE /api/teams/:id
 * @access  Private
 */
export const deleteTeam = async (req, res, next) => {
  try {
    const team = await Team.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!team) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Team not found',
      });
    }

    res.status(200).json({
      success: true,
      data: null,
      message: 'Team deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
