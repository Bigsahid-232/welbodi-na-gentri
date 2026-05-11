/* =============================================================================
   Welbodi na Gentri - Main JavaScript Module
   Handles shared functionality across all pages
   ============================================================================= */

/**
 * Mobile Menu Toggle
 * Toggles the navigation menu on mobile devices
 */
function initMenuToggle() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (!menuToggle || !navMenu) return;

    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    // Close menu when a link is clicked
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });
}

/**
 * Close menu when clicking outside
 */
function initMenuClickOutside() {
    const navMenu = document.querySelector('.nav-menu');
    const menuToggle = document.querySelector('.menu-toggle');

    if (!navMenu || !menuToggle) return;

    document.addEventListener('click', (event) => {
        const isMenuClick = navMenu.contains(event.target);
        const isToggleClick = menuToggle.contains(event.target);

        if (!isMenuClick && !isToggleClick) {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    });
}

/**
 * Initialize all functionality when DOM is ready
 */
function initializeApp() {
    // Only initialize if DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initMenuToggle();
            initMenuClickOutside();
        });
    } else {
        initMenuToggle();
        initMenuClickOutside();
    }
}

// Start the app
initializeApp();
