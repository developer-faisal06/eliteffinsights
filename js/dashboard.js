// Dashboard JavaScript - User Dashboard

// Mock Database for Users
const mockUsers = {
    'user1': {
        id: 'user1',
        name: 'আহমেদ রহিম',
        email: 'ahmed@example.com',
        status: 'Active',
        joinDate: '2026-02-01',
        paymentStatus: 'Paid',
        totalPaid: '500',
        meetings: [
            { id: 1, name: 'Orientation', unlocked: true, date: '2026-02-24', link: 'https://zoom.us/j/123456' },
            { id: 2, name: 'এডভান্সড মার্কেট এনালাইসিস', unlocked: false, date: '2026-03-03', link: null },
            { id: 3, name: 'রিস্ক ম্যানেজমেন্ট স্ট্র্যাটেজি', unlocked: false, date: '2026-03-10', link: null }
        ],
        payments: []
    }
};

// Show/Hide Tabs
function showTab(evt, tabName) {
    // Hide all tab panes
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.add('hidden');
    });

    // Deactivate all tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active', 'bg-primary', 'text-white');
    });

    // Show the selected tab pane
    document.getElementById(tabName + 'Content').classList.remove('hidden');

    // Activate the selected tab button
    evt.currentTarget.classList.add('active', 'bg-primary', 'text-white');
}

// Join Meeting
function joinMeeting(meetingId) {
    // Simulate meeting join
    const user = mockUsers['user1'];
    const meeting = user.meetings.find(m => m.id === meetingId);

    if (meeting && meeting.unlocked && meeting.link && meeting.status === 'running') {
        alert(`${meeting.name} মিটিংয়ে যোগদান করছেন...\n\nমিটিং লিংক: ${meeting.link}`);
    } else {
        alert('এই মিটিংটি লক করা আছে অথবা বাতিল/মেয়াদোত্তীর্ণ।');
    }
}

// Handle Payment Form Submission
function handlePaymentSubmit(event) {
    event.preventDefault();

    const bkashNumber = document.getElementById('bkashNumber').value;
    const paymentAmount = document.getElementById('paymentAmount').value;
    const trxId = document.getElementById('trxId').value;
    const notes = document.getElementById('paymentNotes').value;

    // Validation
    if (!bkashNumber || !paymentAmount || !trxId) {
        alert('দয়া করে সকল প্রয়োজনীয় তথ্য পূরণ করুন');
        return;
    }

    if (paymentAmount < 500) {
        alert('ন্যূনতম পেমেন্ট পরিমাণ ৫০০ টাকা');
        return;
    }

    // Store payment information
    const user = mockUsers['user1'];
    user.payments.push({
        amount: paymentAmount,
        bkashNumber: bkashNumber.substring(0, 3) + '****' + bkashNumber.substring(7),
        trxId: trxId,
        date: new Date().toLocaleDateString('bn-BD'),
        status: 'Pending',
        notes: notes
    });

    // Update user status
    user.paymentStatus = 'Pending';

    // Clear form
    document.getElementById('paymentForm').reset();

    // Show success modal
    document.getElementById('successModal').classList.remove('hidden');

    // Update UI
    updatePaymentStatus();

    // Log for debugging
    console.log('Payment submitted:', {
        bkashNumber: bkashNumber,
        amount: paymentAmount,
        trxId: trxId
    });
}

// Update Payment Status Display
function updatePaymentStatus() {
    const user = mockUsers['user1'];
    document.getElementById('paymentStatus').textContent = 
        user.paymentStatus === 'Paid' ? 'পেমেন্ট সম্পন্ন' : 'পেমেন্ট অপেক্ষমাণ';
    document.getElementById('totalPaid').textContent = user.totalPaid + ' টাকা';
}

// Close Modal
function closeModal() {
    document.getElementById('successModal').classList.add('hidden');
}

function updateUserStats() {
    const adminData = JSON.parse(localStorage.getItem('adminData') || '{}');
    const meetings = (adminData && adminData.meetings) || [];
    const total = meetings.length;
    const running = meetings.filter(m => m.status === 'running').length;
    const notices = JSON.parse(localStorage.getItem('notices') || '[]');
    const now = new Date();
    const activeNotices = notices.filter(n => {
        const publish = n.publish ? new Date(n.publish) : null;
        const expiry = n.expiry ? new Date(n.expiry) : null;
        if (publish && publish > now) return false;
        if (expiry && expiry < now) return false;
        return true;
    }).length;

    const setText = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = String(value);
    };

    setText('totalMeetings', total);
    setText('runningMeetings', running);
    setText('activeNotices', activeNotices);
    // userPaidStatus remains a label — keep default or compute from paymentRequests
    const payments = JSON.parse(localStorage.getItem('paymentRequests') || '[]');
    const unpaid = payments.filter(p => !p.paid).length;
    setText('userPaidStatus', unpaid ? `${unpaid} Due` : 'All Paid');
}

// Load User Data on Page Load
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = localStorage.getItem('currentUser') || 'user1';
    const user = mockUsers[currentUser];

    updateUserStats();
    if (user) {
        // Update user name
        document.getElementById('userName').textContent = user.name;
        document.getElementById('userStatus').textContent = user.status;

        // Update payment status
        updatePaymentStatus();

        // Render dynamic meeting cards
        renderMeetings();

        // Render any payment requests
        renderPaymentRequests();

        // Render notices
        renderUserNotices();

        // Set the initial active tab
        const firstTabButton = document.querySelector('.tab-btn');
        if (firstTabButton) {
            firstTabButton.click(); // Programmatically click the first tab
        }
    }

    console.log('Dashboard Loaded for user:', currentUser);
});

// Handle Logout
function handleLogout() {
    if (confirm('আপনি কি লগআউট করতে চান?')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
}

// Render notices for user dashboard
function renderUserNotices() {
    const notices = JSON.parse(localStorage.getItem('notices') || '[]');
    const container = document.getElementById('userNoticesContainer');
    if (!container) return;
    container.innerHTML = '';

    // filter active notices (published and not expired)
    const now = new Date();
    let active = notices.filter(n => {
        if (n.publishAt && new Date(n.publishAt) > now) return false;
        if (n.expiryAt && new Date(n.expiryAt) < now) return false;
        return true;
    });

    // sort pinned first, then priority
    const order = { 'urgent': 1, 'important': 2, 'normal': 3 };
    active.sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (b.pinned && !a.pinned) return 1;
        return order[a.priority] - order[b.priority];
    });

    active.forEach(n => {
        const card = document.createElement('div');
        const bgColor = n.priority === 'urgent' ? 'bg-error/10' : n.priority === 'important' ? 'bg-warning/10' : 'bg-primary/10';
        const borderColor = n.priority === 'urgent' ? 'border-error' : n.priority === 'important' ? 'border-warning' : 'border-primary';
        card.className = `${bgColor} ${borderColor} border-l-4 p-4 rounded-lg shadow-md`;
        if (n.pinned) card.className += ' ring-2 ring-secondary';
        card.innerHTML = `
            <div class="flex justify-between items-start gap-2">
                <div>
                    <p class="font-bold text-lg">${n.title}</p>
                    <p class="text-sm mt-1">${n.message}</p>
                    ${n.pinned ? '<p class="text-xs font-semibold text-secondary mt-1">📌 Pinned</p>' : ''}
                </div>
                <span class="badge badge-sm ${n.priority === 'urgent' ? 'badge-error' : n.priority === 'important' ? 'badge-warning' : 'badge-primary'}">${n.priority}</span>
            </div>
        `;
        container.appendChild(card);
    });
}

// Render meetings list dynamically based on user data and updates
function renderMeetings() {
    const user = mockUsers['user1'];
    const updates = JSON.parse(localStorage.getItem('meetingUpdates') || '{}');
    let container = document.getElementById('meetingsList');
    if (!container) container = document.querySelector('#meetingsContent .space-y-6');
    if (!container) return;
    container.innerHTML = '';

    // merge updates into meeting objects
    const meetings = user.meetings.map(m => ({ ...m, ...(updates[m.id] || {}) }));

    // sort by status priority running first, then by id desc
    const priority = { 'running': 1, 'completed': 2, 'expired': 3, 'canceled': 4, 'locked': 5 };
    meetings.sort((a, b) => {
        const statusA = a.status || (a.unlocked ? 'running' : 'locked');
        const statusB = b.status || (b.unlocked ? 'running' : 'locked');
        const p = priority[statusA] - priority[statusB];
        if (p !== 0) return p;
        return b.id - a.id;
    });

    meetings.forEach(m => {
        let statusText = '';
        if (m.status === 'running' || (m.unlocked && !m.status)) statusText = 'Running';
        else if (m.status === 'completed') statusText = 'Completed';
        else if (m.status === 'expired') statusText = 'Expired';
        else if (m.status === 'canceled') statusText = 'Cancelled';
        else statusText = 'Locked';

        const card = document.createElement('div');
        card.className = 'bg-white rounded-lg shadow-md p-6 border-l-4';
        if (statusText === 'Running') card.classList.add('border-secondary');
        else if (statusText === 'Cancelled') card.classList.add('border-error');
        else if (statusText === 'Expired') card.classList.add('border-warning');
        else card.classList.add('border-gray-300');

        let inner = `
            <div class="flex justify-between items-start mb-4">
                <div>
                    <h3 class="text-2xl font-bold text-gray-900">${m.name}</h3>
                    <p class="text-gray-600 mt-1">${m.description || ''}</p>
                </div>
                <span class="px-4 py-2 ${statusText==='Running'?'bg-secondary/20 text-secondary':'bg-gray-200 text-gray-600'} rounded-full text-sm font-bold">${statusText}</span>
            </div>
            <div class="grid grid-cols-3 gap-4 mb-4 text-sm text-gray-600">
                <div><i class="fas fa-calendar"></i> <span>${m.date}</span></div>
                <div><i class="fas fa-clock"></i> <span>${m.time || ''}</span></div>
                <div><i class="fas fa-link"></i> <span>${m.link? 'Link available':'Link locked'}</span></div>
            </div>
        `;

        if (statusText === 'Running' && m.unlocked && m.link) {
            inner += `<a href="#" onclick="joinMeeting(${m.id})" class="inline-block px-6 py-2 btn btn-secondary font-bold">
                        <i class="fas fa-video"></i> মিটিংয়ে যোগদান করুন
                      </a>`;
        }

        if (statusText === 'Cancelled' && m.reason) {
            inner += `<p class="mt-4 text-sm text-error">Reason: ${m.reason}</p>`;
        }

        card.innerHTML = inner;
        container.appendChild(card);
    });
}

// Render payment requests in payment tab
function renderPaymentRequests() {
    const user = mockUsers['user1'];
    const requests = JSON.parse(localStorage.getItem('paymentRequests') || '[]').filter(r => r.userId === user.email);
    const container = document.getElementById('paymentRequestsContainer');
    if (!container) return;
    container.innerHTML = '';
    if (requests.length === 0) {
        container.innerHTML = '<p class="text-center text-gray-600">কোনো পেমেন্ট রিকোয়েস্ট নেই।</p>';
        return;
    }
    requests.forEach(req => {
        const div = document.createElement('div');
        div.className = 'bg-base-100 p-4 rounded-lg border-l-4 border-secondary mb-4';
        div.innerHTML = `
            <p class="font-bold">Meeting ID: ${req.meetingId}</p>
            <p class="text-sm mb-2">Requested: ${req.percent}% of your income</p>
            <div class="flex gap-2 items-center">
                <input type="number" placeholder="Total Income" class="input input-sm input-bordered flex-1" oninput="calculatePayable(this, ${req.percent})">
                <span class="text-sm font-bold text-secondary">Payable: <span class="payable-amount">0</span> ৳</span>
            </div>
        `;
        container.appendChild(div);
    });
}

// helper for income calculation
function calculatePayable(input, percent) {
    const val = parseFloat(input.value) || 0;
    const pay = (val * percent / 100).toFixed(2);
    const span = input.parentElement.querySelector('.payable-amount');
    if (span) span.textContent = pay;
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('successModal');
    if (event.target === modal) {
        closeModal();
    }
});
