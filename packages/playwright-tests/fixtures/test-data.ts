/**
 * Test data for Flip.ro tests
 * Realistic Romanian product search terms
 */

export const searchTerms = {
    // Popular brands
    popular: ['iPhone', 'Samsung', 'Xiaomi'],

    // Specific models
    models: [
        'iPhone 13',
        'iPhone 14',
        'Samsung S23',
        'Xiaomi 12'
    ],

    // Non-existent product (negative testing)
    nonExistent: '1234567',
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
