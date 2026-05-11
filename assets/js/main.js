/* Welbodi na Gentri - Main navigation script */

(function() {
    'use strict';

    const header = document.querySelector('.site-header');
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('#nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    function setMenuState(isOpen) {
        if (!menuToggle || !navMenu) return;

        menuToggle.classList.toggle('open', isOpen);
        navMenu.classList.toggle('open', isOpen);
        menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }

    function highlightActiveLink() {
        if (!navLinks.length) return;
        const currentUrl = window.location.href;

        navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            if (!href) return;
            const normalizedHref = href.replace(/^\.\//, '');

            if (currentUrl.includes(normalizedHref) || (normalizedHref === 'index.html' && currentUrl.endsWith('/'))) {
                link.classList.add('active');
            }
        });
    }

    function handleScrollShadow() {
        if (!header) return;
        header.classList.toggle('scrolled', window.scrollY > 50);
    }

    function closeMenuOnLinkClick() {
        navLinks.forEach((link) => {
            link.addEventListener('click', () => setMenuState(false));
        });
    }

    function setupScrollReveal() {
        const featureCards = document.querySelectorAll('.feature-card');
        if (!featureCards.length || !window.IntersectionObserver) return;

        const cardObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2
        });

        featureCards.forEach((card) => cardObserver.observe(card));
    }

    document.addEventListener('DOMContentLoaded', () => {
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                setMenuState(!navMenu.classList.contains('open'));
            });
        }

        closeMenuOnLinkClick();
        highlightActiveLink();
        handleScrollShadow();
        setupScrollReveal();
        window.addEventListener('scroll', handleScrollShadow);

        // Dashboard functionality
        initializeDashboard();

        // Back to top functionality
        initializeBackToTop();

        // Loading overlay
        hideLoadingOverlay();

        // Initialize animations and interactions
        initializeAnimations();
        initializePageTransitions();
        initializeTooltips();
    });

    // Toast notification system
    function showToast(message, type = 'info') {
        const toastContainer = document.querySelector('.toast-container') || createToastContainer();
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const icons = {
            success: '✓',
            error: '✕',
            info: 'ℹ'
        };

        toast.innerHTML = `
            <span class="toast-icon">${icons[type]}</span>
            <div class="toast-content">
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" aria-label="Close notification">×</button>
        `;

        toastContainer.appendChild(toast);

        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 10);

        // Auto dismiss after 3 seconds
        const dismissTimer = setTimeout(() => dismissToast(toast), 3000);

        // Manual dismiss
        toast.querySelector('.toast-close').addEventListener('click', () => {
            clearTimeout(dismissTimer);
            dismissToast(toast);
        });

        function dismissToast(toastElement) {
            toastElement.classList.remove('show');
            setTimeout(() => {
                if (toastElement.parentNode) {
                    toastElement.parentNode.removeChild(toastElement);
                }
            }, 300);
        }
    }

    function createToastContainer() {
        const container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
        return container;
    }

    // Scroll-triggered animations
    function initializeAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    const element = entry.target;

                    // Section headings fade in from bottom
                    if (element.tagName.match(/^H[1-6]$/)) {
                        element.classList.add('fade-in-up', 'animate');
                    }

                    // Feature cards staggered fade-in
                    if (element.classList.contains('feature-card')) {
                        setTimeout(() => {
                            element.classList.add('stagger-fade-in', 'animate');
                        }, index * 100);
                    }

                    // Directory cards slide in from left
                    if (element.classList.contains('directory-card') || element.classList.contains('disease-card')) {
                        element.classList.add('slide-in-left', 'animate');
                    }

                    // Tip cards fade in from bottom
                    if (element.classList.contains('tip-card')) {
                        element.classList.add('fade-in-up', 'animate');
                    }

                    // Number count-up animation
                    if (element.classList.contains('count-up')) {
                        animateNumber(element);
                    }

                    observer.unobserve(element);
                }
            });
        }, observerOptions);

        // Observe elements
        document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(el => observer.observe(el));
        document.querySelectorAll('.feature-card').forEach(el => observer.observe(el));
        document.querySelectorAll('.directory-card, .disease-card').forEach(el => observer.observe(el));
        document.querySelectorAll('.tip-card').forEach(el => observer.observe(el));
        document.querySelectorAll('.count-up').forEach(el => observer.observe(el));
    }

    // Button loading state
    function initializeButtonLoading() {
        document.addEventListener('click', (e) => {
            const button = e.target.closest('button[type="submit"], .btn[type="submit"]');
            if (!button) return;

            button.classList.add('loading');
            button.disabled = true;

            // Simulate async operation
            setTimeout(() => {
                button.classList.remove('loading');
                button.disabled = false;
            }, 1500);
        });
    }

    // Page transitions
    function initializePageTransitions() {
        const mainContent = document.querySelector('main');
        if (!mainContent) return;

        // Fade in on page load
        mainContent.classList.add('fade-in', 'animate');

        // Fade out on navigation
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href]');
            if (!link || link.getAttribute('href').startsWith('#') || link.getAttribute('href').startsWith('javascript:')) return;

            e.preventDefault();
            mainContent.classList.add('page-transition', 'fade-out');

            setTimeout(() => {
                window.location.href = link.href;
            }, 200);
        });
    }

    // Number count-up animation
    function animateNumber(element) {
        const target = parseInt(element.textContent.replace(/[^\d]/g, ''));
        if (isNaN(target)) return;

        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current).toLocaleString();
        }, 30);
    }

    // Tooltips
    function initializeTooltips() {
        document.querySelectorAll('[title]').forEach(el => {
            const title = el.getAttribute('title');
            el.setAttribute('data-tooltip', title);
            el.removeAttribute('title');
            el.classList.add('tooltip');
        });
    }

    // Dashboard functions
    function initializeDashboard() {
        const isLoggedIn = checkLoginStatus();
        updateNavigation(isLoggedIn);

        if (isLoggedIn) {
            showDashboard();
            loadDashboardData();
            setupWaterTracker();
            setupLogout();
        } else {
            showHero();
        }
    }

    function checkLoginStatus() {
        const user = localStorage.getItem('welbodi_user');
        return user ? JSON.parse(user) : null;
    }

    function updateNavigation(isLoggedIn) {
        const authLinks = document.getElementById('auth-links');
        const loggedInLinks = document.getElementById('logged-in-links');

        if (isLoggedIn) {
            if (authLinks) authLinks.style.display = 'none';
            if (loggedInLinks) loggedInLinks.style.display = 'block';
        } else {
            if (authLinks) authLinks.style.display = 'block';
            if (loggedInLinks) loggedInLinks.style.display = 'none';
        }
    }

    function showDashboard() {
        const dashboard = document.getElementById('user-dashboard');
        const hero = document.getElementById('hero-section');

        if (dashboard) dashboard.style.display = 'block';
        if (hero) hero.style.display = 'none';
    }

    function showHero() {
        const dashboard = document.getElementById('user-dashboard');
        const hero = document.getElementById('hero-section');

        if (dashboard) dashboard.style.display = 'none';
        if (hero) hero.style.display = 'block';
    }

    function loadDashboardData() {
        const user = checkLoginStatus();
        if (!user) return;

        // Update user name
        const userNameElement = document.getElementById('user-name');
        if (userNameElement) {
            userNameElement.textContent = user.name || user.email.split('@')[0];
        }

        // Update date
        const dateElement = document.getElementById('dashboard-date');
        if (dateElement) {
            const now = new Date();
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            dateElement.textContent = now.toLocaleDateString('en-US', options);
        }

        // Load random quote
        const quoteElement = document.getElementById('dashboard-quote');
        if (quoteElement) {
            const quotes = [
                "Health is not valued till sickness comes. - Thomas Fuller",
                "Take care of your body. It's the only place you have to live. - Jim Rohn",
                "The greatest wealth is health. - Virgil",
                "Prevention is better than cure. - Desiderius Erasmus",
                "A healthy outside starts from the inside. - Robert Urich"
            ];
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
            quoteElement.textContent = randomQuote;
        }

        // Load saved tips count
        const savedTipsCount = document.getElementById('saved-tips-count');
        if (savedTipsCount) {
            const savedTips = JSON.parse(localStorage.getItem('welbodi_saved_tips') || '[]');
            savedTipsCount.textContent = savedTips.length;
        }
    }

    function setupWaterTracker() {
        const waterGlasses = document.querySelectorAll('.water-glass');
        const waterCount = document.getElementById('water-count');

        if (!waterGlasses.length || !waterCount) return;

        // Load current water intake
        const today = new Date().toDateString();
        const waterData = JSON.parse(localStorage.getItem('welbodi_water') || '{}');
        const currentIntake = waterData[today] || 0;

        // Update UI
        updateWaterDisplay(currentIntake);

        // Setup click handlers
        waterGlasses.forEach((glass, index) => {
            glass.addEventListener('click', () => {
                const newIntake = index + 1;
                waterData[today] = newIntake;
                localStorage.setItem('welbodi_water', JSON.stringify(waterData));
                updateWaterDisplay(newIntake);
            });
        });

        function updateWaterDisplay(intake) {
            waterGlasses.forEach((glass, index) => {
                if (index < intake) {
                    glass.textContent = '🥛'; // Filled glass
                    glass.classList.add('filled');
                } else {
                    glass.textContent = '🥤'; // Empty glass
                    glass.classList.remove('filled');
                }
            });
            waterCount.textContent = `You've had ${intake} of 8 glasses today`;
        }
    }

    function setupLogout() {
        const logoutBtn = document.getElementById('logout-btn');
        if (!logoutBtn) return;

        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('welbodi_user');
            location.reload();
        });
    }

    // Back to top functionality
    function initializeBackToTop() {
        const backToTopBtn = document.getElementById('back-to-top');
        if (!backToTopBtn) return;

        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        // Smooth scroll to top
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Loading overlay functionality
    function hideLoadingOverlay() {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (!loadingOverlay) return;

        // Hide after a brief delay to show loading state
        setTimeout(() => {
            loadingOverlay.classList.add('hidden');
            // Remove from DOM after animation
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
            }, 300);
        }, 500);
    }

    function checkLoginStatus() {
        const user = localStorage.getItem('welbodi_user');
        return user ? JSON.parse(user) : null;
    }

    function updateNavigation(isLoggedIn) {
        const authLinks = document.getElementById('auth-links');
        const loggedInLinks = document.getElementById('logged-in-links');

        if (isLoggedIn) {
            if (authLinks) authLinks.style.display = 'none';
            if (loggedInLinks) loggedInLinks.style.display = 'block';
        } else {
            if (authLinks) authLinks.style.display = 'block';
            if (loggedInLinks) loggedInLinks.style.display = 'none';
        }
    }

    function showDashboard() {
        const dashboard = document.getElementById('user-dashboard');
        const hero = document.getElementById('hero-section');

        if (dashboard) dashboard.style.display = 'block';
        if (hero) hero.style.display = 'none';
    }

    function showHero() {
        const dashboard = document.getElementById('user-dashboard');
        const hero = document.getElementById('hero-section');

        if (dashboard) dashboard.style.display = 'none';
        if (hero) hero.style.display = 'block';
    }

    function loadDashboardData() {
        const user = checkLoginStatus();
        if (!user) return;

        // Update user name
        const userNameElement = document.getElementById('user-name');
        if (userNameElement) {
            userNameElement.textContent = user.name || user.email.split('@')[0];
        }

        // Update date
        const dateElement = document.getElementById('dashboard-date');
        if (dateElement) {
            const now = new Date();
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            dateElement.textContent = now.toLocaleDateString('en-US', options);
        }

        // Load random quote
        const quoteElement = document.getElementById('dashboard-quote');
        if (quoteElement) {
            const quotes = [
                "Health is not valued till sickness comes. - Thomas Fuller",
                "Take care of your body. It's the only place you have to live. - Jim Rohn",
                "The greatest wealth is health. - Virgil",
                "Prevention is better than cure. - Desiderius Erasmus",
                "A healthy outside starts from the inside. - Robert Urich"
            ];
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
            quoteElement.textContent = randomQuote;
        }

        // Load saved tips count
        const savedTipsCount = document.getElementById('saved-tips-count');
        if (savedTipsCount) {
            const savedTips = JSON.parse(localStorage.getItem('welbodi_saved_tips') || '[]');
            savedTipsCount.textContent = savedTips.length;
        }
    }

    function setupWaterTracker() {
        const waterGlasses = document.querySelectorAll('.water-glass');
        const waterCount = document.getElementById('water-count');

        if (!waterGlasses.length || !waterCount) return;

        // Load current water intake
        const today = new Date().toDateString();
        const waterData = JSON.parse(localStorage.getItem('welbodi_water') || '{}');
        const currentIntake = waterData[today] || 0;

        // Update UI
        updateWaterDisplay(currentIntake);

        // Setup click handlers
        waterGlasses.forEach((glass, index) => {
            glass.addEventListener('click', () => {
                const newIntake = index + 1;
                waterData[today] = newIntake;
                localStorage.setItem('welbodi_water', JSON.stringify(waterData));
                updateWaterDisplay(newIntake);
            });
        });

        function updateWaterDisplay(intake) {
            waterGlasses.forEach((glass, index) => {
                if (index < intake) {
                    glass.textContent = '🥛'; // Filled glass
                    glass.classList.add('filled');
                } else {
                    glass.textContent = '🥤'; // Empty glass
                    glass.classList.remove('filled');
                }
            });
            waterCount.textContent = `You've had ${intake} of 8 glasses today`;
        }
    }

    function setupLogout() {
        const logoutBtn = document.getElementById('logout-btn');
        if (!logoutBtn) return;

        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('welbodi_user');
            location.reload();
        });
    }
})();
