/* Welbodi na Gentri - Health information page interactions */

(function() {
    'use strict';

    const searchInput = document.getElementById('condition-search');
    const filterButtons = document.querySelectorAll('.filter-tab');
    const conditionCards = document.querySelectorAll('.condition-card');
    const copyButtons = document.querySelectorAll('.copy-link');

    function filterCards(query, category) {
        const normalizedQuery = query.trim().toLowerCase();

        conditionCards.forEach((card) => {
            const title = card.dataset.condition.toLowerCase();
            const keywords = card.dataset.keywords.toLowerCase();
            const cardCategory = card.dataset.category.toLowerCase();

            const matchesQuery = normalizedQuery === '' || title.includes(normalizedQuery) || keywords.includes(normalizedQuery);
            const matchesCategory = category === 'all' || cardCategory === category;

            card.style.display = matchesQuery && matchesCategory ? 'flex' : 'none';
        });
    }

    function setActiveTab(selectedTab) {
        filterButtons.forEach((button) => {
            button.classList.toggle('active', button === selectedTab);
        });
    }

    function handleTabClick(event) {
        const button = event.currentTarget;
        const category = button.dataset.category;
        const searchValue = searchInput ? searchInput.value : '';

        setActiveTab(button);
        filterCards(searchValue, category);
    }

    function handleSearchInput(event) {
        const query = event.target.value;
        const activeButton = document.querySelector('.filter-tab.active');
        const category = activeButton ? activeButton.dataset.category : 'all';
        filterCards(query, category);
    }

    function initAccordions() {
        const accordionButtons = document.querySelectorAll('.accordion-trigger');

        accordionButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const panel = button.nextElementSibling;
                const card = button.closest('.condition-card');
                const openPanels = card.querySelectorAll('.accordion-panel.open');

                openPanels.forEach((openPanel) => {
                    if (openPanel !== panel) {
                        openPanel.classList.remove('open');
                    }
                });

                panel.classList.toggle('open');
            });
        });
    }

    function initCopyLinks() {
        copyButtons.forEach((button) => {
            button.addEventListener('click', async (event) => {
                event.preventDefault();
                try {
                    await navigator.clipboard.writeText(window.location.href);
                    button.textContent = 'Link Copied ✓';
                    setTimeout(() => {
                        button.textContent = 'Copy link';
                    }, 1800);
                } catch (error) {
                    console.error('Clipboard error', error);
                }
            });
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        if (searchInput) {
            searchInput.addEventListener('input', handleSearchInput);
        }

        filterButtons.forEach((button) => {
            button.addEventListener('click', handleTabClick);
        });

        initAccordions();
        initCopyLinks();
    });
})();