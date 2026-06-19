import pokeApiService from '../services/pokeApiService.js';
import translationService from '../services/translationService.js';
import cacheService from '../services/cacheService.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getOfficialArtwork(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

function getSpriteUrl(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

function extractId(url) {
  const parts = url.replace(/\/$/, '').split('/');
  return parseInt(parts[parts.length - 1], 10);
}

// ─── Pokemon ──────────────────────────────────────────────────────────────────

/**
 * GET /api/pokedex/pokemon
 * List pokemon with pagination and search.
 */
export const getPokemonList = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 50);
    const search = (req.query.search || '').toLowerCase().trim();

    let results;
    let total;

    if (search) {
      // Search: filter from all pokemon names
      const allNames = await pokeApiService.getAllPokemonNames();
      const filtered = allNames.filter((n) => n.includes(search));
      total = filtered.length;
      const paged = filtered.slice((page - 1) * limit, page * limit);

      // Fetch details for each pokemon (parallel, max 20)
      results = await Promise.all(
        paged.map(async (name) => {
          try {
            const p = await pokeApiService.getPokemonDetail(name);
            return {
              id: p.id,
              name: p.name,
              image: getOfficialArtwork(p.id),
              sprite: getSpriteUrl(p.id),
              types: p.types.map((t) => t.type.name),
            };
          } catch {
            return null;
          }
        })
      );
      results = results.filter(Boolean);
    } else {
      const offset = (page - 1) * limit;
      const data = await pokeApiService.getPokemonList(offset, limit);
      total = data.count;

      results = await Promise.all(
        data.results.map(async (entry) => {
          const id = extractId(entry.url);
          try {
            const p = await pokeApiService.getPokemonDetail(entry.name);
            return {
              id,
              name: p.name,
              image: getOfficialArtwork(id),
              sprite: getSpriteUrl(id),
              types: p.types.map((t) => t.type.name),
            };
          } catch {
            return {
              id,
              name: entry.name,
              image: getOfficialArtwork(id),
              sprite: getSpriteUrl(id),
              types: [],
            };
          }
        })
      );
    }

    res.json({
      success: true,
      data: {
        pokemon: results,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/pokedex/pokemon/:nameOrId
 * Pokemon detail with Vietnamese translations.
 */
export const getPokemonDetail = async (req, res, next) => {
  try {
    const { nameOrId } = req.params;
    const pokemon = await pokeApiService.getPokemonDetail(nameOrId);

    // Get species data for flavor text
    let flavorText = '';
    let genus = '';
    try {
      const species = await pokeApiService.getPokemonSpecies(pokemon.name);

      // Get English flavor text
      const enFlavor = species.flavor_text_entries?.find(
        (e) => e.language?.name === 'en'
      );
      if (enFlavor) {
        flavorText = enFlavor.flavor_text.replace(/\n|\f/g, ' ').trim();
      }

      // Genus
      const enGenus = species.genera?.find((g) => g.language?.name === 'en');
      genus = enGenus?.genus || '';
    } catch {
      // Species data not critical
    }

    // Get ability descriptions (English only)
    const abilities = await Promise.all(
      pokemon.abilities.map(async (a) => {
        let description = '';
        try {
          const detail = await pokeApiService.getAbilityDetail(a.ability.name);
          const enEffect = detail.effect_entries?.find(
            (e) => e.language?.name === 'en'
          );
          if (enEffect) {
            description = enEffect.short_effect || enEffect.effect;
          }
        } catch {
          // Continue
        }
        return {
          name: a.ability.name,
          isHidden: a.is_hidden,
          description,
        };
      })
    );

    // Format moves (limit to first 30 for performance)
    const moves = pokemon.moves.slice(0, 30).map((m) => ({
      name: m.move.name,
      learnMethod:
        m.version_group_details?.[m.version_group_details.length - 1]
          ?.move_learn_method?.name || 'unknown',
      level:
        m.version_group_details?.[m.version_group_details.length - 1]
          ?.level_learned_at || 0,
    }));

    // Stats
    const stats = {};
    pokemon.stats.forEach((s) => {
      stats[s.stat.name] = s.base_stat;
    });

    res.json({
      success: true,
      data: {
        id: pokemon.id,
        name: pokemon.name,
        image: getOfficialArtwork(pokemon.id),
        sprite: getSpriteUrl(pokemon.id),
        types: pokemon.types.map((t) => t.type.name),
        abilities,
        stats: {
          hp: stats.hp || 0,
          attack: stats.attack || 0,
          defense: stats.defense || 0,
          spAtk: stats['special-attack'] || 0,
          spDef: stats['special-defense'] || 0,
          speed: stats.speed || 0,
        },
        height: pokemon.height / 10, // dm -> m
        weight: pokemon.weight / 10, // hg -> kg
        moves,
        genus,
        flavorText,
        baseExperience: pokemon.base_experience,
      },
    });
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        message: 'Pokémon không tồn tại',
      });
    }
    next(error);
  }
};

// ─── Moves ────────────────────────────────────────────────────────────────────

/**
 * GET /api/pokedex/moves
 * List moves with pagination, search, and type filter.
 */
export const getMoveList = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 50);
    const search = (req.query.search || '').toLowerCase().trim();
    const typeFilter = (req.query.type || '').toLowerCase().trim();

    // We need to get all moves for search/filter
    const allMoves = await pokeApiService.getAllMoveNames();

    let filtered = allMoves;
    if (search) {
      filtered = filtered.filter((m) => m.name.includes(search));
    }

    // If type filter, we need to check each move's type (expensive, so limit)
    if (typeFilter) {
      const cacheKey = `pokedex:moves-by-type:${typeFilter}`;
      let typedMoves = cacheService.get(cacheKey);

      if (!typedMoves) {
        // Fetch all filtered move details (max 200 for performance)
        const toCheck = filtered.slice(0, 200);
        const details = await Promise.all(
          toCheck.map(async (m) => {
            try {
              const d = await pokeApiService.getMoveDetail(m.name);
              return { ...m, type: d.type?.name };
            } catch {
              return null;
            }
          })
        );
        typedMoves = details
          .filter((d) => d && d.type === typeFilter)
          .map((d) => ({ name: d.name, url: d.url || '' }));
        cacheService.set(cacheKey, typedMoves, 3600);
      }
      filtered = typedMoves;
    }

    const total = filtered.length;
    const paged = filtered.slice((page - 1) * limit, page * limit);

    // Fetch details for paged moves
    const results = await Promise.all(
      paged.map(async (entry) => {
        try {
          const d = await pokeApiService.getMoveDetail(entry.name);
          return {
            id: d.id,
            name: d.name,
            type: d.type?.name || 'unknown',
            category: d.damage_class?.name || 'status',
            power: d.power,
            accuracy: d.accuracy,
            pp: d.pp,
          };
        } catch {
          return {
            name: entry.name,
            type: 'unknown',
            category: 'unknown',
            power: null,
            accuracy: null,
            pp: null,
          };
        }
      })
    );

    res.json({
      success: true,
      data: {
        moves: results,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/pokedex/moves/:nameOrId
 * Move detail with Vietnamese effect.
 */
export const getMoveDetail = async (req, res, next) => {
  try {
    const { nameOrId } = req.params;
    const move = await pokeApiService.getMoveDetail(nameOrId);

    const enEffect = move.effect_entries?.find(
      (e) => e.language?.name === 'en'
    );
    const effectText = enEffect
      ? (enEffect.short_effect || enEffect.effect)
          .replace(/\$effect_chance%/g, `${move.effect_chance || '??'}%`)
          .trim()
      : '';

    const enFlavor = move.flavor_text_entries?.find(
      (e) => e.language?.name === 'en'
    );
    const flavorText = enFlavor
      ? enFlavor.flavor_text.replace(/\n|\f/g, ' ').trim()
      : '';

    // Pokemon that learn this move (from PokeAPI, limit 20)
    const pokemonLearned = move.learned_by_pokemon?.slice(0, 20).map((p) => {
      const id = extractId(p.url);
      return {
        id,
        name: p.name,
        image: getOfficialArtwork(id),
        sprite: getSpriteUrl(id),
      };
    }) || [];

    res.json({
      success: true,
      data: {
        id: move.id,
        name: move.name,
        type: move.type?.name || 'unknown',
        category: move.damage_class?.name || 'status',
        power: move.power,
        accuracy: move.accuracy,
        pp: move.pp,
        priority: move.priority,
        effectChance: move.effect_chance,
        effect: effectText,
        effectVi: '',
        flavorText: flavorText,
        flavorVi: '',
        pokemonLearned,
      },
    });
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        message: 'Chiêu thức không tồn tại',
      });
    }
    next(error);
  }
};

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * GET /api/pokedex/types
 * List all types.
 */
export const getTypeList = async (req, res, next) => {
  try {
    const data = await pokeApiService.getTypeList();

    // Filter out unknown/shadow types
    const mainTypes = data.results
      .filter((t) => !['unknown', 'shadow', 'stellar'].includes(t.name))
      .map((t) => ({
        name: t.name,
        nameVi: t.name,
      }));

    res.json({
      success: true,
      data: mainTypes,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    GET /api/pokedex/types/:nameOrId
 * @route   Type detail with damage relations in English.
 */
export const getTypeDetail = async (req, res, next) => {
  try {
    const { nameOrId } = req.params;
    const typeData = await pokeApiService.getTypeDetail(nameOrId);

    const dr = typeData.damage_relations;
    const damageRelations = {};

    for (const [key, types] of Object.entries(dr)) {
      damageRelations[key] = {
        label: key,
        types: types.map((t) => ({
          name: t.name,
          nameVi: t.name,
        })),
      };
    }

    // Pokemon of this type (limit 20)
    const pokemon = typeData.pokemon?.slice(0, 20).map((p) => {
      const id = extractId(p.pokemon.url);
      return {
        id,
        name: p.pokemon.name,
        image: getOfficialArtwork(id),
        sprite: getSpriteUrl(id),
      };
    }) || [];

    // Moves of this type (limit 20)
    const moves = typeData.moves?.slice(0, 20).map((m) => ({
      name: m.name,
    })) || [];

    res.json({
      success: true,
      data: {
        id: typeData.id,
        name: typeData.name,
        nameVi: translationService.translateTypeName(typeData.name),
        damageRelations,
        pokemon,
        moves,
      },
    });
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        message: 'Hệ không tồn tại',
      });
    }
    next(error);
  }
};

// ─── Abilities ────────────────────────────────────────────────────────────────

/**
 * GET /api/pokedex/abilities/:nameOrId
 */
export const getAbilityDetail = async (req, res, next) => {
  try {
    const { nameOrId } = req.params;
    const ability = await pokeApiService.getAbilityDetail(nameOrId);

    const enEffect = ability.effect_entries?.find(
      (e) => e.language?.name === 'en'
    );
    const descriptionText = enEffect ? (enEffect.short_effect || enEffect.effect) : '';

    const enFlavor = ability.flavor_text_entries?.find(
      (e) => e.language?.name === 'en'
    );
    const flavorText = enFlavor ? enFlavor.flavor_text.replace(/\n|\f/g, ' ').trim() : '';

    // Pokemon with this ability
    const pokemon = ability.pokemon?.slice(0, 20).map((p) => {
      const id = extractId(p.pokemon.url);
      return {
        id,
        name: p.pokemon.name,
        image: getOfficialArtwork(id),
        isHidden: p.is_hidden,
      };
    }) || [];

    res.json({
      success: true,
      data: {
        id: ability.id,
        name: ability.name,
        description: descriptionText,
        descriptionVi: '',
        flavorText: flavorText,
        flavorVi: '',
        pokemon,
      },
    });
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({
        success: false,
        message: 'Đặc tính không tồn tại',
      });
    }
    next(error);
  }
};
