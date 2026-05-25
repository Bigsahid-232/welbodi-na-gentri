/* Welbodi na Gentri - Authentication and user management */

(function() {
    'use strict';

    const USERS_KEY = 'welbodiUsers';
    const CURRENT_USER_KEY = 'welbodi_user';

    function showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        if (!toast) return;
        toast.textContent = message;
        toast.className = `toast ${type}`;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }

    function getUsers() {
        try {
            const users = localStorage.getItem(USERS_KEY);
            return users ? JSON.parse(users) : {};
        } catch (error) {
            return {};
        }
    }

    function saveUsers(users) {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    function getCurrentUser() {
        try {
            const user = localStorage.getItem(CURRENT_USER_KEY);
            return user ? JSON.parse(user) : null;
        } catch (error) {
            return null;
        }
    }

    function setCurrentUser(user) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    }

    function clearCurrentUser() {
        localStorage.removeItem(CURRENT_USER_KEY);
    }

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validatePassword(password) {
        return password.length >= 8 && /[a-zA-Z]/.test(password) && /\d/.test(password);
    }

    function showFieldError(fieldId, message) {
        const errorEl = document.getElementById(fieldId + '-error');
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.add('show');
        }
    }

    function hideFieldError(fieldId) {
        const errorEl = document.getElementById(fieldId + '-error');
        if (errorEl) {
            errorEl.classList.remove('show');
        }
    }

    function showFieldValid(fieldId) {
        const field = document.getElementById(fieldId);
        if (field) {
            field.parentElement.classList.add('field-valid', 'show');
        }
    }

    function hideFieldValid(fieldId) {
        const field = document.getElementById(fieldId);
        if (field) {
            field.parentElement.classList.remove('field-valid', 'show');
        }
    }

    function validateField(fieldId, validator, errorMessage) {
        const field = document.getElementById(fieldId);
        if (!field) return false;

        const value = field.value.trim();
        const isValid = validator(value);

        if (isValid) {
            hideFieldError(fieldId);
            showFieldValid(fieldId);
        } else {
            hideFieldValid(fieldId);
            showFieldError(fieldId, errorMessage);
        }

        return isValid;
    }

    function handlePasswordToggle(event) {
        const button = event.target;
        const targetId = button.dataset.target;
        const input = document.getElementById(targetId);
        if (!input) return;

        const isVisible = input.type === 'text';
        input.type = isVisible ? 'password' : 'text';
        button.textContent = isVisible ? '👁️' : '🙈';
    }

    function handleRegister(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);

        let isValid = true;

        // Validate fields
        isValid &= validateField('full-name', value => value.length > 0, 'Full name is required');
        isValid &= validateField('email', value => validateEmail(value), 'Please enter a valid email address');
        isValid &= validateField('phone', value => value.length === 0 || /^\+?[\d\s-()]+$/.test(value), 'Please enter a valid phone number');
        isValid &= validateField('password', value => validatePassword(value), 'Password must be at least 8 characters with a letter and number');
        isValid &= validateField('confirm-password', value => value === formData.get('password'), 'Passwords do not match');
        isValid &= validateField('district', value => value.length > 0, 'Please select your district');

        const termsChecked = document.getElementById('terms').checked;
        if (!termsChecked) {
            showFieldError('terms', 'You must agree to the terms');
            isValid = false;
        } else {
            hideFieldError('terms');
        }

        if (!isValid) return;

        // Check if user already exists
        const users = getUsers();
        const email = formData.get('email');
        if (users[email]) {
            showToast('An account with this email already exists', 'error');
            return;
        }

        // Create user
        const user = {
            name: formData.get('full-name'),
            email: email,
            phone: formData.get('phone'),
            district: formData.get('district'),
            registeredAt: new Date().toISOString()
        };

        users[email] = user;
        saveUsers(users);
        setCurrentUser(user);

        showToast('Account created successfully! Welcome to Welbodi na Gentri.');
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1500);
    }

    function handleLogin(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);

        let isValid = true;

        isValid &= validateField('login-email', value => validateEmail(value), 'Please enter a valid email address');
        isValid &= validateField('login-password', value => value.length > 0, 'Password is required');

        if (!isValid) return;

        const users = getUsers();
        const email = formData.get('email');
        const user = users[email];

        if (!user) {
            showToast('No account found with this email address', 'error');
            return;
        }

        // For demo purposes, accept any password for existing users
        setCurrentUser(user);

        showToast(`Welcome back, ${user.name}!`);
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1500);
    }

    function handleForgotPassword(event) {
        event.preventDefault();
        const form = event.target;
        const email = form.elements.email.value;

        if (!validateEmail(email)) {
            showToast('Please enter a valid email address', 'error');
            return;
        }

        // Mock password reset
        showToast('Password reset link sent to your email');
        document.getElementById('forgot-modal').classList.remove('show');
        form.reset();
    }

    function handleLogout() {
        clearCurrentUser();
        showToast('Logged out successfully');
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }

    function initAuth() {
        // Password toggles
        document.querySelectorAll('.password-toggle').forEach(button => {
            button.addEventListener('click', handlePasswordToggle);
        });

        // Register form
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', handleRegister);
        }

        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', handleLogin);
        }

        // Forgot password
        const forgotLink = document.getElementById('forgot-password');
        const forgotModal = document.getElementById('forgot-modal');
        const modalClose = document.getElementById('modal-close');
        const resetForm = document.getElementById('reset-form');

        if (forgotLink && forgotModal) {
            forgotLink.addEventListener('click', (e) => {
                e.preventDefault();
                forgotModal.classList.add('show');
            });
        }

        if (modalClose && forgotModal) {
            modalClose.addEventListener('click', () => {
                forgotModal.classList.remove('show');
            });
        }

        if (forgotModal) {
            forgotModal.addEventListener('click', (e) => {
                if (e.target === forgotModal) {
                    forgotModal.classList.remove('show');
                }
            });
        }

        if (resetForm) {
            resetForm.addEventListener('submit', handleForgotPassword);
        }

        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', handleLogout);
        }
    }

    document.addEventListener('DOMContentLoaded', initAuth);
})();
