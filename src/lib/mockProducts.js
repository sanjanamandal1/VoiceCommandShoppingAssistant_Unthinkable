// Mock product catalog — 26 items reflecting the Indian grocery market.
// Prices in INR (₹). Clearly labeled as mock in the README. No live data source.
export const MOCK_PRODUCTS = [
  // Dairy
  { id: 1,  name: 'Amul Full Cream Milk (1L)',       brand: 'Amul',          category: 'Dairy',          price: 68  },
  { id: 2,  name: 'Amul Ghee (500ml)',               brand: 'Amul',          category: 'Dairy',          price: 305 },
  { id: 3,  name: 'Amul Paneer (200g)',              brand: 'Amul',          category: 'Dairy',          price: 90  },
  { id: 4,  name: 'Mother Dairy Curd / Dahi (400g)', brand: 'Mother Dairy',  category: 'Dairy',          price: 40  },
  { id: 5,  name: 'Oat Milk (1L)',                   brand: 'Sofit',         category: 'Dairy',          price: 180 },
  { id: 6,  name: 'Greek Yogurt (400g)',             brand: 'Epigamia',      category: 'Dairy',          price: 115 },
  { id: 7,  name: 'Cheddar Cheese Slice',            brand: 'Britannia',     category: 'Dairy',          price: 140 },

  // Bakery & Grains
  { id: 8,  name: 'Whole Wheat Bread',               brand: 'Britannia',     category: 'Bakery',         price: 45  },
  { id: 9,  name: 'Multigrain Atta (5kg)',           brand: 'Aashirvaad',    category: 'Pantry',         price: 290 },

  // Beverages
  { id: 10, name: 'Tata Tea Gold (250g)',             brand: 'Tata',          category: 'Beverages',      price: 135 },
  { id: 11, name: 'Bru Filter Coffee Powder (200g)', brand: 'Bru',           category: 'Beverages',      price: 130 },
  { id: 12, name: 'Packaged Drinking Water (2L)',    brand: 'Bisleri',       category: 'Beverages',      price: 20  },
  { id: 13, name: 'Mango Juice (1L)',                brand: 'Maaza',         category: 'Beverages',      price: 85  },

  // Pantry
  { id: 14, name: 'Eggs (dozen)',                    brand: 'Suguna',        category: 'Pantry',         price: 95  },
  { id: 15, name: 'Basmati Rice (5kg)',              brand: 'India Gate',    category: 'Pantry',         price: 450 },
  { id: 16, name: 'Mustard Oil (1L)',                brand: 'Fortune',       category: 'Pantry',         price: 175 },
  { id: 17, name: 'Toor Dal (1kg)',                  brand: 'Tata Sampann',  category: 'Pantry',         price: 140 },
  { id: 18, name: 'Maggi 2-Minute Noodles (70g)',   brand: 'Nestlé',        category: 'Pantry',         price: 14  },
  { id: 19, name: 'Dabur Honey (500g)',              brand: 'Dabur',         category: 'Pantry',         price: 225 },

  // Meat & Seafood
  { id: 20, name: 'Chicken Breast (500g)',           brand: 'Suguna',        category: 'Meat & Seafood', price: 160 },
  { id: 21, name: 'Rohu Fish (1kg)',                 brand: 'Fresh Catch',   category: 'Meat & Seafood', price: 220 },

  // Snacks
  { id: 22, name: 'Haldiram\'s Bhujia (400g)',      brand: 'Haldiram\'s',   category: 'Snacks',         price: 130 },
  { id: 23, name: 'Parle-G Biscuits (250g)',        brand: 'Parle',         category: 'Snacks',         price: 20  },
  { id: 24, name: 'Lijjat Papad (200g)',            brand: 'Lijjat',        category: 'Snacks',         price: 55  },
  { id: 25, name: 'Kurkure Masala Munch',           brand: 'PepsiCo',       category: 'Snacks',         price: 30  },
  { id: 26, name: '70% Dark Chocolate (80g)',       brand: 'Amul',          category: 'Snacks',         price: 110 },
];

export function searchProducts(query, { brand, maxPrice } = {}) {
  const q = query.toLowerCase().trim();
  return MOCK_PRODUCTS.filter((p) => {
    const nameMatch = !q || p.name.toLowerCase().includes(q);
    const brandMatch = !brand || p.brand.toLowerCase() === brand.toLowerCase();
    const priceMatch = !maxPrice || p.price <= maxPrice;
    return nameMatch && brandMatch && priceMatch;
  });
}

export const ALL_BRANDS = [...new Set(MOCK_PRODUCTS.map((p) => p.brand))];
