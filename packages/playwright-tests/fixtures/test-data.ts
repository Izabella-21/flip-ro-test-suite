/**
 * Test data for Flip.ro tests
 * Realistic Romanian product search terms
 */

export const searchTerms = {
    // Popular brands
    popular: ['iPhone', 'Samsung', 'Google Pixel', 'Xiaomi', 'Huawei'],

    // Specific models
    models: [
        'iPhone 13',
        'iPhone 14',
        'Samsung S23',
        'Google Pixel 7',
        'Xiaomi 12'
    ],

    // Laptop searches
    laptops: ['MacBook', 'Dell XPS', 'Lenovo ThinkPad', 'HP EliteBook'],

    // Tablets
    tablets: ['iPad', 'Samsung Tab', 'Lenovo Tab'],

    // Non-existent product (negative testing)
    nonExistent: 'xyzabc123produsinexistentqwerty',
}

export const priceRanges = {
    budget: { min: 0, max: 1000 },
    midRange: { min: 1000, max: 3000 },
    premium: { min: 3000, max: 10000 },
}

export const categories = [
    'Telefoane',
    'Laptopuri',
    'Tablete',
    'Smartwatch-uri',
    'Casti',
]

export const sortOptions = [
    'Cele mai noi',
    'Pret ascendent',
    'Pret descendent',
    'Cele mai populare',
]
