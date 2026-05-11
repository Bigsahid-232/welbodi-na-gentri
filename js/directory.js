/* =============================================================================
   Welbodi na Gentri - Healthcare Directory Module
   Handles facility search and filtering
   ============================================================================= */

/**
 * Initialize healthcare directory functionality
 */
function initializeDirectoryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('search-facilities');
    const facilityCards = document.querySelectorAll('.facility-card');

    if (!filterButtons.length || !facilityCards.length) return;

    /**
     * Filter facilities by type
     * @param {string} filterType - The type to filter by (all, hospital, clinic, pharmacy)
     */
    function filterByType(filterType) {
        // Update active button
        filterButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === filterType) {
                btn.classList.add('active');
            }
        });

        // Filter cards
        facilityCards.forEach(card => {
            const cardType = card.dataset.type;
            
            if (filterType === 'all' || cardType === filterType) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    }

    /**
     * Search facilities by name or location
     * @param {string} searchTerm - The search query
     */
    function searchFacilities(searchTerm) {
        const term = searchTerm.toLowerCase().trim();

        facilityCards.forEach(card => {
            const facilityName = card.querySelector('h3').textContent.toLowerCase();
            const location = card.querySelector('.detail-value').textContent.toLowerCase();

            if (facilityName.includes(term) || location.includes(term) || term === '') {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    }

    // Attach event listeners to filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filterType = button.dataset.filter;
            filterByType(filterType);
        });
    });

    // Attach event listener to search input
    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            searchFacilities(e.target.value);
        });

        // Also search on input event for real-time results
        searchInput.addEventListener('input', (e) => {
            searchFacilities(e.target.value);
        });
    }
}

/**
 * Initialize when DOM is ready
 */
function initializeDirectoryOnLoad() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeDirectoryFilters);
    } else {
        initializeDirectoryFilters();
    }
}

// Start initialization
initializeDirectoryOnLoad();
