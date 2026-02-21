// Main JavaScript for Elite FX Insights - Home Page

// Navigate to Dashboard
function goToDashboard() {
    // In a real application, this would check authentication
    window.location.href = 'dashboard.html';
}

// Handle Logout
function handleLogout() {
    if (confirm('আপনি কি লগআউট করতে চান?')) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userRole');
        window.location.href = 'index.html';
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = localStorage.getItem('currentUser');
    
    // You can add initialization logic here
    console.log('Elite FX Insights - Home Page Loaded');
});

// Smooth scroll navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
