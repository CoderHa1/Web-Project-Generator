document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to current tab and content
            tab.classList.add('active');
            document.getElementById(tabId).classList.add('active');
            
            // Add animation class
            document.getElementById(tabId).classList.add('fade-in');
            setTimeout(() => {
                document.getElementById(tabId).classList.remove('fade-in');
            }, 500);
        });
    });
    
    // Check if user is already logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        window.location.href = 'dashboard.html';
    }
    
    // Login form submission
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Find user with matching email and password
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Store current user in localStorage
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            // Redirect to dashboard
            showToast('Login successful! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            showToast('Invalid email or password', 'error');
        }
    });
    
    // Signup form submission
    const signupForm = document.getElementById('signup-form');
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm').value;
        
        // Validate password match
        if (password !== confirmPassword) {
            showToast('Passwords do not match', 'error');
            return;
        }
        
        // Get existing users
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Check if email already exists
        if (users.some(u => u.email === email)) {
            showToast('Email already in use', 'error');
            return;
        }
        
        // Create new user
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password,
            projects: [],
            completedProjects: [],
            projectsCompleted: 0,
            totalHours: 0
        };
        
        // Add user to array
        users.push(newUser);
        
        // Save to localStorage
        localStorage.setItem('users', JSON.stringify(users));
        
        // Set as current user
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        
        // Show success message and redirect
        showToast('Account created successfully! Redirecting...', 'success');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    });
    
    // Toast notification function
    function showToast(message, type = 'info') {
        // Remove any existing toasts
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }
        
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
            <div class="toast-progress"></div>
        `;
        
        // Add toast to the body
        document.body.appendChild(toast);
        
        // Show the toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Hide the toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }
    
    // Add toast styles
    const style = document.createElement('style');
    style.textContent = `
        .toast {
            position: fixed;
            bottom: 20px;
            right: 20px;
            min-width: 300px;
            background-color: white;
            color: var(--gray-800);
            padding: 0;
            border-radius: var(--border-radius);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            overflow: hidden;
            transform: translateY(100px);
            opacity: 0;
            transition: transform 0.3s ease, opacity 0.3s ease;
            z-index: 9999;
        }
        
        .toast.show {
            transform: translateY(0);
            opacity: 1;
        }
        
        .toast-content {
            display: flex;
            align-items: center;
            padding: 16px;
        }
        
        .toast i {
            margin-right: 12px;
            font-size: 1.4rem;
        }
        
        .toast.success i {
            color: #4ade80;
        }
        
        .toast.error i {
            color: #ef4444;
        }
        
        .toast.info i {
            color: #3b82f6;
        }
        
        .toast-progress {
            height: 4px;
            background-color: rgba(0, 0, 0, 0.1);
            width: 100%;
            position: relative;
        }
        
        .toast-progress::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            background-color: var(--primary-color);
            animation: progress 3s linear forwards;
        }
        
        @keyframes progress {
            0% { width: 100%; }
            100% { width: 0%; }
        }
        
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .fade-in {
            animation: fade-in 0.3s ease-out;
        }
        
        @media (max-width: 576px) {
            .toast {
                left: 20px;
                right: 20px;
                min-width: unset;
                max-width: calc(100% - 40px);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Add auth styles
    const authStyle = document.createElement('style');
    authStyle.textContent = `
        .auth-page {
            background: linear-gradient(135deg, #4361ee 0%, #3f37c9 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem 1rem;
        }
        
        .auth-container {
            max-width: 450px;
            width: 100%;
            background-color: white;
            border-radius: var(--border-radius-lg);
            box-shadow: var(--box-shadow-lg);
            overflow: hidden;
        }
        
        .auth-header {
            text-align: center;
            padding: 2rem 2rem 1rem;
        }
        
        .auth-header .logo {
            font-size: 1.8rem;
            font-weight: var(--font-weight-bold);
            color: var(--primary-color);
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 1rem;
        }
        
        .auth-header .logo i {
            margin-right: 0.75rem;
        }
        
        .tagline {
            color: var(--gray-600);
            font-size: 1rem;
        }
        
        .tabs {
            display: flex;
            width: 100%;
            margin: 0 0 1.5rem;
            background-color: var(--gray-100);
        }
        
        .tab {
            flex: 1;
            padding: 1.25rem 1rem;
            background: none;
            border: none;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.2s ease;
            font-weight: var(--font-weight-medium);
            color: var(--gray-600);
            position: relative;
        }
        
        .tab.active {
            color: var(--primary-color);
            background-color: white;
            font-weight: var(--font-weight-bold);
        }
        
        .tab.active::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background-color: var(--primary-color);
        }
        
        .tab-content {
            display: none;
            padding: 0 2rem 2rem;
        }
        
        .tab-content.active {
            display: block;
        }
        
        .input-group {
            position: relative;
            display: flex;
            align-items: center;
        }
        
        .input-icon {
            position: absolute;
            left: 1rem;
            color: var(--gray-500);
        }
        
        .input-group input {
            padding-left: 2.75rem !important;
        }
        
        .btn-block {
            width: 100%;
            margin-top: 1.5rem;
        }
        
        .auth-footer {
            text-align: center;
            padding: 1.5rem 2rem;
            border-top: 1px solid var(--gray-200);
            color: var(--gray-600);
            font-size: 0.9rem;
        }
        
        @media (max-width: 576px) {
            .auth-container {
                border-radius: var(--border-radius);
            }
            
            .auth-header, .tab-content {
                padding-left: 1.5rem;
                padding-right: 1.5rem;
            }
        }
    `;
    document.head.appendChild(authStyle);
}); 