// Hardcoded substitute suggestions. Shown when a user checks off or removes an item.
// Not an ML model — just a curated mapping.
export const SUBSTITUTES = {
  'milk': ['almond milk', 'oat milk', 'soy milk', 'coconut milk'],
  'butter': ['margarine', 'coconut oil', 'olive oil'],
  'sugar': ['honey', 'maple syrup', 'stevia', 'coconut sugar'],
  'flour': ['almond flour', 'oat flour', 'whole wheat flour'],
  'cream': ['coconut cream', 'half and half', 'evaporated milk'],
  'sour cream': ['Greek yogurt', 'crème fraîche'],
  'mayo': ['Greek yogurt', 'avocado', 'hummus'],
  'mayonnaise': ['Greek yogurt', 'avocado', 'hummus'],
  'pasta': ['zucchini noodles', 'rice noodles', 'lentil pasta'],
  'rice': ['quinoa', 'cauliflower rice', 'barley'],
  'bread': ['sourdough', 'whole grain bread', 'pita', 'wraps'],
  'chips': ['rice cakes', 'popcorn', 'pretzels', 'veggie chips'],
  'beef': ['turkey', 'chicken', 'lentils', 'mushrooms'],
  'chicken': ['tofu', 'tempeh', 'chickpeas', 'turkey'],
  'eggs': ['flax eggs', 'chia eggs', 'silken tofu'],
  'peanut butter': ['almond butter', 'sunflower seed butter', 'cashew butter'],
  'soda': ['sparkling water', 'kombucha', 'iced tea'],
  'coffee': ['matcha', 'chai tea', 'herbal tea'],
  'salt': ['herb blend', 'lemon juice', 'nutritional yeast'],
  'chocolate': ['dark chocolate', 'carob', 'cacao nibs'],
};

export function getSubstitutes(itemName) {
  const lower = itemName.toLowerCase();
  // exact match
  if (SUBSTITUTES[lower]) return SUBSTITUTES[lower];
  // partial match
  for (const key of Object.keys(SUBSTITUTES)) {
    if (lower.includes(key) || key.includes(lower)) return SUBSTITUTES[key];
  }
  return [];
}
