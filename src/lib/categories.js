// Maps item keywords to grocery categories.
// Simple lookup — not ML. Matching is done case-insensitively on item name substring.
export const CATEGORY_MAP = {
  // Dairy — English
  milk: 'Dairy',
  'almond milk': 'Dairy',
  'oat milk': 'Dairy',
  'soy milk': 'Dairy',
  'coconut milk': 'Dairy',
  cheese: 'Dairy',
  butter: 'Dairy',
  yogurt: 'Dairy',
  cream: 'Dairy',
  'sour cream': 'Dairy',
  'cottage cheese': 'Dairy',
  cheddar: 'Dairy',
  mozzarella: 'Dairy',
  parmesan: 'Dairy',
  // Dairy — Indian
  paneer: 'Dairy',
  doodh: 'Dairy',       // milk
  dahi: 'Dairy',        // yogurt / curd
  curd: 'Dairy',
  ghee: 'Dairy',
  lassi: 'Dairy',
  makhan: 'Dairy',      // butter
  makkhan: 'Dairy',
  khoya: 'Dairy',       // reduced milk solids
  mawa: 'Dairy',        // khoya variant
  rabdi: 'Dairy',
  chaach: 'Dairy',      // buttermilk
  buttermilk: 'Dairy',
  'condensed milk': 'Dairy',

  // Fruits and Veggies — English
  apple: 'Fruits and Veggies',
  apples: 'Fruits and Veggies',
  banana: 'Fruits and Veggies',
  bananas: 'Fruits and Veggies',
  orange: 'Fruits and Veggies',
  oranges: 'Fruits and Veggies',
  lemon: 'Fruits and Veggies',
  lemons: 'Fruits and Veggies',
  lime: 'Fruits and Veggies',
  limes: 'Fruits and Veggies',
  grape: 'Fruits and Veggies',
  grapes: 'Fruits and Veggies',
  strawberr: 'Fruits and Veggies', // prefix match covers strawberry/strawberries
  blueberr: 'Fruits and Veggies',
  raspberr: 'Fruits and Veggies',
  tomato: 'Fruits and Veggies',
  tomatoes: 'Fruits and Veggies',
  potato: 'Fruits and Veggies',
  potatoes: 'Fruits and Veggies',
  onion: 'Fruits and Veggies',
  onions: 'Fruits and Veggies',
  garlic: 'Fruits and Veggies',
  carrot: 'Fruits and Veggies',
  carrots: 'Fruits and Veggies',
  spinach: 'Fruits and Veggies',
  lettuce: 'Fruits and Veggies',
  broccoli: 'Fruits and Veggies',
  cucumber: 'Fruits and Veggies',
  'bell pepper': 'Fruits and Veggies',
  peppers: 'Fruits and Veggies',
  avocado: 'Fruits and Veggies',
  avocados: 'Fruits and Veggies',
  zucchini: 'Fruits and Veggies',
  mushroom: 'Fruits and Veggies',
  mushrooms: 'Fruits and Veggies',
  celery: 'Fruits and Veggies',
  kale: 'Fruits and Veggies',
  asparagus: 'Fruits and Veggies',
  mango: 'Fruits and Veggies',
  mangoes: 'Fruits and Veggies',
  pineapple: 'Fruits and Veggies',
  watermelon: 'Fruits and Veggies',
  melon: 'Fruits and Veggies',
  corn: 'Fruits and Veggies',
  guava: 'Fruits and Veggies',
  papaya: 'Fruits and Veggies',
  pomegranate: 'Fruits and Veggies',
  lychee: 'Fruits and Veggies',
  jackfruit: 'Fruits and Veggies',
  drumstick: 'Fruits and Veggies',
  okra: 'Fruits and Veggies',
  eggplant: 'Fruits and Veggies',
  brinjal: 'Fruits and Veggies',
  cauliflower: 'Fruits and Veggies',
  fenugreek: 'Fruits and Veggies',
  // Fruits and Veggies — Hindi / Indian names
  tamatar: 'Fruits and Veggies',   // tomato
  tamater: 'Fruits and Veggies',
  pyaaz: 'Fruits and Veggies',     // onion
  piyaz: 'Fruits and Veggies',
  adrak: 'Fruits and Veggies',     // ginger
  lahsun: 'Fruits and Veggies',    // garlic
  mirch: 'Fruits and Veggies',     // chili / pepper
  'shimla mirch': 'Fruits and Veggies', // bell pepper
  palak: 'Fruits and Veggies',     // spinach
  methi: 'Fruits and Veggies',     // fenugreek leaves
  dhaniya: 'Fruits and Veggies',   // fresh coriander / cilantro
  pudina: 'Fruits and Veggies',    // mint
  gobhi: 'Fruits and Veggies',     // cauliflower
  'phool gobhi': 'Fruits and Veggies',
  'band gobhi': 'Fruits and Veggies', // cabbage
  bhindi: 'Fruits and Veggies',    // okra / ladies finger
  baingan: 'Fruits and Veggies',   // brinjal / eggplant
  tinda: 'Fruits and Veggies',     // apple gourd
  tori: 'Fruits and Veggies',      // ridge gourd
  lauki: 'Fruits and Veggies',     // bottle gourd
  karela: 'Fruits and Veggies',    // bitter gourd
  arbi: 'Fruits and Veggies',      // taro root
  aloo: 'Fruits and Veggies',      // potato
  matar: 'Fruits and Veggies',     // peas
  kela: 'Fruits and Veggies',      // banana
  seb: 'Fruits and Veggies',       // apple
  aam: 'Fruits and Veggies',       // mango
  angoor: 'Fruits and Veggies',    // grapes
  nimbu: 'Fruits and Veggies',     // lemon / lime
  papita: 'Fruits and Veggies',    // papaya
  amrud: 'Fruits and Veggies',     // guava
  anaar: 'Fruits and Veggies',     // pomegranate
  kheera: 'Fruits and Veggies',    // cucumber
  kaddu: 'Fruits and Veggies',     // pumpkin
  chikoo: 'Fruits and Veggies',    // sapodilla
  nashpati: 'Fruits and Veggies',  // pear
  santara: 'Fruits and Veggies',   // orange
  narangi: 'Fruits and Veggies',   // orange
  mosambi: 'Fruits and Veggies',   // sweet lime
  'sweet corn': 'Fruits and Veggies',
  'green chillies': 'Fruits and Veggies',
  'green chili': 'Fruits and Veggies',

  // Bakery — English
  bread: 'Bakery',
  bagel: 'Bakery',
  bagels: 'Bakery',
  muffin: 'Bakery',
  muffins: 'Bakery',
  croissant: 'Bakery',
  croissants: 'Bakery',
  baguette: 'Bakery',
  roll: 'Bakery',
  rolls: 'Bakery',
  bun: 'Bakery',
  buns: 'Bakery',
  pita: 'Bakery',
  tortilla: 'Bakery',
  tortillas: 'Bakery',
  wrap: 'Bakery',
  cake: 'Bakery',
  cookie: 'Bakery',
  cookies: 'Bakery',
  // Bakery — Indian breads
  roti: 'Bakery',
  paratha: 'Bakery',
  parata: 'Bakery',
  naan: 'Bakery',
  pav: 'Bakery',       // dinner roll used in pav bhaji, vada pav
  kulcha: 'Bakery',
  chapati: 'Bakery',
  chapatti: 'Bakery',
  poori: 'Bakery',
  puri: 'Bakery',
  bhatura: 'Bakery',
  dosa: 'Bakery',
  idli: 'Bakery',

  // Meat & Seafood — English
  chicken: 'Meat & Seafood',
  beef: 'Meat & Seafood',
  pork: 'Meat & Seafood',
  lamb: 'Meat & Seafood',
  turkey: 'Meat & Seafood',
  bacon: 'Meat & Seafood',
  sausage: 'Meat & Seafood',
  sausages: 'Meat & Seafood',
  ham: 'Meat & Seafood',
  salmon: 'Meat & Seafood',
  tuna: 'Meat & Seafood',
  shrimp: 'Meat & Seafood',
  steak: 'Meat & Seafood',
  mince: 'Meat & Seafood',
  'ground beef': 'Meat & Seafood',
  // Meat & Seafood — Indian
  mutton: 'Meat & Seafood',
  gosht: 'Meat & Seafood',     // meat (Urdu/Hindi)
  machli: 'Meat & Seafood',   // fish
  rohu: 'Meat & Seafood',     // common freshwater fish
  katla: 'Meat & Seafood',    // another freshwater fish
  pomfret: 'Meat & Seafood',
  surmai: 'Meat & Seafood',   // kingfish / seer fish
  rawas: 'Meat & Seafood',    // Indian salmon
  prawns: 'Meat & Seafood',
  jhinga: 'Meat & Seafood',   // prawns
  crab: 'Meat & Seafood',
  'chicken breast': 'Meat & Seafood',
  'chicken legs': 'Meat & Seafood',
  'chicken wings': 'Meat & Seafood',

  // Beverages — English
  water: 'Beverages',
  juice: 'Beverages',
  soda: 'Beverages',
  coffee: 'Beverages',
  tea: 'Beverages',
  'orange juice': 'Beverages',
  'apple juice': 'Beverages',
  wine: 'Beverages',
  beer: 'Beverages',
  'sparkling water': 'Beverages',
  kombucha: 'Beverages',
  lemonade: 'Beverages',
  'energy drink': 'Beverages',
  smoothie: 'Beverages',
  'coconut water': 'Beverages',
  // Beverages — Indian
  chai: 'Beverages',          // tea
  'masala chai': 'Beverages',
  'nimbu pani': 'Beverages',  // lemonade
  shikanji: 'Beverages',      // Indian lemonade with spices
  'aam panna': 'Beverages',   // raw mango drink
  'rooh afza': 'Beverages',   // rose drink concentrate
  'nariyal pani': 'Beverages',// coconut water
  'jaljeera': 'Beverages',
  'thandai': 'Beverages',

  // Snacks — English
  chips: 'Snacks',
  crackers: 'Snacks',
  nuts: 'Snacks',
  'mixed nuts': 'Snacks',
  almonds: 'Snacks',
  cashews: 'Snacks',
  peanuts: 'Snacks',
  popcorn: 'Snacks',
  pretzels: 'Snacks',
  granola: 'Snacks',
  'granola bar': 'Snacks',
  chocolate: 'Snacks',
  candy: 'Snacks',
  'ice cream': 'Frozen',
  gummies: 'Snacks',
  biscuit: 'Snacks',
  biscuits: 'Snacks',
  // Snacks — Indian
  namkeen: 'Snacks',        // savory snack mix
  bhujia: 'Snacks',         // fried sev snack (Haldiram's etc.)
  mathri: 'Snacks',         // fried cracker
  chakli: 'Snacks',         // spiral snack
  chivda: 'Snacks',         // flattened rice snack mix
  murukku: 'Snacks',        // South Indian spiral snack
  papad: 'Snacks',          // papadum
  papdi: 'Snacks',          // fried dough wafers
  sev: 'Snacks',            // chickpea noodle snack
  khakhra: 'Snacks',        // Gujarati cracker
  mixture: 'Snacks',        // Indian trail mix
  makhana: 'Snacks',        // fox nuts / lotus seeds
  murmura: 'Snacks',        // puffed rice
  'pani puri': 'Snacks',
  'aloo bhujia': 'Snacks',
  kurkure: 'Snacks',

  // Frozen
  'frozen pizza': 'Frozen',
  'frozen vegetables': 'Frozen',
  'frozen fruit': 'Frozen',
  'frozen meals': 'Frozen',
  'frozen dinner': 'Frozen',

  // Pantry — English staples
  eggs: 'Pantry',
  flour: 'Pantry',
  sugar: 'Pantry',
  salt: 'Pantry',
  pepper: 'Pantry',
  oil: 'Pantry',
  'olive oil': 'Pantry',
  'vegetable oil': 'Pantry',
  vinegar: 'Pantry',
  honey: 'Pantry',
  jam: 'Pantry',
  'peanut butter': 'Pantry',
  'almond butter': 'Pantry',
  pasta: 'Pantry',
  rice: 'Pantry',
  beans: 'Pantry',
  lentils: 'Pantry',
  oats: 'Pantry',
  oatmeal: 'Pantry',
  cereal: 'Pantry',
  soup: 'Pantry',
  'tomato sauce': 'Pantry',
  'pasta sauce': 'Pantry',
  ketchup: 'Pantry',
  mustard: 'Pantry',
  mayonnaise: 'Pantry',
  mayo: 'Pantry',
  'soy sauce': 'Pantry',
  'hot sauce': 'Pantry',
  salsa: 'Pantry',
  hummus: 'Pantry',
  // Pantry — Indian staples
  atta: 'Pantry',           // whole wheat flour
  maida: 'Pantry',          // refined flour
  besan: 'Pantry',          // chickpea flour
  sooji: 'Pantry',          // semolina
  rava: 'Pantry',           // semolina (South Indian)
  suji: 'Pantry',
  poha: 'Pantry',           // flattened rice
  dal: 'Pantry',
  daal: 'Pantry',
  'toor dal': 'Pantry',     // pigeon pea lentils
  'tuvar dal': 'Pantry',
  'chana dal': 'Pantry',    // split chickpea
  'moong dal': 'Pantry',    // split mung bean
  'masoor dal': 'Pantry',   // red lentils
  'urad dal': 'Pantry',     // black lentils
  rajma: 'Pantry',          // kidney beans
  chole: 'Pantry',          // chickpeas
  chana: 'Pantry',
  chawal: 'Pantry',         // rice
  basmati: 'Pantry',
  'sona masoori': 'Pantry',
  namak: 'Pantry',          // salt
  cheeni: 'Pantry',         // sugar
  chini: 'Pantry',
  gur: 'Pantry',            // jaggery
  jaggery: 'Pantry',
  shakkar: 'Pantry',        // raw cane sugar
  hing: 'Pantry',           // asafoetida
  jeera: 'Pantry',          // cumin
  haldi: 'Pantry',          // turmeric
  turmeric: 'Pantry',
  dhania: 'Pantry',         // coriander seeds/powder
  'garam masala': 'Pantry',
  'lal mirch': 'Pantry',    // red chili powder
  'chili powder': 'Pantry',
  'chilli powder': 'Pantry',
  'sabzi masala': 'Pantry',
  'sambhar powder': 'Pantry',
  'rasam powder': 'Pantry',
  'curry powder': 'Pantry',
  'chaat masala': 'Pantry',
  'amchur': 'Pantry',       // dry mango powder
  'kala namak': 'Pantry',   // black salt
  achar: 'Pantry',          // pickle
  achaar: 'Pantry',
  imli: 'Pantry',           // tamarind
  tamarind: 'Pantry',
  sarson: 'Pantry',         // mustard seeds
  rai: 'Pantry',            // mustard seeds
  'curry leaves': 'Pantry',
  'kadi patta': 'Pantry',
  'kasuri methi': 'Pantry', // dried fenugreek
  'mustard oil': 'Pantry',
  'groundnut oil': 'Pantry',
  'coconut oil': 'Pantry',
  'sunflower oil': 'Pantry',
  maggi: 'Pantry',          // Maggi noodles
  noodles: 'Pantry',
  upma: 'Pantry',

  // Household
  'toilet paper': 'Household',
  'paper towels': 'Household',
  tissues: 'Household',
  'dish soap': 'Household',
  detergent: 'Household',
  'laundry detergent': 'Household',
  shampoo: 'Household',
  conditioner: 'Household',
  toothpaste: 'Household',
  'toothbrush': 'Household',
  soap: 'Household',
  'hand soap': 'Household',
  sponge: 'Household',
  sponges: 'Household',
  'trash bags': 'Household',
  'garbage bags': 'Household',
  'zip lock': 'Household',
  foil: 'Household',
  'plastic wrap': 'Household',
};

const CATEGORY_ORDER = [
  'Fruits and Veggies', 'Dairy', 'Meat & Seafood', 'Bakery',
  'Beverages', 'Snacks', 'Frozen', 'Pantry', 'Household', 'Other',
];

export function categorize(itemName) {
  const lower = itemName.toLowerCase();

  // Try exact match first
  if (CATEGORY_MAP[lower]) return CATEGORY_MAP[lower];

  // Try substring/prefix match (longest key wins)
  const sortedKeys = Object.keys(CATEGORY_MAP).sort((a, b) => b.length - a.length);
  for (const key of sortedKeys) {
    if (lower.includes(key)) return CATEGORY_MAP[key];
  }

  return 'Other';
}

export { CATEGORY_ORDER };
