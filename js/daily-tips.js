/* =============================================================================
   Welbodi na Gentri - Daily Health Tips Module
   Displays a random health tip on page load
   ============================================================================= */

// Health tips database - organized by category
const dailyHealthTips = [
    // Hygiene Tips
    {
        tip: "Wash your hands with soap and water for at least 20 seconds, especially before eating and after using the toilet.",
        category: "Hygiene",
        emoji: "🧼"
    },
    {
        tip: "Keep your fingernails short and clean to prevent bacteria and infections from spreading.",
        category: "Hygiene",
        emoji: "✂️"
    },
    {
        tip: "Brush your teeth twice daily - once in the morning and once before bed - to maintain good dental health.",
        category: "Hygiene",
        emoji: "🪥"
    },
    {
        tip: "Take a bath or shower at least once daily to remove dirt, sweat, and bacteria from your skin.",
        category: "Hygiene",
        emoji: "🚿"
    },

    // Malaria Prevention Tips
    {
        tip: "Sleep under a mosquito net every night, especially during rainy seasons when malaria transmission is high.",
        category: "Malaria Prevention",
        emoji: "🦟"
    },
    {
        tip: "Wear long sleeves and long pants during dawn and dusk when mosquitoes are most active.",
        category: "Malaria Prevention",
        emoji: "👕"
    },
    {
        tip: "Use mosquito repellent containing DEET or natural alternatives like lemongrass oil on exposed skin.",
        category: "Malaria Prevention",
        emoji: "🧴"
    },
    {
        tip: "Drain stagnant water from buckets, tires, and flower pots where mosquitoes breed.",
        category: "Malaria Prevention",
        emoji: "💧"
    },
    {
        tip: "Get tested for malaria if you experience fever, chills, or body aches - early treatment saves lives.",
        category: "Malaria Prevention",
        emoji: "🩺"
    },

    // Nutrition Tips
    {
        tip: "Eat a rainbow of fruits and vegetables daily - different colors provide different nutrients your body needs.",
        category: "Nutrition",
        emoji: "🌈"
    },
    {
        tip: "Include leafy greens like spinach, cassava leaves, and cabbage in your diet for iron and vitamins.",
        category: "Nutrition",
        emoji: "🥬"
    },
    {
        tip: "Eat protein-rich foods like beans, lentils, eggs, and fish to build and repair muscles.",
        category: "Nutrition",
        emoji: "🥚"
    },
    {
        tip: "Limit sugary drinks and processed foods - choose water and natural foods instead for better health.",
        category: "Nutrition",
        emoji: "🥤"
    },

    // Exercise Tips
    {
        tip: "Exercise for at least 30 minutes daily - this can be walking, dancing, farming, or any movement you enjoy.",
        category: "Exercise",
        emoji: "🚶"
    },
    {
        tip: "Take stairs instead of elevators and walk short distances instead of using transport - stay active daily.",
        category: "Exercise",
        emoji: "🪜"
    },
    {
        tip: "Stretch your muscles for 5-10 minutes each morning to improve flexibility and reduce stiffness.",
        category: "Exercise",
        emoji: "🧘"
    },

    // Hydration Tips
    {
        tip: "Drink at least 8 glasses of water daily to keep your body hydrated and organs functioning properly.",
        category: "Hydration",
        emoji: "💧"
    },
    {
        tip: "Drink water before you feel thirsty - thirst is often a late sign of dehydration.",
        category: "Hydration",
        emoji: "🥛"
    },
    {
        tip: "Increase water intake during hot seasons and after exercise to replace lost fluids.",
        category: "Hydration",
        emoji: "☀️"
    },

    // Sanitation Tips
    {
        tip: "Use clean, safe water for drinking and cooking - boil water or use a water filter if needed.",
        category: "Sanitation",
        emoji: "🚰"
    },
    {
        tip: "Use a clean toilet or latrine - proper sanitation prevents the spread of diseases like typhoid and cholera.",
        category: "Sanitation",
        emoji: "🚽"
    },
    {
        tip: "Wash fruits and vegetables with clean water before eating to remove dirt and harmful bacteria.",
        category: "Sanitation",
        emoji: "🍎"
    },
    {
        tip: "Keep food in a clean, covered container away from insects and animals to prevent contamination.",
        category: "Sanitation",
        emoji: "🍴"
    }
];

/**
 * Get a random number between 0 and max (exclusive)
 * @param {number} max - The upper limit (exclusive)
 * @returns {number} Random number
 */
function getRandomIndex(max) {
    return Math.floor(Math.random() * max);
}

/**
 * Get a random health tip from the database
 * @returns {object} A random health tip object
 */
function getRandomDailyTip() {
    const randomIndex = getRandomIndex(dailyHealthTips.length);
    return dailyHealthTips[randomIndex];
}

/**
 * Display the daily tip in the DOM
 */
function displayDailyTip() {
    const tipElement = document.getElementById("daily-tip");
    
    // Check if the element exists
    if (!tipElement) {
        console.warn("Daily tip element with id='daily-tip' not found in the DOM");
        return;
    }

    // Get a random tip
    const randomTip = getRandomDailyTip();

    // Build the HTML content
    const tipHTML = `
        <div class="daily-tip-content">
            <span class="tip-emoji">${randomTip.emoji}</span>
            <div class="tip-text">
                <h3 class="tip-category">${randomTip.category}</h3>
                <p class="tip-message">${randomTip.tip}</p>
            </div>
        </div>
    `;

    // Update the element
    tipElement.innerHTML = tipHTML;

    // Add CSS class for styling
    tipElement.classList.add("daily-tip-displayed");
}

/**
 * Initialize daily tips on page load
 */
function initDailyTips() {
    // Wait for DOM to be fully loaded
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", displayDailyTip);
    } else {
        // DOM is already loaded
        displayDailyTip();
    }
}

// Run the initialization when the script loads
initDailyTips();

// Optional: Refresh tip every 24 hours
// Uncomment below if you want the tip to update daily automatically
/*
setInterval(displayDailyTip, 24 * 60 * 60 * 1000);
*/
