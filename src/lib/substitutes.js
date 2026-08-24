// Hardcoded substitute suggestions. Shown when a user checks off or removes an item.
// Not an ML model — a curated mapping covering common Indian grocery substitutions.
export const SUBSTITUTES = {
  // Dairy — with Indian alternatives
  milk: ['oat milk', 'almond milk', 'soy milk', 'coconut milk'],
  doodh: ['oat milk', 'almond milk', 'soy milk'],
  butter: ['ghee', 'coconut oil', 'margarine'],
  ghee: ['butter', 'coconut oil', 'mustard oil'],
  paneer: ['tofu', 'cottage cheese', 'halloumi'],
  dahi: ['Greek yogurt', 'coconut yogurt', 'sour cream'],
  curd: ['Greek yogurt', 'coconut yogurt'],
  cream: ['coconut cream', 'cashew cream', 'evaporated milk'],
  'sour cream': ['Greek yogurt', 'dahi', 'crème fraîche'],

  // Grains & Flour — with Indian alternatives
  atta: ['multigrain atta', 'whole wheat flour', 'oat flour'],
  maida: ['whole wheat flour', 'atta', 'besan'],
  besan: ['chickpea flour', 'urad dal flour', 'oat flour'],
  sooji: ['rava', 'oat flour', 'cornmeal'],
  rava: ['sooji', 'oat flour', 'cornmeal'],
  flour: ['atta', 'almond flour', 'oat flour'],

  // Rice & Dal — with Indian alternatives
  rice: ['basmati rice', 'brown rice', 'quinoa', 'broken wheat'],
  basmati: ['sona masoori rice', 'brown rice', 'quinoa'],
  chawal: ['basmati', 'sona masoori', 'broken wheat'],
  'toor dal': ['chana dal', 'moong dal', 'masoor dal'],
  'chana dal': ['toor dal', 'moong dal', 'masoor dal'],
  'moong dal': ['masoor dal', 'toor dal', 'chana dal'],
  dal: ['toor dal', 'moong dal', 'masoor dal'],
  lentils: ['toor dal', 'moong dal', 'masoor dal'],
  rajma: ['chole', 'kidney beans', 'black beans'],
  chole: ['rajma', 'chickpeas', 'white beans'],

  // Sweeteners
  sugar: ['jaggery', 'honey', 'coconut sugar', 'stevia'],
  cheeni: ['jaggery', 'honey', 'mishri'],
  jaggery: ['brown sugar', 'coconut sugar', 'honey'],
  gur: ['jaggery', 'brown sugar', 'honey'],
  honey: ['jaggery', 'maple syrup', 'agave'],

  // Oils
  'mustard oil': ['sunflower oil', 'groundnut oil', 'coconut oil'],
  'groundnut oil': ['sunflower oil', 'coconut oil', 'mustard oil'],
  'coconut oil': ['sunflower oil', 'olive oil', 'ghee'],
  oil: ['olive oil', 'coconut oil', 'mustard oil'],

  // Beverages
  chai: ['green tea', 'herbal tea', 'black coffee'],
  coffee: ['chai', 'matcha', 'herbal tea'],

  // Snacks
  chips: ['makhana', 'popcorn', 'bhujia', 'rice cakes'],
  papad: ['rice crackers', 'khakhra', 'mathri'],
  biscuits: ['crackers', 'khakhra', 'rusk'],
  chocolate: ['dark chocolate', 'dates', 'makhana'],

  // Pantry condiments
  salt: ['kala namak', 'herb blend', 'lemon juice'],
  eggs: ['tofu', 'besan batter', 'chia seeds'],
  pasta: ['noodles', 'rice noodles', 'semiya'],
  bread: ['roti', 'pav', 'pita'],
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
