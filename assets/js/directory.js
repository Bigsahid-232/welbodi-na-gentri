/* Welbodi na Gentri - Healthcare directory interactions */

(function() {
    'use strict';

    const facilities = [
        {
            id: 'f1',
            name: 'Connaught Hospital',
            type: 'hospital',
            district: 'western-area',
            address: 'Tower Hill, Freetown, Sierra Leone',
            phone: '+232 22 228 596',
            hours: 'Mon-Fri 8am-5pm, Sat 8am-12pm',
            lat: 8.4844,
            lng: -13.2319
        },
        {
            id: 'f2',
            name: 'Princess Christian Maternity Hospital',
            type: 'hospital',
            district: 'western-area',
            address: 'Juba, Freetown, Sierra Leone',
            phone: '+232 22 229 001',
            hours: '24/7',
            lat: 8.4799,
            lng: -13.2367
        },
        {
            id: 'f3',
            name: 'Rokupa Hospital',
            type: 'hospital',
            district: 'bo',
            address: 'Bo Town, Bo District, Sierra Leone',
            phone: '+232 32 222 222',
            hours: 'Mon-Fri 8am-5pm, Sat 8am-12pm',
            lat: 7.9621,
            lng: -11.7409
        },
        {
            id: 'f4',
            name: 'Kenema Government Hospital',
            type: 'hospital',
            district: 'kenema',
            address: 'Kenema Town, Kenema District, Sierra Leone',
            phone: '+232 33 999 999',
            hours: 'Mon-Fri 8am-5pm, Sat 8am-12pm',
            lat: 7.8769,
            lng: -11.1906
        },
        {
            id: 'f5',
            name: 'Makeni Government Hospital',
            type: 'hospital',
            district: 'makeni',
            address: 'Makeni Town, Bombali District, Sierra Leone',
            phone: '+232 52 222 222',
            hours: 'Mon-Fri 8am-5pm, Sat 8am-12pm',
            lat: 8.8861,
            lng: -12.0442
        },
        {
            id: 'f6',
            name: 'Koidu Government Hospital',
            type: 'hospital',
            district: 'kono',
            address: 'Koidu Town, Kono District, Sierra Leone',
            phone: '+232 72 222 222',
            hours: 'Mon-Fri 8am-5pm, Sat 8am-12pm',
            lat: 8.6439,
            lng: -10.9714
        },
        {
            id: 'f7',
            name: 'Central Medical Store Pharmacy',
            type: 'pharmacy',
            district: 'western-area',
            address: 'Siaka Stevens Street, Freetown, Sierra Leone',
            phone: '+232 22 228 500',
            hours: 'Mon-Fri 8am-6pm, Sat 8am-2pm',
            lat: 8.4844,
            lng: -13.2319
        },
        {
            id: 'f8',
            name: 'Bo District Health Clinic',
            type: 'clinic',
            district: 'bo',
            address: 'Bo Town Center, Bo District, Sierra Leone',
            phone: '+232 32 222 333',
            hours: 'Mon-Fri 8am-4pm',
            lat: 7.9621,
            lng: -11.7409
        },
        {
            id: 'f9',
            name: 'Kenema Community Clinic',
            type: 'clinic',
            district: 'kenema',
            address: 'Kenema Central, Kenema District, Sierra Leone',
            phone: '+232 33 999 888',
            hours: 'Mon-Fri 8am-4pm, Sat 8am-12pm',
            lat: 7.8769,
            lng: -11.1906
        },
        {
            id: 'f10',
            name: 'Partners In Health NGO Center',
            type: 'ngo',
            district: 'makeni',
            address: 'Makeni Rural Area, Bombali District, Sierra Leone',
            phone: '+232 52 333 444',
            hours: 'Mon-Fri 9am-5pm',
            lat: 8.8861,
            lng: -12.0442
        }
    ];

    const searchInput = document.getElementById('facility-search');
    const typeFilter = document.getElementById('type-filter');
    const districtFilter = document.getElementById('district-filter');
    const resultsCount = document.getElementById('results-count');
    const directoryGrid = document.getElementById('directory-grid');
    const facilityForm = document.getElementById('facility-form');
    const thankYou = document.getElementById('thank-you-message');
    const STORAGE_KEY = 'welbodiFacilitySubmissions';

    function isOpenNow(hours) {
        if (hours === '24/7') return true;
        const now = new Date();
        const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const currentTime = now.getHours() * 60 + now.getMinutes();

        // Simple parsing for "Mon-Fri 8am-5pm, Sat 8am-12pm"
        const parts = hours.split(', ');
        let todayHours = null;

        for (const part of parts) {
            if (part.includes('Mon-Fri') && day >= 1 && day <= 5) {
                todayHours = part.replace('Mon-Fri ', '');
            } else if (part.includes('Sat') && day === 6) {
                todayHours = part.replace('Sat ', '');
            } else if (part.includes('Sun') && day === 0) {
                todayHours = part.replace('Sun ', '');
            }
        }

        if (!todayHours) return false;

        const [start, end] = todayHours.split('-');
        const startTime = parseTime(start);
        const endTime = parseTime(end);

        return currentTime >= startTime && currentTime <= endTime;
    }

    function parseTime(timeStr) {
        const [time, period] = timeStr.split(/(am|pm)/i);
        let [hours, minutes] = time.split(':').map(Number);
        if (period.toLowerCase() === 'pm' && hours !== 12) hours += 12;
        if (period.toLowerCase() === 'am' && hours === 12) hours = 0;
        return hours * 60 + (minutes || 0);
    }

    function renderFacilities(filteredFacilities) {
        if (!directoryGrid) return;
        directoryGrid.innerHTML = filteredFacilities.map((facility) => {
            const isOpen = isOpenNow(facility.hours);
            const statusClass = isOpen ? 'open' : 'closed';
            const statusText = isOpen ? 'Open Now' : 'Closed';
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(facility.address)}`;

            return `
                <article class="directory-card" data-id="${facility.id}">
                    <h3>${facility.name}</h3>
                    <span class="facility-type ${facility.type}">${facility.type.charAt(0).toUpperCase() + facility.type.slice(1)}</span>
                    <div class="facility-address">
                        <strong>${facility.district.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</strong><br>
                        ${facility.address}
                    </div>
                    <div class="facility-phone">
                        <span>📞</span>
                        <a href="tel:${facility.phone}">${facility.phone}</a>
                    </div>
                    <div class="facility-hours">
                        <strong>Hours:</strong> ${facility.hours}
                    </div>
                    <div class="facility-status ${statusClass}">
                        <span>●</span>
                        ${statusText}
                    </div>
                    <div class="facility-actions">
                        <a class="btn btn-primary" href="${mapsUrl}" target="_blank" rel="noopener">Get Directions</a>
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

        const filtered = facilities.filter((facility) => {
            const matchesQuery = query === '' ||
                facility.name.toLowerCase().includes(query) ||
                facility.address.toLowerCase().includes(query) ||
                facility.type.toLowerCase().includes(query);
            const matchesType = type === 'all' || facility.type === type;
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
        thankYou.style.display = 'block';
        thankYou.textContent = 'Thank you! Your facility suggestion has been saved for review.';
        facilityForm.reset();
    }

    document.addEventListener('DOMContentLoaded', () => {
        renderFacilities(facilities);

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
