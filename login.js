// Login credentials
const validCredentials = {
    'admin': 'admin123',
    'moderator': 'mod123',
    'yntimuz': 'yntimuz2024'
};

// DOM elements
const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');
const loginBtn = document.querySelector('.login-btn');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    if (localStorage.getItem('isLoggedIn') === 'true') {
        window.location.href = 'admin-panel.html';
    }
    
    // Add input animations
    addInputAnimations();
    
    // Add form validation
    addFormValidation();
});

// Toggle password visibility
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const passwordIcon = document.getElementById('passwordIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        passwordIcon.className = 'fas fa-eye-slash';
    } else {
        passwordInput.type = 'password';
        passwordIcon.className = 'fas fa-eye';
    }
}

// Add input animations
function addInputAnimations() {
    const inputs = document.querySelectorAll('input');
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (this.value === '') {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // Check if input has value on load
        if (input.value !== '') {
            input.parentElement.classList.add('focused');
        }
    });
}

// Add form validation
function addFormValidation() {
    const inputs = document.querySelectorAll('input[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', validateInput);
        input.addEventListener('input', clearError);
    });
}

// Validate individual input
function validateInput(e) {
    const input = e.target;
    const value = input.value.trim();
    
    if (value === '') {
        showInputError(input, 'Bu maydon to\'ldirilishi shart');
    } else if (input.type === 'password' && value.length < 6) {
        showInputError(input, 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak');
    } else {
        clearInputError(input);
    }
}

// Show input error
function showInputError(input, message) {
    clearInputError(input);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'input-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#e74c3c';
    errorDiv.style.fontSize = '0.8rem';
    errorDiv.style.marginTop = '0.25rem';
    
    input.parentElement.appendChild(errorDiv);
    input.style.borderColor = '#e74c3c';
}

// Clear input error
function clearInputError(input) {
    const errorDiv = input.parentElement.querySelector('.input-error');
    if (errorDiv) {
        errorDiv.remove();
    }
    input.style.borderColor = '#e1e8ed';
}

// Clear error message
function clearError() {
    errorMessage.style.display = 'none';
}

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 5000);
}

// Handle form submission
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    
    // Clear previous errors
    clearError();
    
    // Validate inputs
    if (!username || !password) {
        showError('Iltimos, barcha maydonlarni to\'ldiring');
        return;
    }
    
    // Show loading state
    loginBtn.classList.add('loading');
    
    // Simulate API call delay
    setTimeout(() => {
        // Check credentials
        if (validCredentials[username] && validCredentials[username] === password) {
            // Successful login
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username);
            localStorage.setItem('loginTime', new Date().toISOString());
            
            if (remember) {
                localStorage.setItem('rememberMe', 'true');
            }
            
            // Show success message
            showSuccessMessage();
            
            // Redirect to admin panel
            setTimeout(() => {
                window.location.href = 'admin-panel.html';
            }, 1500);
        } else {
            // Failed login
            loginBtn.classList.remove('loading');
            showError('Noto\'g\'ri foydalanuvchi nomi yoki parol');
            
            // Add shake animation
            loginForm.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                loginForm.style.animation = '';
            }, 500);
        }
    }, 1500);
});

// Show success message
function showSuccessMessage() {
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #27ae60, #2ecc71);
        color: white;
        padding: 2rem;
        border-radius: 10px;
        text-align: center;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 1000;
        animation: fadeInScale 0.5s ease-out;
    `;
    
    successDiv.innerHTML = `
        <i class="fas fa-check-circle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
        <h3>Muvaffaqiyatli!</h3>
        <p>Admin panelga yo'naltirilmoqda...</p>
    `;
    
    document.body.appendChild(successDiv);
    
    // Remove after redirect
    setTimeout(() => {
        successDiv.remove();
    }, 2000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
    
    @keyframes fadeInScale {
        0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5);
        }
        100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
    }
    
    .form-group.focused label {
        color: #4a90e2;
    }
`;
document.head.appendChild(style);

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Enter key to submit
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        loginForm.dispatchEvent(new Event('submit'));
    }
    
    // Escape key to clear form
    if (e.key === 'Escape') {
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        clearError();
    }
});

// Auto-fill demo credentials (for testing)
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        document.getElementById('username').value = 'admin';
        document.getElementById('password').value = 'admin123';
    }
});
