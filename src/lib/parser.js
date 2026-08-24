/**
 * Rule-based intent/item/quantity parser for voice commands.
 *
 * Returns: { intent, item, quantity, unit, confidence }
 * intent: 'add' | 'remove' | 'search' | 'check' | 'unknown'
 * confidence: 'high' | 'low'
 */

// Spoken filler words that the recognition engine commonly produces — stripped before matching
const FILLER_RE = /\b(um+|uh+|er+|hmm+|like|you know|okay|ok|so|well|right|actually|basically)\b,?\s*/gi;

const ADD_PATTERNS = [
  /^(?:please\s+)?add\s+(.+)$/i,
  /^i\s+need\s+(.+)$/i,
  /^i\s+want\s+(?:to\s+buy\s+)?(.+)$/i,
  /^(?:can\s+you\s+|could\s+you\s+)?put\s+(.+)\s+(?:on|in)\s+(?:the\s+)?(?:list|cart)$/i,
  /^(?:get\s+|grab\s+)(.+)$/i,
  /^(?:buy\s+)(.+)$/i,
  /^(?:we\s+need\s+)(.+)$/i,
  // Natural "out of" phrasings
  /^(?:i(?:'m|\s+am)\s+)?(?:running\s+)?out\s+of\s+(.+)$/i,
  /^(?:we(?:'re|\s+are)\s+)?(?:running\s+)?out\s+of\s+(.+)$/i,
  /^(?:i\s+)?ran\s+out\s+of\s+(.+)$/i,
  /^we\s+ran\s+out\s+of\s+(.+)$/i,
  // Reminder / intention phrasings
  /^remind\s+me\s+to\s+(?:get|buy|pick\s+up)\s+(.+)$/i,
  /^i\s+should\s+(?:get|buy|grab|pick\s+up)\s+(.+)$/i,
  /^(?:please\s+)?(?:can\s+you\s+)?add\s+(.+)\s+(?:to\s+(?:the\s+)?(?:list|cart))$/i,
  /^pick\s+up\s+(.+)$/i,
  // Hinglish — common spoken patterns used in Indian households
  /^(.+)\s+lana\s+hai$/i,         // "doodh lana hai" → add doodh
  /^(.+)\s+chahiye$/i,            // "anda chahiye" → add anda
  /^(.+)\s+le\s+lo$/i,            // "chawal le lo" → add chawal
  /^(.+)\s+lelo$/i,               // "namak lelo" → add namak
  /^(.+)\s+add\s+karo$/i,        // "milk add karo" → add milk
  /^(.+)\s+kharidna\s+hai$/i,    // "ghee kharidna hai" → add ghee
  /^(.+)\s+leke\s+aao$/i,        // "sabzi leke aao" → add sabzi
  /^(.+)\s+mangao$/i,            // "eggs mangao" → add eggs
  /^(.+)\s+laana\s+hai$/i,       // "dahi laana hai" → add dahi
];

const REMOVE_PATTERNS = [
  /^(?:please\s+)?remove\s+(.+)$/i,
  /^delete\s+(.+)$/i,
  /^take\s+(?:off\s+)?(.+?)(?:\s+off(?:\s+the\s+list)?)?$/i,
  /^(?:i\s+don'?t\s+need\s+)(.+?)(?:\s+anymore)?$/i,
  /^cross\s+off\s+(.+)$/i,
  /^drop\s+(.+?)(?:\s+from\s+(?:the\s+)?(?:list|cart))?$/i,
  /^(?:cancel|scratch)\s+(.+)$/i,
  // Hinglish remove patterns
  /^(.+)\s+hatao$/i,              // "chips hatao" → remove chips
  /^(.+)\s+hata\s+do$/i,         // "bread hata do" → remove bread
  /^(.+)\s+nikal\s+do$/i,        // "milk nikal do" → remove milk
  /^(.+)\s+nahi\s+chahiye$/i,    // "butter nahi chahiye" → remove butter
  /^(.+)\s+mat\s+lana$/i,        // "chips mat lana" → remove chips
];

const SEARCH_PATTERNS = [
  /^(?:please\s+)?search\s+(?:for\s+)?(.+)$/i,
  /^find\s+(?:me\s+)?(.+)$/i,
  /^look\s+(?:for\s+|up\s+)(.+)$/i,
  /^where\s+is\s+(.+)$/i,
  /^do\s+(?:i\s+|we\s+)?have\s+(.+)$/i,
  /^show\s+(?:me\s+)?(.+)$/i,
  /^(.+)\s+(?:dhundo|khojo|search\s+karo)$/i,
];

const CHECK_PATTERNS = [
  /^(?:check\s+(?:off\s+)?)(.+)$/i,
  /^(?:i\s+(?:already\s+)?)?(?:got|have|bought)\s+(.+)$/i,
  /^mark\s+(.+?)\s+(?:as\s+)?(?:done|bought|complete|checked)$/i,
  /^done\s+with\s+(.+)$/i,
  /^(?:i\s+)?(?:picked\s+up|finished|used\s+(?:up\s+)?(?:the\s+last\s+)?)(.+)$/i,
  // Hinglish check patterns
  /^(.+)\s+(?:ho\s+gaya|mil\s+gaya|aa\s+gaya|aa\s+gayi|ho\s+gayi|mil\s+gayi)$/i, // "doodh aa gaya"
  /^(.+)\s+le\s+liya$/i,         // "eggs le liya" → check eggs
  /^(.+)\s+kharida$/i,           // "chawal kharida" → check chawal
  /^(.+)\s+kharidi$/i,           // "sabzi kharidi" (feminine) → check sabzi
];

// Quantity: "2", "two", "a couple of", "a dozen", etc.
// Includes Hindi number words for Hinglish commands
const NUMBER_WORDS = {
  one: 1, two: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12,
  'a couple': 2, 'a couple of': 2, 'a dozen': 12, 'a few': 3,
  half: 0.5, 'half a': 0.5,
  // Hindi numerals (Hinglish voice commands)
  ek: 1, do: 2, teen: 3, paanch: 5,
  chhe: 6, saat: 7, aath: 8, nau: 9, das: 10,
};

// Common units to strip from item name after quantity extraction.
// Includes Indian units: kilo, paav (250g).
const UNITS = [
  'bottle', 'bottles', 'can', 'cans', 'bag', 'bags', 'box', 'boxes',
  'pack', 'packs', 'package', 'packages', 'piece', 'pieces', 'slice', 'slices',
  'loaf', 'loaves', 'bunch', 'bunches', 'head', 'heads', 'jar', 'jars',
  'carton', 'cartons', 'liter', 'liters', 'litre', 'litres', 'gallon', 'gallons',
  'pound', 'pounds', 'lb', 'lbs', 'oz', 'ounce', 'ounces', 'kg', 'gram', 'grams',
  'dozen', 'dozens', 'cup', 'cups', 'sachet', 'sachets', 'tub', 'tubs',
  'strip', 'strips', 'roll', 'rolls', 'sheet', 'sheets',
  // Indian units
  'kilo', 'kilos',           // colloquial for kg
  'paav', 'pao', 'paao',    // 250g (quarter kg), commonly used in Indian markets
  'peti', 'petis',           // crate, used for bulk vegetables
];

/**
 * Strips spoken filler words ("um", "uh", "like", etc.) that the speech engine
 * sometimes inserts at the start or middle of a transcript.
 */
function stripFillers(text) {
  return text.replace(FILLER_RE, ' ').replace(/\s{2,}/g, ' ').trim();
}

function tryMatch(patterns, text) {
  for (const pattern of patterns) {
    const m = text.match(pattern);
    if (m) return m[1].trim();
  }
  return null;
}

function extractQuantity(text) {
  // Try word numbers first (longer phrases first to avoid partial matches)
  const sortedWords = Object.keys(NUMBER_WORDS).sort((a, b) => b.length - a.length);
  for (const word of sortedWords) {
    const re = new RegExp(`^${word}\\s+`, 'i');
    if (re.test(text)) {
      return {
        quantity: NUMBER_WORDS[word],
        remainder: text.replace(re, '').trim(),
      };
    }
  }

  // Numeric: "2", "2.5"
  const numericMatch = text.match(/^(\d+(?:\.\d+)?)\s+/);
  if (numericMatch) {
    return {
      quantity: parseFloat(numericMatch[1]),
      remainder: text.slice(numericMatch[0].length).trim(),
    };
  }

  return { quantity: 1, remainder: text };
}

function stripLeadingUnit(text) {
  const unitRe = new RegExp(
    `^(${UNITS.join('|')})\\s+(?:of\\s+)?`,
    'i'
  );
  const m = text.match(unitRe);
  if (m) {
    return { unit: m[1].toLowerCase(), item: text.slice(m[0].length).trim() };
  }
  return { unit: null, item: text };
}

function stripArticles(text) {
  return text.replace(/^(a|an|the|some)\s+/i, '').trim();
}

function extractPriceLimit(text) {
  // Matches "under 200", "below 150", "under ₹100", "under $5", "under 100 rupees", "less than 200", "under 200 rs", "within 200", "ke andar 200"
  const priceRe = /\s+(?:under|below|less\s+than|within|cheaper\s+than|ke\s+andar)\s+(?:₹|\$|rs\.?|inr)?\s*(\d+(?:\.\d+)?)(?:\s*(?:₹|\$|rs\.?|inr|rupees|bucks|dollars))?$/i;
  const m = text.match(priceRe);
  if (m) {
    const maxPrice = parseFloat(m[1]);
    const item = text.slice(0, m.index).trim();
    return { item, maxPrice };
  }
  return { item: text, maxPrice: null };
}

export function parse(rawText) {
  if (!rawText || rawText.trim().length === 0) {
    return { intent: 'unknown', item: null, maxPrice: null, quantity: 1, unit: null, confidence: 'low' };
  }

  // Normalize whitespace and strip spoken filler words before pattern matching
  const text = stripFillers(rawText.trim().replace(/\s+/g, ' '));

  // Check REMOVE before ADD so Hinglish negation patterns (e.g. "X nahi chahiye")
  // are not accidentally captured by the broader ADD "X chahiye" pattern.
  let rawItem = tryMatch(REMOVE_PATTERNS, text);
  if (rawItem) {
    const clean = stripArticles(rawItem);
    return { intent: 'remove', item: clean, maxPrice: null, quantity: 1, unit: null, confidence: 'high' };
  }

  rawItem = tryMatch(ADD_PATTERNS, text);
  if (rawItem) {
    // Strip articles before quantity/unit extraction so "a loaf of bread" works correctly
    const articleStripped = stripArticles(rawItem);
    const { quantity, remainder } = extractQuantity(articleStripped);
    const { unit, item } = stripLeadingUnit(remainder);
    return {
      intent: 'add',
      item: stripArticles(item),
      maxPrice: null,
      quantity,
      unit,
      confidence: 'high',
    };
  }

  rawItem = tryMatch(SEARCH_PATTERNS, text);
  if (rawItem) {
    const { item, maxPrice } = extractPriceLimit(rawItem);
    const clean = stripArticles(item);
    return { intent: 'search', item: clean, maxPrice, quantity: 1, unit: null, confidence: 'high' };
  }

  rawItem = tryMatch(CHECK_PATTERNS, text);
  if (rawItem) {
    const clean = stripArticles(rawItem);
    return { intent: 'check', item: clean, maxPrice: null, quantity: 1, unit: null, confidence: 'high' };
  }

  // No intent matched — return low confidence so the UI can ask for clarification
  return {
    intent: 'unknown',
    item: text.length > 2 ? text : null,
    maxPrice: null,
    quantity: 1,
    unit: null,
    confidence: 'low',
  };
}
