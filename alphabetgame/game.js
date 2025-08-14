// Add this function at the start of the file
async function loadCategories() {
    try {
        const response = await fetch('categories.txt');
        if (!response.ok) {
            throw new Error('Failed to load categories file');
        }
        const text = await response.text();
        
        // Split and filter categories properly
        const loadedCategories = text
            .replace(/^\uFEFF/, '')  // Remove BOM if present
            .split(/\r?\n/)          // Handle both CRLF and LF
            .map(category => category.trim())
            .filter(category => {
                return category && 
                       category.length > 0 && 
                       !category.startsWith('//');
            });
        
        console.log(`[AlphabetGame] Loaded ${loadedCategories.length} categories`);
        
        if (loadedCategories.length === 0) {
            throw new Error('No categories found in file');
        }
        
        return loadedCategories;
    } catch (error) {
        console.error('[AlphabetGame] Error loading categories:', error);
        return DEFAULT_CATEGORIES; // Your fallback categories
    }
}

// Modify the game initialization to use the new loader
document.addEventListener('DOMContentLoaded', async () => {
    // Load categories first
    const categories = await loadCategories();
    console.log(`[AlphabetGame] Initialized with ${categories.length} categories`);
    
    // When selecting a random category, add logging
    function getRandomCategory() {
        const index = Math.floor(Math.random() * categories.length);
        const category = categories[index];
        console.log(`[AlphabetGame] Selected category ${index + 1}/${categories.length}: ${category}`);
        return category;
    }
    
    // ...rest of your game initialization code...
});
