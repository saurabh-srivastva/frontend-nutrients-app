// ==========================
// Allergen Detection
// ==========================
document.getElementById('allergenBtn')?.addEventListener('click', async function() {
    const foodInput = document.getElementById('allergenFood').value.trim();
    const resultElement = document.getElementById('allergenResult');
    if (!foodInput) {
        resultElement.textContent = "⚠️ Please enter a food name";
        return;
    }
    resultElement.innerHTML = `<div class="spinner"></div><div class="loading-text">🔍 Analyzing allergens...</div>`;
    resultElement.style.opacity = 0;
    try {
        const response = await fetch('http://localhost:5000/predict_allergen', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: foodInput })
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Server error');
        }
        displayAllergenResults(data, resultElement);
    } catch (error) {
        console.error("Error:", error);
        resultElement.innerHTML = `❌ Error: ${error.message || 'Failed to fetch allergen data'}`;
    } finally {
        resultElement.style.opacity = 1;
        resultElement.style.transition = "opacity 0.5s ease-in-out";
    }
});

function displayAllergenResults(data, element) {
    if (typeof data.result === 'string') {
        element.textContent = data.result;
    } else {
        let html = '<div class="allergen-results">';
        data.result.forEach(item => {
            html += `<div class="allergen-item"><strong>${item.food || 'N/A'}</strong><br>
            <em>Type:</em> ${item.type || 'N/A'}<br>
            <em>Group:</em> ${item.group || 'N/A'}<br>
            <em>Allergen:</em> ${item.allergy || 'No known allergens'}</div><hr>`;
        });
        html += '</div>';
        element.innerHTML = html || "No allergen data found for this food.";
    }
}

// ==========================
// Nutrition Estimation
// ==========================
document.getElementById('nutritionBtn')?.addEventListener('click', async function() {
    const foodInput = document.getElementById('nutritionFood').value.trim();
    const resultElement = document.getElementById('calorieResult');
    if (!foodInput) {
        resultElement.textContent = "⚠️ Please enter a food name";
        return;
    }
    resultElement.innerHTML = `<div class="spinner"></div><div class="loading-text">🔍 Calculating nutrition...</div>`;
    resultElement.style.opacity = 0;
    try {
        const response = await fetch('http://localhost:5000/predict_nutrition', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: foodInput })
        });
        const data = await response.json();
        if (!response.ok || !data.nutrition) {
            throw new Error(data.message || 'Server error');
        }
        resultElement.innerHTML = `<div class="nutrition-facts"><strong>🍎 Nutrition Facts for ${data.food}:</strong><br>
            <span>Calories:</span> ${data.nutrition.calories || 'N/A'} kcal<br>
            <span>Protein:</span> ${data.nutrition.protein || 'N/A'}g<br>
            <span>Carbs:</span> ${data.nutrition.carbs || 'N/A'}g<br>
            <span>Fat:</span> ${data.nutrition.fat || 'N/A'}g<br>
            <span>Fiber:</span> ${data.nutrition.fiber || 'N/A'}g</div>`;
    } catch (error) {
        console.error("Error:", error);
        resultElement.textContent = "❌ Error fetching nutrition data. Please try again.";
    } finally {
        resultElement.style.opacity = 1;
        resultElement.style.transition = "opacity 0.5s ease-in-out";
    }
});

// ==========================
// Recipe Suggestions
// ==========================
document.getElementById('recipeBtn')?.addEventListener('click', async function() {
    const dishInput = document.getElementById('dishName').value.trim();
    const resultElement = document.getElementById('recipeResult');
    if (!dishInput) {
        resultElement.textContent = "⚠️ Please enter a dish name";
        return;
    }
    resultElement.innerHTML = `<div class="spinner"></div><div class="loading-text">🔍 Searching recipes...</div>`;
    resultElement.style.opacity = 0;
    try {
        const response = await fetch('http://localhost:5000/recommend_recipes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: dishInput })
        });
        const data = await response.json();
        if (data.error) {
            throw new Error(data.error);
        }
        if (data.message) {
            resultElement.innerHTML = `<div class="message">${data.message}</div>`;
            return;
        }
        let html = '<div class="recipes-container">';
        data.recipes.forEach(recipe => {
            html += `<div class="recipe-card">
                <h3>${recipe.title || 'No title'}</h3>
                <div class="recipe-section">
                    <h4>Ingredients:</h4><p>${formatList(recipe.ingredients)}</p>
                </div>
                <div class="recipe-section">
                    <h4>Directions:</h4><p>${formatList(recipe.directions)}</p>
                </div>
                ${recipe.link ? `<a href="${recipe.link}" target="_blank">View Full Recipe</a>` : ''}
            </div>`;
        });
        html += '</div>';
        resultElement.innerHTML = html || '<div class="message">No recipes found</div>';
    } catch (error) {
        console.error("Recipe search error:", error);
        resultElement.innerHTML = `<div class="error">❌ Error: ${error.message || 'Failed to fetch recipes'}<br><small>Make sure the backend server is running</small></div>`;
    } finally {
        resultElement.style.opacity = 1;
        resultElement.style.transition = "opacity 0.5s ease-in-out";
    }
});

function formatList(text) {
    if (Array.isArray(text)) {
        return text.join('<br>');
    }
    return (text || '').replace(/[\[\]'"]/g, '').replace(/,/g, '<br>');
}