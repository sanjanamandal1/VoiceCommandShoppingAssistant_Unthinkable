/**
 * Rule-based intent/item/quantity parser for voice commands.
 *
 * Returns: { intent, item, quantity, unit, confidence }
 * intent: 'add' | 'remove' | 'search' | 'check' | 'unknown'
 * confidence: 'high' | 'low'
 */

const ADD_PATTERNS = [
  /^(?:please\s+)?add\s+(.+)$/i,
  /^i\s+need\s+(.+)$/i,
  /^i\s+want\s+(?:to\s+buy\s+)?(.+)$/i,
  /^(?:can\s+you\s+)?put\s+(.+)\s+(?:on|in)\s+(?:the\s+)?(?:list|cart)$/i,
  /^(?:get\s+|grab\s+)(.+)$/i,
  /^(?:buy\s+)(.+)$/i,
  /^(?:we\s+need\s+)(.+)$/i,
];

const REMOVE_PATTERNS = [
  /^(?:please\s+)?remove\s+(.+)$/i,
  /^delete\s+(.+)$/i,
  /^take\s+(?:off\s+|out\s+)?(.+)(?:\s+off)?(?:\s+the\s+list)?$/i,
  /^(?:i\s+don'?t\s+need\s+)(.+)(?:\s+anymore)?$/i,
  /^cross\s+off\s+(.+)$/i,
];

const SEARCH_PATTERNS = [
  /^(?:search\s+(?:for\s+)?)(.+)$/i,
  /^find\s+(.+)$/i,
  /^look\s+(?:for\s+|up\s+)(.+)$/i,
  /^where\s+is\s+(.+)$/i,
  /^do\s+(?:i\s+|we\s+)?have\s+(.+)$/i,
  /^show\s+(?:me\s+)?(.+)$/i,
];

const CHECK_PATTERNS = [
  /^(?:check\s+(?:off\s+)?)(.+)$/i,
  /^(?:i\s+(?:already\s+)?)?(?:got|have|bought)\s+(.+)$/i,
  /^mark\s+(.+)\s+(?:as\s+)?(?:done|bought|complete|checked)$/i,
  /^done\s+with\s+(.+)$/i,
];

// Quantity: "2", "two", "a couple of", "a dozen", etc.
const NUMBER_WORDS = {
  one: 1, two: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  'a couple': 2, 'a couple of': 2, 'a dozen': 12, 'a few': 3,
  half: 0.5, 'half a': 0.5,
};

// Common units to strip from item name after quantity extraction
const UNITS = [
  'bottle', 'bottles', 'can', 'cans', 'bag', 'bags', 'box', 'boxes',
  'pack', 'packs', 'package', 'packages', 'piece', 'pieces', 'slice', 'slices',
  'loaf', 'loaves', 'bunch', 'bunches', 'head', 'heads', 'jar', 'jars',
  'carton', 'cartons', 'liter', 'liters', 'litre', 'litres', 'gallon', 'gallons',
  'pound', 'pounds', 'lb', 'lbs', 'oz', 'ounce', 'ounces', 'kg', 'gram', 'grams',
  'dozen', 'dozens', 'cup', 'cups',
];

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

export function parse(rawText) {
  if (!rawText || rawText.trim().length === 0) {
    return { intent: 'unknown', item: null, quantity: 1, unit: null, confidence: 'low' };
  }

  const text = rawText.trim().replace(/\s+/g, ' ');

  let rawItem = tryMatch(ADD_PATTERNS, text);
  if (rawItem) {
    // Strip articles before quantity/unit extraction so "a loaf of bread" works correctly
    const articleStripped = stripArticles(rawItem);
    const { quantity, remainder } = extractQuantity(articleStripped);
    const { unit, item } = stripLeadingUnit(remainder);
    return {
      intent: 'add',
      item: stripArticles(item),
      quantity,
      unit,
      confidence: 'high',
    };
  }

  rawItem = tryMatch(REMOVE_PATTERNS, text);
  if (rawItem) {
    const clean = stripArticles(rawItem);
    return { intent: 'remove', item: clean, quantity: 1, unit: null, confidence: 'high' };
  }

  rawItem = tryMatch(SEARCH_PATTERNS, text);
  if (rawItem) {
    const clean = stripArticles(rawItem);
    return { intent: 'search', item: clean, quantity: 1, unit: null, confidence: 'high' };
  }

  rawItem = tryMatch(CHECK_PATTERNS, text);
  if (rawItem) {
    const clean = stripArticles(rawItem);
    return { intent: 'check', item: clean, quantity: 1, unit: null, confidence: 'high' };
  }

  // No intent matched — return low confidence so the UI can ask for clarification
  return {
    intent: 'unknown',
    item: text.length > 2 ? text : null,
    quantity: 1,
    unit: null,
    confidence: 'low',
  };
}
