import axios from 'axios';
import Translation from '../models/Translation.js';

// ─── Vietnamese Dictionary for Pokémon Game Terms ────────────────────────────
const DICT = {
  // Pronouns / subjects
  'the user': 'người dùng',
  'the target': 'mục tiêu',
  'the foe': 'đối thủ',
  'the opponent': 'đối thủ',
  'its target': 'mục tiêu',
  'all adjacent foes': 'tất cả đối thủ lân cận',
  'all adjacent opponents': 'tất cả đối thủ lân cận',
  'both opponents': 'cả hai đối thủ',
  'opposing pokémon': 'Pokémon đối phương',
  'all opposing pokémon': 'tất cả Pokémon đối phương',
  'all pokémon': 'tất cả Pokémon',
  'the ally': 'đồng minh',

  // Stats
  'attack stat': 'chỉ số Tấn Công',
  'defense stat': 'chỉ số Phòng Thủ',
  'sp. atk stat': 'chỉ số Tấn Công Đặc Biệt',
  'sp. def stat': 'chỉ số Phòng Thủ Đặc Biệt',
  'special attack': 'Tấn Công Đặc Biệt',
  'special defense': 'Phòng Thủ Đặc Biệt',
  'speed stat': 'chỉ số Tốc Độ',
  attack: 'Tấn Công',
  defense: 'Phòng Thủ',
  speed: 'Tốc Độ',
  'sp. atk': 'Tấn Công Đặc Biệt',
  'sp. def': 'Phòng Thủ Đặc Biệt',
  hp: 'HP',
  accuracy: 'Độ Chính Xác',
  evasion: 'Né Tránh',
  evasiveness: 'Né Tránh',
  'critical-hit ratio': 'tỷ lệ đòn chí mạng',
  'critical hit ratio': 'tỷ lệ đòn chí mạng',
  'critical hits': 'đòn chí mạng',
  'critical hit': 'đòn chí mạng',

  // Stat modifiers
  sharply: 'mạnh',
  'harshly lowers': 'giảm mạnh',
  'sharply raises': 'tăng mạnh',
  'sharply lowers': 'giảm mạnh',
  raises: 'tăng',
  lowers: 'giảm',
  restores: 'hồi phục',
  recovers: 'hồi phục',
  heals: 'hồi phục',
  boosts: 'tăng cường',
  'by one stage': '1 cấp',
  'by two stages': '2 cấp',
  'by 1 stage': '1 cấp',
  'by 2 stages': '2 cấp',
  'one stage': '1 cấp',
  'two stages': '2 cấp',

  // Status conditions
  paralysis: 'tê liệt',
  paralyzed: 'tê liệt',
  paralyze: 'gây tê liệt',
  poisoned: 'nhiễm độc',
  poison: 'nhiễm độc',
  'badly poisoned': 'nhiễm độc nặng',
  burned: 'bỏng',
  burn: 'bỏng',
  frozen: 'đóng băng',
  freeze: 'đóng băng',
  sleep: 'ngủ',
  asleep: 'ngủ',
  confused: 'hỗn loạn',
  confusion: 'hỗn loạn',
  flinch: 'giật mình',
  flinching: 'giật mình',
  infatuation: 'mê hoặc',
  attracted: 'bị mê hoặc',

  // Actions
  attacks: 'tấn công',
  damages: 'gây sát thương',
  hits: 'đánh trúng',
  strikes: 'tấn công',
  'deals damage': 'gây sát thương',
  'inflicts damage': 'gây sát thương',
  'causes damage': 'gây sát thương',
  charges: 'tích năng lượng',
  protects: 'bảo vệ',
  shields: 'tạo khiên',
  absorbs: 'hấp thụ',
  drains: 'hút',

  // Move mechanics
  'no additional effect': 'Không có hiệu ứng bổ sung.',
  'has no additional effect': 'Không có hiệu ứng bổ sung.',
  'has a chance': 'có khả năng',
  'may cause': 'có thể gây',
  'may also': 'cũng có thể',
  'may lower': 'có thể giảm',
  'may raise': 'có thể tăng',
  recoil: 'sát thương phản hồi',
  'recoil damage': 'sát thương phản hồi',
  'the user takes recoil damage': 'người dùng nhận sát thương phản hồi',
  recharge: 'hồi sức',
  'must recharge': 'phải hồi sức',
  'user must recharge': 'người dùng phải hồi sức',
  'next turn': 'lượt tiếp theo',
  'on the next turn': 'vào lượt tiếp theo',
  'for 2-3 turns': 'trong 2-3 lượt',
  'for 2 to 3 turns': 'trong 2-3 lượt',
  'for 4-5 turns': 'trong 4-5 lượt',
  'for five turns': 'trong 5 lượt',
  'each turn': 'mỗi lượt',
  'every turn': 'mỗi lượt',
  'this turn': 'lượt này',
  'in battle': 'trong trận đấu',
  'switches out': 'rút lui',
  'switch out': 'rút lui',
  'hits 2-5 times': 'đánh trúng 2-5 lần',
  'hits twice': 'đánh trúng 2 lần',
  'hits 2 times': 'đánh trúng 2 lần',
  'first turn': 'lượt đầu tiên',
  'second turn': 'lượt thứ hai',
  'power doubles': 'sức mạnh tăng gấp đôi',
  'power increases': 'sức mạnh tăng',
  'priority move': 'đòn ưu tiên',
  'always goes first': 'luôn đánh trước',
  'never misses': 'không bao giờ trượt',
  'ignores': 'bỏ qua',

  // Weather
  rain: 'mưa',
  'rain dance': 'Vũ Điệu Mưa',
  sunny: 'nắng',
  'harsh sunlight': 'ánh nắng gay gắt',
  sunshine: 'ánh nắng',
  sandstorm: 'bão cát',
  hail: 'mưa đá',
  snow: 'tuyết',
  weather: 'thời tiết',

  // Types as descriptive words
  'normal-type': 'hệ Thường',
  'fire-type': 'hệ Lửa',
  'water-type': 'hệ Nước',
  'electric-type': 'hệ Điện',
  'grass-type': 'hệ Cỏ',
  'ice-type': 'hệ Băng',
  'fighting-type': 'hệ Cách Đấu',
  'poison-type': 'hệ Độc',
  'ground-type': 'hệ Đất',
  'flying-type': 'hệ Bay',
  'psychic-type': 'hệ Siêu Năng',
  'bug-type': 'hệ Bọ',
  'rock-type': 'hệ Đá',
  'ghost-type': 'hệ Ma',
  'dragon-type': 'hệ Rồng',
  'dark-type': 'hệ Bóng Tối',
  'steel-type': 'hệ Thép',
  'fairy-type': 'hệ Tiên',
  'physical moves': 'chiêu thức vật lý',
  'special moves': 'chiêu thức đặc biệt',
  'status moves': 'chiêu thức trạng thái',

  // General combat
  opponent: 'đối thủ',
  target: 'mục tiêu',
  user: 'người dùng',
  ally: 'đồng minh',
  damage: 'sát thương',
  move: 'chiêu thức',
  ability: 'đặc tính',
  item: 'vật phẩm',
  held: 'đang giữ',
  contact: 'tiếp xúc',
  'makes contact': 'tiếp xúc',
  turn: 'lượt',
  turns: 'lượt',
  battle: 'trận đấu',
  fainted: 'ngất',
  faints: 'ngất',
  knocked: 'bị đánh bại',
  'super effective': 'siêu hiệu quả',
  'not very effective': 'không hiệu quả lắm',
  effective: 'hiệu quả',
  immune: 'miễn nhiễm',
  'no effect': 'không có hiệu quả',
  resistant: 'kháng',
  weakness: 'điểm yếu',
  strength: 'điểm mạnh',
};

// ─── Type name translations ─────────────────────────────────────────────────
const TYPE_TRANSLATIONS = {
  normal: 'Thường',
  fire: 'Lửa',
  water: 'Nước',
  electric: 'Điện',
  grass: 'Cỏ',
  ice: 'Băng',
  fighting: 'Cách Đấu',
  poison: 'Độc',
  ground: 'Đất',
  flying: 'Bay',
  psychic: 'Siêu Năng',
  bug: 'Bọ',
  rock: 'Đá',
  ghost: 'Ma',
  dragon: 'Rồng',
  dark: 'Bóng Tối',
  steel: 'Thép',
  fairy: 'Tiên',
};

// ─── Damage relation labels ─────────────────────────────────────────────────
const RELATION_LABELS = {
  double_damage_from: 'Yếu với',
  double_damage_to: 'Mạnh với',
  half_damage_from: 'Kháng',
  half_damage_to: 'Không hiệu quả với',
  no_damage_from: 'Miễn nhiễm từ',
  no_damage_to: 'Không có tác dụng với',
};

// ─── Translation Engine ─────────────────────────────────────────────────────

/**
 * Call public Google Translate API.
 */
async function googleTranslate(text) {
  try {
    const response = await axios.get(
      'https://translate.googleapis.com/translate_a/single',
      {
        params: {
          client: 'gtx',
          sl: 'en',
          tl: 'vi',
          dt: 't',
          q: text,
        },
        timeout: 5000,
      }
    );

    if (response.data && Array.isArray(response.data[0])) {
      return response.data[0]
        .map((x) => x && x[0])
        .filter(Boolean)
        .join('')
        .trim();
    }
  } catch (error) {
    console.error('Google Translate API error:', error.message);
  }
  return null;
}

/**
 * Translate English text to Vietnamese using Google Translate and a dictionary fallback.
 * 1. Check MongoDB cache
 * 2. Check exact dictionary match
 * 3. Call Google Translate (for phrases/sentences) + post-process with dictionary
 * 4. Fallback to dictionary-only translation
 * 5. Save to MongoDB cache
 */
async function translate(text, category = 'general') {
  if (!text || text.trim() === '') return '';

  const cleanText = text.trim();

  // 1. Check MongoDB cache
  try {
    const cached = await Translation.findOne({
      originalText: cleanText,
      category,
    });
    if (cached) return cached.vietnameseText;
  } catch {
    // Continue without cache
  }

  // 2. Exact match in DICT dictionary (case-insensitive)
  const dictKey = cleanText.toLowerCase();
  const exactMatch = Object.keys(DICT).find(
    (key) => key.toLowerCase() === dictKey
  );

  let translated = '';
  if (exactMatch) {
    translated = DICT[exactMatch];
  } else if (cleanText.includes(' ') || cleanText.length > 10) {
    // 3. For sentence/phrase level translations, try Google Translate
    const gTrans = await googleTranslate(cleanText);
    if (gTrans) {
      // Post-process with local dictionary overrides to ensure game terms (e.g. Sp. Atk) are translated/capitalized correctly
      translated = dictionaryTranslate(gTrans);
    }
  }

  // 4. Fallback to dictionary translation
  if (!translated) {
    translated = dictionaryTranslate(cleanText);
  }

  // 5. Save to MongoDB cache
  try {
    await Translation.findOneAndUpdate(
      { originalText: cleanText, category },
      { vietnameseText: translated, category },
      { upsert: true, new: true }
    );
  } catch {
    // Non-critical, continue
  }

  return translated;
}

/**
 * Dictionary-based translation with pattern matching.
 */
function dictionaryTranslate(text) {
  let result = text;

  // Sort dictionary entries by length (longest first) for greedy matching
  const entries = Object.entries(DICT).sort(
    (a, b) => b[0].length - a[0].length
  );

  for (const [eng, vi] of entries) {
    const regex = new RegExp(eng.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    result = result.replace(regex, vi);
  }

  return result;
}

/**
 * Get Vietnamese type name.
 */
function translateTypeName(type) {
  if (!type) return '';
  return TYPE_TRANSLATIONS[type.toLowerCase()] || type;
}

/**
 * Translate damage relations to Vietnamese labels.
 */
function translateDamageRelation(key) {
  return RELATION_LABELS[key] || key;
}

/**
 * Extract and translate the best English flavor text / effect entry from PokeAPI.
 */
function getEnglishText(entries, key = 'flavor_text') {
  if (!entries || !Array.isArray(entries)) return '';
  const en = entries.find(
    (e) => e.language?.name === 'en'
  );
  return en ? (en[key] || en.flavor_text || en.effect || '').replace(/\n|\f/g, ' ').trim() : '';
}

/**
 * Try to get Vietnamese text from PokeAPI first, fallback to translated English.
 */
async function getTranslatedText(entries, category, key = 'flavor_text') {
  if (!entries || !Array.isArray(entries)) return '';

  // Try Vietnamese first (PokeAPI may have it in some entries)
  // PokeAPI does not have Vietnamese, so go to English -> translate
  const englishText = getEnglishText(entries, key);
  if (!englishText) return '';

  return translate(englishText, category);
}

const translationService = {
  translate,
  translateTypeName,
  translateDamageRelation,
  getEnglishText,
  getTranslatedText,
  TYPE_TRANSLATIONS,
  RELATION_LABELS,
};

export default translationService;
