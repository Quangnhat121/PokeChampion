import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import User from '../models/User.js';
import Move from '../models/Move.js';
import Pokemon from '../models/Pokemon.js';
import Team from '../models/Team.js';
import Translation from '../models/Translation.js';
import translationService from '../services/translationService.js';

// ---------------------------------------------------------------------------
// Seed data
// ---------------------------------------------------------------------------

const seedDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected for seeding');

    // -----------------------------------------------------------------------
    // 1. Clear existing data
    // -----------------------------------------------------------------------
    await Promise.all([
      User.deleteMany({}),
      Move.deleteMany({}),
      Pokemon.deleteMany({}),
      Team.deleteMany({}),
      Translation.deleteMany({}),
    ]);
    console.log('🗑️  Cleared all existing data');

    // -----------------------------------------------------------------------
    // 2. Create users
    // -----------------------------------------------------------------------
    const users = await User.create([
      {
        username: 'admin',
        email: 'admin@pokedex.com',
        password: 'admin123',
        role: 'admin',
      },
      {
        username: 'trainer',
        email: 'trainer@pokedex.com',
        password: 'trainer123',
        role: 'user',
      },
    ]);
    console.log(`👤 Created ${users.length} users`);

    // -----------------------------------------------------------------------
    // 3. Create 17 Dragon-type moves
    // -----------------------------------------------------------------------
    const movesData = [
      {
        name: 'Dragon Claw',
        type: 'Dragon',
        category: 'Physical',
        power: 80,
        accuracy: 100,
        pp: 15,
        effect: 'No additional effect',
        strategyNote: 'Reliable STAB physical move with no drawbacks. Great for consistent damage.',
      },
      {
        name: 'Dragon Pulse',
        type: 'Dragon',
        category: 'Special',
        power: 85,
        accuracy: 100,
        pp: 10,
        effect: 'No additional effect',
        strategyNote: 'Reliable special Dragon STAB. Preferred on special attackers like Latios.',
      },
      {
        name: 'Draco Meteor',
        type: 'Dragon',
        category: 'Special',
        power: 130,
        accuracy: 90,
        pp: 5,
        effect: 'Sharply lowers user Sp. Atk after use',
        strategyNote: 'Nuke option for special attackers. Best used as a hit-and-run; switch out after firing.',
      },
      {
        name: 'Dragon Dance',
        type: 'Dragon',
        category: 'Status',
        power: 0,
        accuracy: 0,
        pp: 20,
        effect: 'Raises user Attack and Speed by 1 stage',
        strategyNote: 'Top-tier setup move. One boost can turn a sweeper into an unstoppable threat.',
      },
      {
        name: 'Outrage',
        type: 'Dragon',
        category: 'Physical',
        power: 120,
        accuracy: 100,
        pp: 10,
        effect: 'Attacks for 2-3 turns then confuses user',
        strategyNote: 'Devastating power but locks you in. Use late-game once Fairy-types are eliminated.',
      },
      {
        name: 'Dragon Tail',
        type: 'Dragon',
        category: 'Physical',
        power: 60,
        accuracy: 90,
        pp: 10,
        effect: 'Forces target to switch out, priority -6',
        strategyNote: 'Phazing move to rack up entry hazard damage. Good on defensive Pokémon.',
      },
      {
        name: 'Dragon Breath',
        type: 'Dragon',
        category: 'Special',
        power: 60,
        accuracy: 100,
        pp: 20,
        effect: '30% chance to paralyze target',
        strategyNote: 'Early-game option with useful paralysis chance. Outclassed later by Dragon Pulse.',
      },
      {
        name: 'Dragon Rush',
        type: 'Dragon',
        category: 'Physical',
        power: 100,
        accuracy: 75,
        pp: 10,
        effect: '20% chance to flinch target',
        strategyNote: 'High power but unreliable accuracy. Consider Dragon Claw for consistency.',
      },
      {
        name: 'Scale Shot',
        type: 'Dragon',
        category: 'Physical',
        power: 25,
        accuracy: 90,
        pp: 20,
        effect: 'Hits 2-5 times. Raises Speed, lowers Defense',
        strategyNote: 'Multi-hit move that boosts Speed. Excellent on Garchomp for sweeping after boosts.',
      },
      {
        name: 'Breaking Swipe',
        type: 'Dragon',
        category: 'Physical',
        power: 60,
        accuracy: 100,
        pp: 15,
        effect: 'Hits both opponents. Lowers Attack by 1',
        strategyNote: 'Great doubles utility. Lowers both opponents Attack while dealing spread damage.',
      },
      {
        name: 'Dragon Darts',
        type: 'Dragon',
        category: 'Physical',
        power: 50,
        accuracy: 100,
        pp: 10,
        effect: 'Hits twice. In doubles, can hit each opponent once',
        strategyNote: 'Dragapult signature move. Two hits break Focus Sash and Substitutes.',
      },
      {
        name: 'Glaive Rush',
        type: 'Dragon',
        category: 'Physical',
        power: 120,
        accuracy: 100,
        pp: 5,
        effect: 'User takes double damage next turn and cannot dodge',
        strategyNote: 'Massive risk/reward. Only use if you can KO the opponent or plan to switch out.',
      },
      {
        name: 'Spacial Rend',
        type: 'Dragon',
        category: 'Special',
        power: 100,
        accuracy: 95,
        pp: 5,
        effect: 'High critical hit ratio',
        strategyNote: 'Palkia signature move. High crit rate makes it statistically very strong.',
      },
      {
        name: 'Roar of Time',
        type: 'Dragon',
        category: 'Special',
        power: 150,
        accuracy: 90,
        pp: 5,
        effect: 'User must recharge next turn',
        strategyNote: 'Dialga signature. Maximum power but recharge turn is exploitable. Use sparingly.',
      },
      {
        name: 'Clanging Scales',
        type: 'Dragon',
        category: 'Special',
        power: 110,
        accuracy: 100,
        pp: 5,
        effect: 'Lowers user Defense by 1 stage',
        strategyNote: 'Kommo-o signature. Strong spread move but makes you physically fragile.',
      },
      {
        name: 'Core Enforcer',
        type: 'Dragon',
        category: 'Special',
        power: 100,
        accuracy: 100,
        pp: 10,
        effect: 'Suppresses target ability if it already moved',
        strategyNote: 'Zygarde signature. Ability suppression is situationally powerful in competitive play.',
      },
      {
        name: 'Dragon Energy',
        type: 'Dragon',
        category: 'Special',
        power: 150,
        accuracy: 100,
        pp: 5,
        effect: 'Power decreases as user HP decreases',
        strategyNote: 'Best used at full HP. Devastating in doubles with Tailwind or speed control support.',
      },
    ];

    // Translate move effects to Vietnamese during seeding
    const translatedMovesData = await Promise.all(
      movesData.map(async (m) => {
        const effectVi = m.effect ? await translationService.translate(m.effect, 'move') : '';
        return {
          ...m,
          effectVi,
        };
      })
    );

    const moves = await Move.create(translatedMovesData);
    console.log(`⚔️  Created ${moves.length} Dragon-type moves`);

    // Build a quick lookup: move name -> move document
    const moveMap = {};
    for (const m of moves) {
      moveMap[m.name] = m;
    }

    // -----------------------------------------------------------------------
    // 4. Create 9 Pokémon
    // -----------------------------------------------------------------------
    const pokemonData = [
      {
        name: 'Dragonite',
        imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/149.png',
        primaryType: 'Dragon',
        secondaryType: 'Flying',
        ability: 'Multiscale',
        stats: { hp: 91, attack: 134, defense: 95, spAtk: 100, spDef: 100, speed: 80 },
        role: 'Physical Attacker',
        moveNames: ['Dragon Dance', 'Dragon Claw', 'Outrage', 'Dragon Tail', 'Dragon Rush', 'Dragon Breath'],
        pvpMoveset: 'Dragon Dance + Dragon Claw / Outrage with Extreme Speed and Earthquake coverage',
        strategyNote: 'Multiscale guarantees a Dragon Dance setup. After one boost, Dragonite sweeps with STAB Outrage or Dragon Claw. Pair with Heal Bell support to cure Outrage confusion.',
      },
      {
        name: 'Garchomp',
        imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/445.png',
        primaryType: 'Dragon',
        secondaryType: 'Ground',
        ability: 'Rough Skin',
        stats: { hp: 108, attack: 130, defense: 95, spAtk: 80, spDef: 85, speed: 102 },
        role: 'Sweeper',
        moveNames: ['Dragon Claw', 'Outrage', 'Scale Shot', 'Dragon Tail', 'Breaking Swipe', 'Draco Meteor'],
        pvpMoveset: 'Scale Shot / Dragon Claw + Earthquake + Swords Dance for physical sweeping',
        strategyNote: 'Base 102 Speed tier is critical in competitive play. Scale Shot boosts Speed further for cleaning late-game. Rough Skin punishes physical attackers on contact.',
      },
      {
        name: 'Latios',
        imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/381.png',
        primaryType: 'Dragon',
        secondaryType: 'Psychic',
        ability: 'Levitate',
        stats: { hp: 80, attack: 90, defense: 80, spAtk: 130, spDef: 110, speed: 110 },
        role: 'Special Attacker',
        moveNames: ['Draco Meteor', 'Dragon Pulse', 'Dragon Breath', 'Dragon Energy'],
        pvpMoveset: 'Draco Meteor + Psyshock + Surf + Recover for offensive pivot',
        strategyNote: 'Levitate provides Ground immunity. Fast special attacker that excels as a hit-and-run with Draco Meteor. Choice Specs set hits extremely hard.',
      },
      {
        name: 'Latias',
        imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/380.png',
        primaryType: 'Dragon',
        secondaryType: 'Psychic',
        ability: 'Levitate',
        stats: { hp: 80, attack: 80, defense: 90, spAtk: 110, spDef: 130, speed: 110 },
        role: 'Support',
        moveNames: ['Dragon Pulse', 'Draco Meteor', 'Dragon Breath', 'Breaking Swipe'],
        pvpMoveset: 'Calm Mind + Dragon Pulse + Recover + Thunderbolt for bulky setup',
        strategyNote: 'Specially bulky Dragon with Recover. Acts as a Calm Mind sweeper or defensive pivot. Levitate gives valuable Ground immunity for team support.',
      },
      {
        name: 'Salamence',
        imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/373.png',
        primaryType: 'Dragon',
        secondaryType: 'Flying',
        ability: 'Intimidate',
        stats: { hp: 95, attack: 135, defense: 80, spAtk: 110, spDef: 80, speed: 100 },
        role: 'Sweeper',
        moveNames: ['Dragon Dance', 'Outrage', 'Dragon Claw', 'Draco Meteor', 'Dragon Tail'],
        pvpMoveset: 'Dragon Dance + Outrage / Dragon Claw + Earthquake + Fire Blast for mixed sweeping',
        strategyNote: 'Intimidate provides a free Attack drop on switch-in. Dragon Dance sets are terrifying. Can also run a mixed set with Draco Meteor + physical coverage.',
      },
      {
        name: 'Hydreigon',
        imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/635.png',
        primaryType: 'Dark',
        secondaryType: 'Dragon',
        ability: 'Levitate',
        stats: { hp: 92, attack: 105, defense: 90, spAtk: 125, spDef: 90, speed: 98 },
        role: 'Special Attacker',
        moveNames: ['Draco Meteor', 'Dragon Pulse', 'Breaking Swipe', 'Dragon Tail', 'Dragon Rush'],
        pvpMoveset: 'Draco Meteor + Dark Pulse + Flash Cannon + Nasty Plot for wallbreaking',
        strategyNote: 'Dark/Dragon provides unique STAB coverage. Levitate grants Ground immunity. Nasty Plot sets can blow through teams. Fairy 4× weakness is the main drawback.',
      },
      {
        name: 'Dragapult',
        imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/887.png',
        primaryType: 'Dragon',
        secondaryType: 'Ghost',
        ability: 'Clear Body',
        stats: { hp: 88, attack: 120, defense: 75, spAtk: 100, spDef: 75, speed: 142 },
        role: 'Sweeper',
        moveNames: ['Dragon Darts', 'Dragon Dance', 'Dragon Claw', 'Draco Meteor', 'Dragon Breath', 'Breaking Swipe'],
        pvpMoveset: 'Dragon Darts + Phantom Force + Dragon Dance + Sucker Punch for physical sweeping',
        strategyNote: 'Blazing 142 base Speed makes it one of the fastest non-legendary Pokémon. Dragon/Ghost STAB is excellent offensively. Can run physical, special, or mixed sets effectively.',
      },
      {
        name: 'Baxcalibur',
        imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/998.png',
        primaryType: 'Dragon',
        secondaryType: 'Ice',
        ability: 'Thermal Exchange',
        stats: { hp: 115, attack: 145, defense: 92, spAtk: 75, spDef: 86, speed: 87 },
        role: 'Physical Attacker',
        moveNames: ['Dragon Claw', 'Glaive Rush', 'Outrage', 'Dragon Dance', 'Scale Shot', 'Dragon Tail'],
        pvpMoveset: 'Dragon Dance + Glaive Rush / Dragon Claw + Icicle Crash + Earthquake for setup sweeping',
        strategyNote: 'Thermal Exchange boosts Attack when hit by Fire moves, turning a weakness into power. Dragon Dance + Glaive Rush is devastating. Dragon/Ice coverage is nearly unresisted.',
      },
      {
        name: 'Rayquaza',
        imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/384.png',
        primaryType: 'Dragon',
        secondaryType: 'Flying',
        ability: 'Air Lock',
        stats: { hp: 105, attack: 150, defense: 90, spAtk: 150, spDef: 90, speed: 95 },
        role: 'Sweeper',
        moveNames: ['Dragon Dance', 'Outrage', 'Dragon Claw', 'Draco Meteor', 'Dragon Pulse', 'Dragon Tail', 'Dragon Breath', 'Breaking Swipe'],
        pvpMoveset: 'Dragon Dance + Dragon Ascent + Outrage + Extreme Speed for physical sweeping',
        strategyNote: 'Legendary powerhouse with 150 in both attacking stats. Air Lock negates weather. Dragon Dance set is nearly uncounterable at +1. Can run both physical and special sets with equal effectiveness.',
      },
    ];

    // Create Pokémon documents (without moves initially to get IDs)
    const createdPokemon = [];
    for (const pData of pokemonData) {
      const { moveNames, ...pokeFields } = pData;

      // Resolve move names to ObjectIds
      const moveIds = moveNames
        .map((name) => moveMap[name]?._id)
        .filter(Boolean);

      const pokemon = await Pokemon.create({
        ...pokeFields,
        moves: moveIds,
      });

      createdPokemon.push({ pokemon, moveNames });
    }
    console.log(`🐉 Created ${createdPokemon.length} Pokémon`);

    // -----------------------------------------------------------------------
    // 5. Update Move.pokemonLearned with the Pokémon that learn each move
    // -----------------------------------------------------------------------
    // Build a map: moveId -> [pokemonIds]
    const movePokemonMap = {};
    for (const { pokemon, moveNames } of createdPokemon) {
      for (const moveName of moveNames) {
        const move = moveMap[moveName];
        if (move) {
          if (!movePokemonMap[move._id.toString()]) {
            movePokemonMap[move._id.toString()] = [];
          }
          movePokemonMap[move._id.toString()].push(pokemon._id);
        }
      }
    }

    // Update each move with the pokemonLearned array
    const moveUpdatePromises = Object.entries(movePokemonMap).map(
      ([moveId, pokemonIds]) =>
        Move.findByIdAndUpdate(moveId, { pokemonLearned: pokemonIds })
    );
    await Promise.all(moveUpdatePromises);
    console.log('🔗 Updated move ↔ Pokémon references');

    // -----------------------------------------------------------------------
    // Done
    // -----------------------------------------------------------------------
    console.log('\n✅ Seed completed successfully!');
    console.log('─'.repeat(50));
    console.log(`   Users:   ${users.length}`);
    console.log(`   Moves:   ${moves.length}`);
    console.log(`   Pokémon: ${createdPokemon.length}`);
    console.log('─'.repeat(50));
    console.log('Admin login:   admin@pokedex.com / admin123');
    console.log('Trainer login: trainer@pokedex.com / trainer123');

    await mongoose.disconnect();
    console.log('\n🔌 MongoDB disconnected');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedDB();
