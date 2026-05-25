/* Welbodi na Gentri - Healthcare directory interactions */

(function() {
    'use strict';

    let allFacilities = [];
    const searchInput = document.getElementById('facility-search');
    const typeFilter = document.getElementById('type-filter');
    const districtFilter = document.getElementById('district-filter');
    const resultsCount = document.getElementById('results-count');
    const directoryGrid = document.getElementById('directory-grid');
    const facilityForm = document.getElementById('facility-form');
    const thankYou = document.getElementById('thank-you-message');
    const STORAGE_KEY = 'welbodiFacilitySubmissions';

    // Load facilities from JSON
    async function loadFacilities() {
        try {
            const response = await fetch('../data/facilities.json');
            if (!response.ok) throw new Error('Failed to load facilities');
            const data = await response.json();
            allFacilities = data.facilities || [];
            renderFacilities(allFacilities);
            return allFacilities;
        } catch (error) {
            console.error('Error loading facilities:', error);
            showToast('Failed to load facility data. Please refresh the page.', 'error');
            return [];
        }
    }

    function isOpenNow(hours) {
        if (hours === '24/7' || !hours) return true;
        const now = new Date();
        const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const currentTime = now.getHours() * 60 + now.getMinutes();

        // Parse various hour formats
        const parts = hours.split('|').map(p => p.trim());
        let todayHours = null;

        for (const part of parts) {
            if (part.includes('24/7')) return true;
            if (part.includes('Mon-Fri') && day >= 1 && day <= 5) {
                todayHours = part.replace(/Mon-Fri:\s*/i, '').trim();
            } else if (part.includes('Sat') && day === 6) {
                todayHours = part.replace(/Sat\s*:\s*/i, '').trim();
            } else if (part.includes('Sun') && day === 0) {
                todayHours = part.replace(/Sun\s*:\s*/i, '').trim();
            }
        }

        if (!todayHours) return false;

        const [start, end] = todayHours.split('-').map(t => t.trim());
        const startTime = parseTime(start);
        const endTime = parseTime(end);

        return currentTime >= startTime && currentTime <= endTime;
    }

    function parseTime(timeStr) {
        const match = timeStr.match(/(\d{1,2}):?(\d{0,2})?\s*(am|pm)?/i);
        if (!match) return 0;

        let hours = parseInt(match[1], 10);
        const minutes = parseInt(match[2] || 0, 10);
        const period = match[3] ? match[3].toLowerCase() : '';

        if (period === 'pm' && hours !== 12) hours += 12;
        if (period === 'am' && hours === 12) hours = 0;

        return hours * 60 + minutes;
    }

    function renderFacilities(filteredFacilities) {
        if (!directoryGrid) return;
        
        if (filteredFacilities.length === 0) {
            directoryGrid.innerHTML = '<div class="no-results"><p>No facilities found matching your search criteria.</p></div>';
            updateResultsCount(0);
            return;
        }

        directoryGrid.innerHTML = filteredFacilities.map((facility) => {
            const isOpen = isOpenNow(facility.hours);
            const statusClass = isOpen ? 'open' : 'closed';
            const statusText = isOpen ? 'Open Now' : 'Closed';
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(facility.address + ', ' + facility.district)}`;
            const rating = facility.rating ? `⭐ ${facility.rating}/5 (${facility.reviews} reviews)` : '';

            return `
                <article class="directory-card facility-${facility.type.toLowerCase()}" data-id="${facility.id}">
                    <div class="card-header">
                        <h3>${facility.name}</h3>
                        <span class="facility-type type-${facility.type.toLowerCase()}">${facility.type}</span>
                    </div>
                    ${rating ? `<div class="facility-rating">${rating}</div>` : ''}
                    <div class="facility-info">
                        <div class="facility-location">
                            <strong>📍 Location:</strong><br>
                            ${facility.address}<br>
                            <span class="facility-district">${facility.district}</span>
                        </div>
                        <div class="facility-phone">
                            <strong>📞 Phone:</strong><br>
                            <a href="tel:${facility.phone}">${facility.phone}</a>
                        </div>
                        ${facility.email ? `
                        <div class="facility-email">
                            <strong>✉️ Email:</strong><br>
                            <a href="mailto:${facility.email}">${facility.email}</a>
                        </div>` : ''}
                        <div class="facility-hours">
                            <strong>🕐 Hours:</strong><br>
                            ${facility.hours}
                        </div>
                    </div>
                    ${facility.services && facility.services.length > 0 ? `
                    <div class="facility-services">
                        <strong>Services:</strong>
                        <ul>
                            ${facility.services.slice(0, 4).map(service => `<li>${service}</li>`).join('')}
                        </ul>
                    </div>` : ''}
                    <div class="facility-status ${statusClass}">
                        <span class="status-indicator">●</span>
                        <span>${statusText}</span>
                    </div>
                    <div class="facility-actions">
                        <a class="btn btn-primary" href="${mapsUrl}" target="_blank" rel="noopener">Get Directions</a>
                        ${facility.website ? `<a class="btn btn-outline" href="${facility.website}" target="_blank" rel="noopener">Visit Website</a>` : ''}
                    </div>
                </article>
            `;
        }).join('');

        updateResultsCount(filteredFacilities.length);
    }

    function updateResultsCount(count) {
        if (resultsCount) {
            resultsCount.textContent = `Showing ${count} facilit${count === 1 ? 'y' : 'ies'}`;
        }
    }

    function filterFacilities() {
        const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const type = typeFilter ? typeFilter.value : 'all';
        const district = districtFilter ? districtFilter.value : 'all';

        const filtered = allFacilities.filter((facility) => {
            const matchesQuery = query === '' ||
                facility.name.toLowerCase().includes(query) ||
                facility.address.toLowerCase().includes(query) ||
                facility.district.toLowerCase().includes(query) ||
                facility.type.toLowerCase().includes(query);
            const matchesType = type === 'all' || facility.type.toLowerCase() === type.toLowerCase();
            const matchesDistrict = district === 'all' || facility.district === district;
            return matchesQuery && matchesType && matchesDistrict;
        });

        renderFacilities(filtered);
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
        const formData = new FormData(facilityForm);
        const submission = {
            name: formData.get('name'),
            type: formData.get('type'),
            district: formData.get('district'),
            address: formData.get('address'),
            phone: formData.get('phone'),
            hours: formData.get('hours'),
            date: new Date().toISOString()
        };
        saveSubmission(submission);
        showToast('Thank you! Your facility suggestion has been saved for review.', 'success');
        facilityForm.reset();
    }

    function showToast(message, type = 'info') {
        const toastContainer = document.querySelector('.toast-container') || createToastContainer();
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <span class="toast-icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
            <div class="toast-content">
                <div class="toast-message">${message}</div>
            </div>
        `;
        toastContainer.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    function createToastContainer() {
        const container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
        return container;
    }

    document.addEventListener('DOMContentLoaded', () => {
        // Load facilities from JSON
        loadFacilities();

        if (searchInput) {
            searchInput.addEventListener('input', filterFacilities);
        }

        if (typeFilter) {
            typeFilter.addEventListener('change', filterFacilities);
        }

        if (districtFilter) {
            districtFilter.addEventListener('change', filterFacilities);
        }

        if (facilityForm) {
            facilityForm.addEventListener('submit', handleFormSubmit);
        }
    });
})();
