/* Welbodi na Gentri - Nutrition page interactions */

(function() {
    'use strict';

    const dietButtons = document.querySelectorAll('.diet-btn');
    const dietCards = document.querySelectorAll('.diet-card');
    const bmiForm = document.getElementById('bmi-form');
    const bmiResult = document.getElementById('bmi-result');
    const bmiAdvice = document.getElementById('bmi-advice');
    const bmiResultCard = document.getElementById('bmi-result-card');

    function setActiveDiet(button) {
        dietButtons.forEach((item) => item.classList.toggle('active', item === button));
    }

    function showDiet(category) {
        dietCards.forEach((card) => {
            card.style.display = card.dataset.diet === category || category === 'all' ? 'block' : 'none';
        });
    }

    function calculateBMI(height, weight) {
        const meters = height / 100;
        return weight / (meters * meters);
    }

    function displayBMIResult(value) {
        const rounded = value.toFixed(1);
        let advice = '';
        let status = '';

        if (value < 18.5) {
            status = 'Underweight';
            advice = 'Add more nutrient-dense local foods like beans, rice, greens, and groundnuts.';
        } else if (value < 25) {
            status = 'Healthy weight';
            advice = 'Keep eating balanced meals and stay active with daily movement.';
        } else if (value < 30) {
            status = 'Overweight';
            advice = 'Reduce sugary drinks and portion sizes while keeping fruits, yams, and fish.';
        } else {
            status = 'Obese';
            advice = 'Focus on small daily changes like more vegetables, lean protein, and walking.';
        }

        bmiResult.textContent = `${rounded} — ${status}`;
        bmiAdvice.textContent = advice;

        if (bmiResultCard) {
            bmiResultCard.classList.add('visible');
        }
    }

    function handleBMIForm(event) {
        event.preventDefault();
        const formData = new FormData(bmiForm);
        const height = Number(formData.get('height'));
        const weight = Number(formData.get('weight'));

        if (height <= 0 || weight <= 0 || Number.isNaN(height) || Number.isNaN(weight)) {
            bmiResult.textContent = 'Please enter valid height and weight values.';
            bmiAdvice.textContent = '';
            if (bmiResultCard) {
                bmiResultCard.classList.add('visible');
            }
            return;
        }

        const bmiValue = calculateBMI(height, weight);
        displayBMIResult(bmiValue);
    }

    document.addEventListener('DOMContentLoaded', () => {
        dietButtons.forEach((button) => {
            button.addEventListener('click', () => {
                setActiveDiet(button);
                showDiet(button.dataset.target);
            });
        });

        if (bmiForm) {
            bmiForm.addEventListener('submit', handleBMIForm);
        }

        showDiet('all');
    });
})();