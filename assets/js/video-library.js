/* Welbodi na Gentri - Video library interactions */

(function() {
    'use strict';

    const videos = [
        { id: 'v1', title: 'Recognizing Malaria Symptoms', category: 'Malaria', duration: '4:12', description: 'Learn the early warning signs of malaria and when to seek care.', youtubeId: 'dQw4w9WgXcQ' },
        { id: 'v2', title: 'Healthy Eating with Local Foods', category: 'Nutrition', duration: '5:30', description: 'Discover how to build balanced meals using foods found in Sierra Leone.', youtubeId: 'dQw4w9WgXcQ' },
        { id: 'v3', title: 'Simple Home Exercises', category: 'Exercise', duration: '4:45', description: 'Easy exercises you can do at home to stay strong and active.', youtubeId: 'dQw4w9WgXcQ' },
        { id: 'v4', title: 'Protect Your Family from Germs', category: 'Hygiene', duration: '3:50', description: 'Practical hygiene habits that prevent illness in the household.', youtubeId: 'dQw4w9WgXcQ' },
        { id: 'v5', title: 'Caring for Children’s Health', category: 'Child Health', duration: '6:10', description: 'Tips for keeping children healthy and growing strong.', youtubeId: 'dQw4w9WgXcQ' },
        { id: 'v6', title: 'Mindful Living for Better Health', category: 'Mental Health', duration: '5:02', description: 'Simple habits to support emotional wellbeing and reduce stress.', youtubeId: 'dQw4w9WgXcQ' }
    ];

    const categoryButtons = document.querySelectorAll('.video-tab');
    const searchInput = document.getElementById('video-search');
    const videoGrid = document.querySelector('.video-grid');
    const modalOverlay = document.querySelector('.video-modal-overlay');
    const modalClose = document.querySelector('.modal-close');
    const modalIframe = document.getElementById('video-embed');
    const modalTitle = document.getElementById('modal-title');

    function renderVideos(filterCategory = 'All', query = '') {
        if (!videoGrid) return;
        const normalizedQuery = query.trim().toLowerCase();
        const visibleVideos = videos.filter((video) => {
            const matchesCategory = filterCategory === 'All' || video.category === filterCategory;
            const matchesQuery = normalizedQuery === '' || video.title.toLowerCase().includes(normalizedQuery) || video.description.toLowerCase().includes(normalizedQuery);
            return matchesCategory && matchesQuery;
        });

        videoGrid.innerHTML = visibleVideos.map((video) => `
            <article class="video-card" data-id="${video.id}">
                <div class="video-thumb" data-id="${video.id}">
                    <div class="play-icon">▶</div>
                    <span class="video-duration">${video.duration}</span>
                </div>
                <div class="video-card-body">
                    <h3>${video.title}</h3>
                    <p>${video.description}</p>
                    <div class="video-card-actions">
                        <button class="btn btn-primary watch-button" data-id="${video.id}" type="button">Watch</button>
                    </div>
                </div>
            </article>
        `).join('');

        attachWatchButtons();
    }

    function openModal(videoId) {
        const video = videos.find((item) => item.id === videoId);
        if (!video || !modalOverlay || !modalIframe || !modalTitle) return;
        modalTitle.textContent = video.title;
        modalIframe.src = `https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0`;
        modalOverlay.classList.add('open');
        modalOverlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (!modalOverlay || !modalIframe) return;
        modalOverlay.classList.remove('open');
        modalOverlay.setAttribute('aria-hidden', 'true');
        modalIframe.src = '';
        document.body.style.overflow = '';
    }

    function attachWatchButtons() {
        const watchButtons = document.querySelectorAll('.watch-button');
        const thumbs = document.querySelectorAll('.video-thumb');

        watchButtons.forEach((button) => {
            button.addEventListener('click', () => openModal(button.dataset.id));
        });

        thumbs.forEach((thumb) => {
            thumb.addEventListener('click', () => openModal(thumb.dataset.id));
        });
    }

    function initFilters() {
        categoryButtons.forEach((button) => {
            button.addEventListener('click', () => {
                categoryButtons.forEach((btn) => btn.classList.remove('active'));
                button.classList.add('active');
                renderVideos(button.textContent.trim(), searchInput ? searchInput.value : '');
            });
        });

        if (searchInput) {
            searchInput.addEventListener('input', () => {
                const activeTab = document.querySelector('.video-tab.active');
                const category = activeTab ? activeTab.textContent.trim() : 'All';
                renderVideos(category, searchInput.value);
            });
        }
    }

    function initModalEvents() {
        if (modalClose) {
            modalClose.addEventListener('click', closeModal);
        }

        if (modalOverlay) {
            modalOverlay.addEventListener('click', (event) => {
                if (event.target === modalOverlay) {
                    closeModal();
                }
            });
        }

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('open')) {
                closeModal();
            }
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        renderVideos();
        initFilters();
        initModalEvents();
    });
})();