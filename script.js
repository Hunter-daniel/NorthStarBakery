/* ==========================================================================
   North Star Bakery - Interactive Features & Client-Side Data
   Features:
   1. Favorites / Pre-Order Wishlist Tracker (Arrays, Objects, DOM manipulation)
   2. LocalStorage Persistence across page refreshes
   3. JavaScript Form Validation with real-time field error messaging
   ========================================================================== */

// --- Data Structures ---
const menuCatalog = [
  { id: 'item-1', name: 'Signature Country Sourdough', price: 8.50, category: 'Bread' },
  { id: 'item-2', name: 'Honey Cardamom Bun', price: 4.50, category: 'Pastry' },
  { id: 'item-3', name: 'Butter Croissant', price: 3.75, category: 'Pastry' },
  { id: 'item-4', name: 'Rustic Olive Batard', price: 9.00, category: 'Bread' }
];

let userFavorites = [];

// --- Lifecycle Event Listener ---
document.addEventListener('DOMContentLoaded', () => {
  loadStoredFavorites();
  initFavoritesUI();
  initFormValidation();
});

/* ==========================================================================
   1. Interactive Feature: Wishlist / Favorites Tracker
   ========================================================================== */

// Load saved favorites from localStorage
function loadStoredFavorites() {
  const savedData = localStorage.getItem('northStar_favorites');
  if (savedData) {
    try {
      userFavorites = JSON.parse(savedData);
    } catch (e) {
      userFavorites = [];
    }
  }
}

// Save current favorites array to localStorage
function saveFavoritesToStorage() {
  localStorage.setItem('northStar_favorites', JSON.stringify(userFavorites));
}

// Initialize Favorite Buttons and Summary Banner
function initFavoritesUI() {
  const favoriteButtons = document.querySelectorAll('.fav-btn');
  
  favoriteButtons.forEach(button => {
    const itemId = button.getAttribute('data-item-id');
    
    // Set initial button state based on saved data
    if (userFavorites.includes(itemId)) {
      button.classList.add('active');
      button.textContent = '★ Saved in Wishlist';
    }

    button.addEventListener('click', () => {
      toggleFavorite(itemId, button);
    });
  });

  updateFavoritesDisplay();
}

// Toggle an item in/out of the user's favorites list
function toggleFavorite(itemId, buttonElement) {
  const itemIndex = userFavorites.indexOf(itemId);
  
  if (itemIndex === -1) {
    userFavorites.push(itemId);
    buttonElement.classList.add('active');
    buttonElement.textContent = '★ Saved in Wishlist';
  } else {
    userFavorites.splice(itemIndex, 1);
    buttonElement.classList.remove('active');
    buttonElement.textContent = '☆ Save to Wishlist';
  }

  saveFavoritesToStorage();
  updateFavoritesDisplay();
}

// Update the DOM to show user count of saved favorites
function updateFavoritesDisplay() {
  const countDisplay = document.getElementById('wishlist-count');
  const wishlistContainer = document.getElementById('wishlist-summary-list');
  
  if (countDisplay) {
    countDisplay.textContent = userFavorites.length;
  }

  if (wishlistContainer) {
    if (userFavorites.length === 0) {
      wishlistContainer.innerHTML = '<li><em>No items saved yet. Click "Save to Wishlist" on any product!</em></li>';
    } else {
      const savedItems = menuCatalog.filter(item => userFavorites.includes(item.id));
      wishlistContainer.innerHTML = savedItems
        .map(item => `<li><strong>${item.name}</strong> - $${item.price.toFixed(2)}</li>`)
        .join('');
    }
  }
}

/* ==========================================================================
   2. Form Validation & LocalStorage Pre-Fill
   ========================================================================== */

function initFormValidation() {
  const contactForm = document.getElementById('preorder-form');
  if (!contactForm) return;

  const nameInput = document.getElementById('user-name');
  const emailInput = document.getElementById('user-email');
  const dateInput = document.getElementById('pickup-date');

  // Pre-fill email from localStorage if user previously entered it
  const savedEmail = localStorage.getItem('northStar_userEmail');
  if (savedEmail && emailInput) {
    emailInput.value = savedEmail;
  }

  // Handle Form Submission
  contactForm.addEventListener('submit', (event) => {
    let isValid = true;

    // Clear previous error messages
    clearErrors();

    // Check 1: Required Name Field (Minimum length check)
    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      showError(nameInput, 'Please enter your full name (at least 2 characters).');
      isValid = false;
    }

    // Check 2: Email Format Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
      showError(emailInput, 'Please enter a valid email address (e.g., name@example.com).');
      isValid = false;
    }

    // Check 3: Pickup Date Check
    if (!dateInput.value) {
      showError(dateInput, 'Please select a requested pickup date.');
      isValid = false;
    }

    // Block submission if any check fails
    if (!isValid) {
      event.preventDefault();
    } else {
      // Save valid email to localStorage for future pre-filling
      localStorage.setItem('northStar_userEmail', emailInput.value.trim());
      alert('Thank you! Your pre-order request has been submitted.');
    }
  });
}

// Display custom error message directly below relevant field
function showError(inputElement, message) {
  inputElement.classList.add('input-error');
  const errorDiv = document.createElement('div');
  errorDiv.className = 'field-error-msg';
  errorDiv.style.color = '#c85a32';
  errorDiv.style.fontSize = '0.85rem';
  errorDiv.style.marginTop = '0.25rem';
  errorDiv.style.fontWeight = 'bold';
  errorDiv.textContent = message;
  
  inputElement.parentNode.insertBefore(errorDiv, inputElement.nextSibling);
}

// Clear all active error messages
function clearErrors() {
  document.querySelectorAll('.field-error-msg').forEach(msg => msg.remove());
  document.querySelectorAll('.input-error').forEach(input => input.classList.remove('input-error'));
}