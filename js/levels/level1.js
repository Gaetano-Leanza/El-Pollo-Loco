/**
 * Global variable holding the first level instance.
 * Contains all enemies, collectibles, background elements, and environmental objects for level 1.
 * @type {Level}
 */
let level1; 

/**
 * Initializes level 1 with all game objects positioned throughout the playable area.
 * Creates enemies, atmospheric elements, parallax backgrounds, collectible coins, and throwable bottles.
 * Sets up a complete game level with strategic object placement for gameplay progression.
 */
function initLevel(){
    level1 = new Level(
        // Enemies array - positioned from easiest to boss encounter
        [   
            new Endboss(),  // Final boss at level end

            // Small chickens - easier enemies with jump/walk patterns
            new ChickenSmall(),
            new ChickenSmall(),
            new ChickenSmall(),
            new ChickenSmall(),
        
            // Normal chickens - standard horizontal-moving enemies
            new Chicken(), 
            new Chicken(),  
            new Chicken(), 
            new Chicken(),  
        ],

        // Clouds array - atmospheric background elements with random positioning
        [   
            new Cloud("1"),  // Cloud type 1
            new Cloud("2"),  // Cloud type 2
            new Cloud("1"), 
            new Cloud("2"),
            new Cloud("1"), 
        ],

        // Background objects array - 4 layers × 5 segments for seamless scrolling
        // Layer 0: Air/sky layer (static)
        // Layer 1: Far background (fast parallax)
        // Layer 2: Mid background (medium parallax)  
        // Layer 3: Near background (static)
        [
            // Layer 0 (Air) - 5 segments across level width
            new BackgroundObject(0, -1439),  // Pre-start segment
            new BackgroundObject(0, 0),      // First visible segment
            new BackgroundObject(0, 1439),   // Second segment
            new BackgroundObject(0, 1439*2), // Third segment
            new BackgroundObject(0, 1439*3), // Fourth segment
    
            // Layer 1 (Third layer) - 5 segments for parallax scrolling
            new BackgroundObject(1, -1439),
            new BackgroundObject(1, 0),
            new BackgroundObject(1, 1439),
            new BackgroundObject(1, 1439 * 2), 
            new BackgroundObject(1, 1439 * 3), 
    
            // Layer 2 (Second layer) - 5 segments for parallax scrolling
            new BackgroundObject(2, -1439),
            new BackgroundObject(2, 0),
            new BackgroundObject(2, 1439),
            new BackgroundObject(2, 1439 * 2), 
            new BackgroundObject(2, 1439 * 3),
    
            // Layer 3 (First layer) - 5 segments, foreground elements
            new BackgroundObject(3, -1439),
            new BackgroundObject(3, 0),
            new BackgroundObject(3, 1439),
            new BackgroundObject(3, 1439 * 2), 
            new BackgroundObject(3, 1439 * 3),
        ],

        // Coins array - strategically placed collectibles throughout level
        // Total: 15 coins required for completion
        [
            // Starting area coins (x: 400-480)
            new Coin(400, 300),
            new Coin(480, 300),
    
            // First challenge area - ascending pattern (x: 800-1120)
            new Coin(800, 260),
            new Coin(880, 210),
            new Coin(960, 150),  // Highest coin - requires jump
            new Coin(1040, 210),
            new Coin(1120, 260),
    
            // Mid-level area (x: 1700-1860)
            new Coin(1700, 210),
            new Coin(1780, 150),  // High coin
            new Coin(1860, 210),

            // End-game area before boss (x: 3000-4020)
            new Coin(3000, 260),
            new Coin(3080, 210),
            new Coin(3160, 150),  // High coin
            new Coin(3240, 210),
            new Coin(4020, 260),  // Final coin before boss area
        ],

        // Bottles array - throwable ammunition scattered across level
        // Two types: type 0 and type 1 (visual variants)
        // Total: 13 bottles providing throwing ammunition
        [
            new Bottle(0, 900),   // Type 0 at x=900
            new Bottle(1, 1000),  // Type 1 at x=1000
            new Bottle(1, 1550),
            new Bottle(0, 1900),
            new Bottle(0, 1990),
            new Bottle(0, 2500),
            new Bottle(1, 2700),
            new Bottle(1, 3400),
            new Bottle(1, 3550),
            new Bottle(0, 3700),
            new Bottle(1, 4000),
            new Bottle(1, 4300),
            new Bottle(0, 4500),  // Final bottle before boss encounter
        ]
    );
}