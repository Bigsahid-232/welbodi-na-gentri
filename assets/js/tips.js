/* Welbodi na Gentri - Daily tips logic */

(function() {
    'use strict';

    const tips = [
        { id: 1, date: '2026-05-01', category: 'Nutrition', icon: '🥗', title: 'Choose whole foods first', shortText: 'Eat whole grains and vegetables before processed snacks.', fullText: 'A diet rich in whole foods keeps your body nourished, stabilizes blood sugar, and supports long-term energy. Choose locally grown grains, fruits, and vegetables for affordable, healthy meals.' },
        { id: 2, date: '2026-05-02', category: 'Hygiene', icon: '🧼', title: 'Wash hands regularly', shortText: 'Clean hands stop many infections before they start.', fullText: 'Handwashing with soap removes germs that spread disease, especially after using the toilet and before preparing food. Teach children the habit and make soap available in homes and schools.' },
        { id: 3, date: '2026-05-03', category: 'Exercise', icon: '🏃‍♀️', title: 'Move for 30 minutes', shortText: 'Daily walking helps your heart and mind.', fullText: 'Regular movement improves circulation, mood, and strength. A brisk walk, dancing, or farming tasks are all great ways to stay active.' },
        { id: 4, date: '2026-05-04', category: 'Mental Health', icon: '🧠', title: 'Practice gratitude', shortText: 'A short gratitude practice can improve your mood.', fullText: 'Taking a moment each morning to notice what you are grateful for supports resilience and reduces stress. Share gratitude with family members to strengthen bonds.' },
        { id: 5, date: '2026-05-05', category: 'Disease Prevention', icon: '🦠', title: 'Cover coughs and sneezes', shortText: 'Use your elbow or a cloth when you cough.', fullText: 'Covering your mouth and nose stops droplets from spreading. Dispose of tissues safely and wash your hands afterward.' },
        { id: 6, date: '2026-05-06', category: 'Child Care', icon: '👶', title: 'Keep baby feeding clean', shortText: 'Wash bottles and hands before every meal.', fullText: 'Safe feeding practices protect infants from diarrhoea and other infections. Clean utensils, boiled water, and careful handling are essential.' },
        { id: 7, date: '2026-05-07', category: 'Nutrition', icon: '🍛', title: 'Add greens to every meal', shortText: 'Leafy vegetables are powerful nutrition boosters.', fullText: 'Green leaves such as cassava, kontomire, or moringa are rich in vitamins and minerals. Include them in soups, stews, and salads.' },
        { id: 8, date: '2026-05-08', category: 'Hygiene', icon: '🚿', title: 'Keep water storage clean', shortText: 'Cover water containers and clean them weekly.', fullText: 'Clean water storage reduces the risk of contamination. Use safe containers and keep them covered when not in use.' },
        { id: 9, date: '2026-05-09', category: 'Mental Health', icon: '🌿', title: 'Take quiet time daily', shortText: 'A calm moment can help your mind rest.', fullText: 'Sitting quietly, breathing deeply, or reflecting on positive thoughts reduces stress and improves focus. Even five minutes can make a difference.' },
        { id: 10, date: '2026-05-10', category: 'Exercise', icon: '🧘', title: 'Stretch before you start', shortText: 'Gentle stretching protects your body before work.', fullText: 'A short routine before physical activity helps reduce muscle strain and keeps joints mobile. Stretch arms, legs, and back for at least two minutes.' },
        { id: 11, date: '2026-05-11', category: 'Disease Prevention', icon: '🛡️', title: 'Use a mosquito net', shortText: 'Sleep under a treated net every night.', fullText: 'Mosquito nets are one of the best defenses against malaria. Make sure the net is intact and tucked under the mattress.' },
        { id: 12, date: '2026-05-12', category: 'Child Care', icon: '🍼', title: 'Breastfeed for baby strength', shortText: 'Breast milk gives infants vital protection.', fullText: 'Exclusive breastfeeding for the first six months supports immunity and healthy growth. It is a powerful, natural way to nourish babies.' },
        { id: 13, date: '2026-05-13', category: 'Nutrition', icon: '🥑', title: 'Balance protein and carbs', shortText: 'Combine grains with beans or fish for lasting energy.', fullText: 'A meal with both protein and carbohydrates helps maintain energy and supports muscle repair. Local fish, beans, and peas are excellent choices.' },
        { id: 14, date: '2026-05-14', category: 'Hygiene', icon: '🧴', title: 'Keep your skin clean', shortText: 'Daily washing prevents infection and irritation.', fullText: 'Clean skin reduces the risk of bacterial and fungal infections. Use gentle soap and dry carefully, especially in skin folds.' },
        { id: 15, date: '2026-05-15', category: 'Exercise', icon: '🚶', title: 'Walk with a friend', shortText: 'Exercise is easier when you walk together.', fullText: 'A walking partner encourages consistency and turns movement into a social habit. Aim for a daily walk with family or neighbours.' }
    ];

    const LOCAL_STORAGE_KEY = 'welbodiSavedTips';

    function getDayOfYear(date) {
        const start = new Date(date.getFullYear(), 0, 0);
        const diff = (date - start) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60000);
        return Math.floor(diff / 86400000);
    }

    function formatDisplayDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    }

    function getSavedTips() {
        try {
            const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (error) {
            return [];
        }
    }

    function saveTip(id) {
        const saved = new Set(getSavedTips());
        if (saved.has(id)) {
            saved.delete(id);
        } else {
            saved.add(id);
        }
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([...saved]));
        return saved;
    }

    function renderTodayDate() {
        const dateElement = document.getElementById('today-date');
        if (!dateElement) return;
        const today = new Date();
        dateElement.textContent = formatDisplayDate(today.toISOString().split('T')[0]);
    }

    function selectTipOfDay() {
        const index = getDayOfYear(new Date()) % tips.length;
        return tips[index];
    }

    function renderSpotlightTip() {
        const title = document.getElementById('spotlight-title');
        const text = document.getElementById('spotlight-text');
        const category = document.getElementById('spotlight-category');
        const tip = selectTipOfDay();
        if (!title || !text || !category || !tip) return;
        title.textContent = tip.title;
        text.textContent = tip.fullText;
        category.textContent = tip.category;
    }

    function buildTipCard(tip) {
        return `
            <article class="tip-card" data-category="${tip.category}">
                <p class="tip-date">${formatDisplayDate(tip.date)}</p>
                <div class="tip-meta">
                    <span class="tip-category">${tip.category}</span>
                    <span>${tip.icon}</span>
                </div>
                <h3>${tip.title}</h3>
                <p>${tip.shortText}</p>
                <a class="read-more" href="#" data-tip-id="${tip.id}">Read More</a>
                <div class="tip-full" id="tip-full-${tip.id}"><p>${tip.fullText}</p></div>
            </article>
        `;
    }

    function renderTipsGrid(selectedCategory = 'all') {
        const grid = document.getElementById('tips-grid');
        if (!grid) return;
        const saved = getSavedTips();
        const visibleTips = tips.filter((tip) => selectedCategory === 'all' || tip.category === selectedCategory);
        grid.innerHTML = visibleTips.slice(0, 9).map(buildTipCard).join('');
        attachReadMoreEvents();
    }

    function renderArchive() {
        const archive = document.getElementById('archive-list');
        if (!archive) return;
        const sorted = [...tips].sort((a, b) => new Date(b.date) - new Date(a.date));
        archive.innerHTML = sorted.map((tip) => `
            <div class="archive-item">
                <div>
                    <strong>${tip.title}</strong>
                    <span>${tip.shortText}</span>
                </div>
                <div>
                    <time datetime="${tip.date}">${formatDisplayDate(tip.date)}</time>
                    <span class="tip-category">${tip.category}</span>
                </div>
            </div>
        `).join('');
    }

    function attachCategoryFilters() {
        const buttons = document.querySelectorAll('.tip-filter');
        buttons.forEach((button) => {
            button.addEventListener('click', () => {
                buttons.forEach((btn) => btn.classList.remove('active'));
                button.classList.add('active');
                renderTipsGrid(button.dataset.category);
            });
        });
    }

    function attachReadMoreEvents() {
        const links = document.querySelectorAll('.read-more');
        links.forEach((link) => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const id = link.dataset.tipId;
                const panel = document.getElementById(`tip-full-${id}`);
                if (!panel) return;
                panel.classList.toggle('open');
                link.textContent = panel.classList.contains('open') ? 'Show Less' : 'Read More';
            });
        });
    }

    function setupSaveTip() {
        const button = document.getElementById('save-tip-btn');
        const tip = selectTipOfDay();
        if (!button || !tip) return;

        const updateButtonLabel = () => {
            const saved = new Set(getSavedTips());
            button.textContent = saved.has(tip.id) ? 'Saved ❤️' : 'Save Tip ❤️';
        };

        button.addEventListener('click', () => {
            saveTip(tip.id);
            updateButtonLabel();
        });

        updateButtonLabel();
    }

    function renderHeroTip() {
        const heroTitle = document.getElementById('hero-tip-title');
        const heroText = document.getElementById('hero-tip-text');
        if (!heroTitle || !heroText) return;
        const tip = tips[Math.floor(Math.random() * tips.length)];
        heroTitle.textContent = tip.title;
        heroText.textContent = tip.shortText;
    }

    function renderDailyTipCard() {
        const dailyTip = document.getElementById('daily-tip');
        if (!dailyTip) return;
        const tip = tips[Math.floor(Math.random() * tips.length)];
        dailyTip.innerHTML = `
            <div class="daily-tip-card card">
                <p class="daily-tip-label">Today’s community health tip</p>
                <p class="daily-tip-text">${tip.fullText}</p>
            </div>
        `;
    }

    document.addEventListener('DOMContentLoaded', () => {
        renderTodayDate();
        renderSpotlightTip();
        renderTipsGrid();
        renderArchive();
        attachCategoryFilters();
        attachReadMoreEvents();
        setupSaveTip();
        renderHeroTip();
        renderDailyTipCard();
    });
})();
