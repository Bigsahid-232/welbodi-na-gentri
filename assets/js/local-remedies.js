/* Welbodi na Gentri - Local remedies interactions */

(function() {
    'use strict';

    const filterButtons = document.querySelectorAll('.remedy-filter');
    const remedyCards = document.querySelectorAll('.remedy-card');
    const remedyForm = document.getElementById('remedy-form');
    const thankYou = document.getElementById('thank-you-message');
    const STORAGE_KEY = 'welbodiRemedySubmissions';

    function filterRemedies(category) {
        remedyCards.forEach((card) => {
            const cardCategory = card.dataset.category.toLowerCase();
            card.style.display = category === 'all' || cardCategory === category ? 'block' : 'none';
        });
    }

    function setActiveButton(selected) {
        filterButtons.forEach((button) => {
            button.classList.toggle('active', button === selected);
        });
    }

    function loadSubmissions() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            return [];
        }
    }

    function saveSubmission(submission) {
        const items = loadSubmissions();
        items.push(submission);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }

    function handleFormSubmit(event) {
        event.preventDefault();
        const formData = new FormData(remedyForm);
        const submission = {
            name: formData.get('name'),
            condition: formData.get('condition'),
            remedy: formData.get('remedy'),
            date: new Date().toISOString()
        };
        saveSubmission(submission);
        thankYou.style.display = 'block';
        thankYou.textContent = 'Thank you! Your remedy suggestion has been saved for review.';
        remedyForm.reset();
    }

    document.addEventListener('DOMContentLoaded', () => {
        filterButtons.forEach((button) => {
            button.addEventListener('click', () => {
                setActiveButton(button);
                filterRemedies(button.dataset.category.toLowerCase());
            });
        });

        if (remedyForm) {
            remedyForm.addEventListener('submit', handleFormSubmit);
        }

        filterRemedies('all');
    });
})();