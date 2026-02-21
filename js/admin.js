// Admin Dashboard JavaScript - Elite FX Insights
// Platform management and monitoring system

// Mock Admin Data
const adminData = {
    members: [
        { id: 1, name: 'Ahmed Rahim', email: 'ahmed@example.com', role: 'Admin', joinDate: '2026-01-15', paymentStatus: 'Paid' },
        { id: 2, name: 'Fatima Khan', email: 'fatima@example.com', role: 'User', joinDate: '2026-02-01', paymentStatus: 'Paid' },
        { id: 3, name: 'Karim Ali', email: 'karim@example.com', role: 'User', joinDate: '2026-02-05', paymentStatus: 'Pending' },
        { id: 4, name: 'Sumaiya Begum', email: 'sumaiya@example.com', role: 'User', joinDate: '2026-02-10', paymentStatus: 'Due' },
        { id: 5, name: 'Rahim Ahmed', email: 'rahim@example.com', role: 'User', joinDate: '2026-02-12', paymentStatus: 'Paid' },
        { id: 6, name: 'Nazim Ahmed', email: 'nazim@example.com', role: 'User', joinDate: '2026-02-15', paymentStatus: 'Pending' },
        { id: 7, name: 'Maria Yasmin', email: 'maria@example.com', role: 'User', joinDate: '2026-02-18', paymentStatus: 'Paid' },
    ],
    pendingPayments: [
        { id: 1, userName: 'Karim Ali', bkashNumber: '017****1234', amount: 500, trxId: 'ABC123XYZ456', date: '2026-02-16', status: 'Pending' },
        { id: 2, userName: 'Rahim Ahmed', bkashNumber: '018****5678', amount: 500, trxId: 'DEF789UVW012', date: '2026-02-17', status: 'Pending' },
        { id: 3, userName: 'Nazim Ahmed', bkashNumber: '019****9012', amount: 750, trxId: 'GHI345JKL678', date: '2026-02-18', status: 'Pending' },
    ],
    meetings: [
        { id: 1, category: 'orientation', title: 'Orientation & Onboarding Session', link: 'https://zoom.us/j/123456', dateTime: '2026-02-24T15:00', status: 'running', cancelReason: null },
        { id: 2, category: 'market-analysis', title: 'Advanced Market Analysis Weekly', link: 'https://zoom.us/j/234567', dateTime: '2026-03-03T15:00', status: 'running', cancelReason: null },
        { id: 3, category: 'risk-management', title: 'Risk Management Strategy Masterclass', link: 'https://zoom.us/j/345678', dateTime: '2026-03-10T15:00', status: 'running', cancelReason: null },
        { id: 4, category: 'trading-signals', title: 'Live Trading Signals Session', link: 'https://zoom.us/j/456789', dateTime: '2026-02-25T10:00', status: 'running', cancelReason: null },
        { id: 5, category: 'personal-coaching', title: 'Personal Coaching with Expert', link: 'https://zoom.us/j/567890', dateTime: '2026-02-26T14:00', status: 'running', cancelReason: null },
        { id: 6, category: 'orientation', title: 'New Member Onboarding', link: 'https://zoom.us/j/678901', dateTime: '2026-03-01T11:00', status: 'completed', cancelReason: null },
        { id: 7, category: 'market-analysis', title: 'Previous Market Analysis', link: 'https://zoom.us/j/789012', dateTime: '2026-02-20T10:00', status: 'expired', cancelReason: null },
    ],
    notices: JSON.parse(localStorage.getItem('notices') || '[]')
};

let currentAction = null;
let currentMeetingPage = 1;
const meetingsPerPage = 5;
let currentSortType = 'status'; // Default sort by status (running first)
let currentSortOrder = 'asc'; // asc or desc for date
let meetingToCancel = null;

// Save notices to localStorage
function saveNotices() {
    localStorage.setItem('notices', JSON.stringify(adminData.notices));
}

// Load notices (called after any change)
function loadNotices() {
    const container = document.getElementById('noticesListContainer');
    if (!container) return;

    // sort pinned first, then priority (urgent, important, normal), then publishAt desc
    const order = { 'urgent': 1, 'important': 2, 'normal': 3 };
    const now = new Date();
    let notes = [...adminData.notices];
    notes.sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (b.pinned && !a.pinned) return 1;
        const p = order[a.priority] - order[b.priority];
        if (p !== 0) return p;
        return new Date(b.publishAt || 0) - new Date(a.publishAt || 0);
    });
    container.innerHTML = '';
    notes.forEach(n => {
        const card = document.createElement('div');
        card.className = 'bg-base-100 p-4 rounded-lg border-l-4';
        if (n.priority === 'urgent') card.classList.add('border-error');
        else if (n.priority === 'important') card.classList.add('border-warning');
        else card.classList.add('border-primary');
        let info = '';
        if (n.publishAt) {
            const dt = new Date(n.publishAt);
            info += `<p class="text-xs">Publish: ${dt.toLocaleString()}</p>`;
        }
        if (n.expiryAt) {
            const dt = new Date(n.expiryAt);
            info += `<p class="text-xs">Expiry: ${dt.toLocaleString()}</p>`;
        }
        card.innerHTML = `
            <div class="flex justify-between">
                <div>
                    <p class="font-bold">${n.title}</p>
                    <p class="text-sm mb-2">${n.message}</p>
                    ${info}
                </div>
                <div class="flex flex-col gap-1">
                    <button onclick="togglePin(${n.id})" class="btn btn-xs btn-outline">${n.pinned?'Unpin':'Pin'}</button>
                    <button onclick="deleteNotice(${n.id})" class="btn btn-xs btn-error">Delete</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function togglePin(id) {
    const notice = adminData.notices.find(n => n.id === id);
    if (notice) {
        notice.pinned = !notice.pinned;
        saveNotices();
        loadNotices();
    }
}

function deleteNotice(id) {
    adminData.notices = adminData.notices.filter(n => n.id !== id);
    saveNotices();
    loadNotices();
}

function handleAddNotice(event) {
    event.preventDefault();
    const title = document.getElementById('noticeTitle').value.trim();
    const message = document.getElementById('noticeMessage').value.trim();
    const priority = document.getElementById('noticePriority').value;
    const publishAt = document.getElementById('noticePublish').value || new Date().toISOString();
    const expiryAt = document.getElementById('noticeExpiry').value || null;
    const pinned = document.getElementById('noticePin').checked;
    const sendEmail = document.getElementById('noticeEmail').checked;
    const notifyApp = document.getElementById('noticeNotify').checked;

    if (!title || !message) {
        alert('Title and message are required');
        return;
    }
    const newNotice = {
        id: adminData.notices.length + 1,
        title, message, priority,
        publishAt, expiryAt,
        pinned, sendEmail, notifyApp,
        createdAt: new Date().toISOString()
    };
    adminData.notices.unshift(newNotice);
    saveNotices();
    loadNotices();
    document.getElementById('addNoticeForm').reset();
    alert('Notice added');
}

// Show Admin Tabs
function showAdminTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.admin-tab-content').forEach(content => {
        content.classList.add('hidden');
    });

    // Show selected tab
    const content = document.getElementById(tabName + 'Content');
    if (content) {
        content.classList.remove('hidden');
    }

    // Load tab-specific content
    if (tabName === 'members') {
        loadMembers();
    } else if (tabName === 'payments') {
        loadPayments();
    } else if (tabName === 'notices') {
        loadNotices();
    } else if (tabName === 'meetings') {
        loadMeetingControls();
    } else if (tabName === 'reports') {
        loadReports();
    } else if (tabName === 'activity') {
        loadActivityLog();
    } else if (tabName === 'settings') {
        loadSettings();
    }
}

// Load Reports
function loadReports() {
    console.log('Reports tab loaded');
    // Reports data is displayed via HTML
}

// Load Activity Log
function loadActivityLog() {
    console.log('Activity log loaded');
    // Activity log is displayed via HTML table
}

// Load Settings
function loadSettings() {
    console.log('Settings panel loaded');
    // Settings are displayed via HTML toggles and buttons
}

// Load Members Management
function loadMembers() {
    const tbody = document.getElementById('membersTableBody');
    tbody.innerHTML = '';

    adminData.members.forEach(member => {
        const row = document.createElement('tr');
        const statusBadge = `<span class="badge badge-${member.paymentStatus === 'Paid' ? 'success' : member.paymentStatus === 'Pending' ? 'warning' : 'error'}">${member.paymentStatus === 'Paid' ? '✓ Paid' : member.paymentStatus === 'Pending' ? '⏳ Pending' : '⚠️ Due'}</span>`;
        const roleBadge = `<span class="badge badge-${member.role.toLowerCase()}">${member.role === 'Admin' ? '👑 Admin' : '👤 User'}</span>`;

        row.innerHTML = `
            <td>${member.name}</td>
            <td>${member.email}</td>
            <td>${roleBadge}</td>
            <td>${member.joinDate}</td>
            <td>${statusBadge}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editMember(${member.id})">Edit</button>
            </td>
        `;
        tbody.appendChild(row);
    });

    // Update stats
    updateStats();
}

// Load Payment Verification
function loadPayments() {
    const container = document.getElementById('paymentsListContainer');
    container.innerHTML = '';

    adminData.pendingPayments.forEach(payment => {
        const card = document.createElement('div');
        card.className = 'card bg-base-200 shadow-lg mb-4';
        card.innerHTML = `
            <div class="card-body">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h3 class="text-lg font-bold">${payment.userName}</h3>
                        <p class="text-sm opacity-70">Payment ID: ${payment.id}</p>
                    </div>
                    <span class="badge badge-warning">Pending</span>
                </div>

                <div class="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                        <p class="label label-text opacity-70">Bkash Number</p>
                        <p class="font-mono text-base">${payment.bkashNumber}</p>
                    </div>
                    <div>
                        <p class="label label-text opacity-70">Amount</p>
                        <p class="text-success font-bold">${payment.amount} Tk</p>
                    </div>
                    <div>
                        <p class="label label-text opacity-70">Transaction ID</p>
                        <p class="font-mono text-base">${payment.trxId}</p>
                    </div>
                    <div>
                        <p class="label label-text opacity-70">Date</p>
                        <p class="text-base">${payment.date}</p>
                    </div>
                </div>

                <div class="flex gap-3">
                    <button class="btn btn-success btn-sm flex-1" onclick="approvePayment(${payment.id})">
                        <i class="fas fa-check"></i> Approve
                    </button>
                    <button class="btn btn-error btn-sm flex-1" onclick="rejectPayment(${payment.id})">
                        <i class="fas fa-times"></i> Reject
                    </button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Sort Meetings
function sortMeetings(sortType) {
    // If clicking same sort button, toggle order (only for date)
    if (sortType === 'date') {
        if (currentSortType === 'date') {
            currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
        } else {
            currentSortOrder = 'asc';
        }
        currentSortType = sortType;
    } else if (sortType === 'id') {
        if (currentSortType === 'id') {
            currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
        } else {
            currentSortOrder = 'asc';
        }
        currentSortType = sortType;
    } else if (sortType === 'a-z') {
        currentSortType = 'a-z';
        currentSortOrder = 'asc';
    } else if (sortType === 'z-a') {
        currentSortType = 'z-a';
        currentSortOrder = 'desc';
    } else if (sortType === 'status') {
        currentSortType = 'status';
        currentSortOrder = 'asc';
    }
    
    currentMeetingPage = 1; // Reset to first page when sorting
    loadMeetingsList();
}

// Load Meeting Controls
function loadMeetingControls() {
    loadMeetingsList();
}

// Load Meetings List with Pagination and Sorting
function loadMeetingsList() {
    const container = document.getElementById('meetingsListContainer');
    
    // Sort meetings
    let sortedMeetings = [...adminData.meetings];
    
    // Status priority: running > completed > expired > canceled
    const statusPriority = { 'running': 1, 'completed': 2, 'expired': 3, 'canceled': 4 };
    
    if (currentSortType === 'status') {
        // Sort by status (active first)
        sortedMeetings.sort((a, b) => {
            return statusPriority[a.status] - statusPriority[b.status];
        });
    } else if (currentSortType === 'date') {
        // Sort by date with ascending/descending
        sortedMeetings.sort((a, b) => {
            const dateA = new Date(a.dateTime);
            const dateB = new Date(b.dateTime);
            return currentSortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });
    } else if (currentSortType === 'id') {
        // Sort by ID with ascending/descending
        sortedMeetings.sort((a, b) => {
            return currentSortOrder === 'asc' ? a.id - b.id : b.id - a.id;
        });
    } else if (currentSortType === 'a-z') {
        // Sort A-Z
        sortedMeetings.sort((a, b) => a.title.localeCompare(b.title));
    } else if (currentSortType === 'z-a') {
        // Sort Z-A
        sortedMeetings.sort((a, b) => b.title.localeCompare(a.title));
    }
    
    const totalMeetings = sortedMeetings.length;
    const totalPages = Math.ceil(totalMeetings / meetingsPerPage);

    // Update sort order indicators
    const dateSortElement = document.getElementById('dateSortOrder');
    const idSortElement = document.getElementById('idSortOrder');
    
    if (currentSortType === 'date') {
        dateSortElement.textContent = currentSortOrder === 'asc' ? '↑' : '↓';
        idSortElement.textContent = '';
    } else if (currentSortType === 'id') {
        dateSortElement.textContent = '';
        idSortElement.textContent = currentSortOrder === 'asc' ? '↑' : '↓';
    } else {
        dateSortElement.textContent = '';
        idSortElement.textContent = '';
    }

    // Update pagination info
    document.getElementById('meetingPageNumber').textContent = currentMeetingPage;
    document.getElementById('meetingsPageInfo').textContent = `Page ${currentMeetingPage} of ${totalPages}`;
    document.getElementById('meetingsTotalCount').textContent = totalMeetings;

    // Calculate start and end indices
    const startIndex = (currentMeetingPage - 1) * meetingsPerPage;
    const endIndex = startIndex + meetingsPerPage;
    const pageData = sortedMeetings.slice(startIndex, endIndex);

    // Clear container
    container.innerHTML = '';

    // if no meetings available show a friendly message
    if (pageData.length === 0) {
        container.innerHTML = '<p class="text-center opacity-70">No meetings found.</p>';
        // make sure pagination buttons reflect current state
        document.querySelector('button[onclick="previousMeetingPage()"]').disabled = currentMeetingPage === 1;
        document.querySelector('button[onclick="nextMeetingPage()"]').disabled = currentMeetingPage >= totalPages;
        return;
    }

    // Populate meetings
    pageData.forEach(meeting => {
        const categoryLabel = {
            'orientation': 'Orientation',
            'market-analysis': 'Market Analysis',
            'risk-management': 'Risk Management',
            'trading-signals': 'Trading Signals',
            'personal-coaching': 'Personal Coaching'
        }[meeting.category] || 'Other';

        // Status colors and icons
        let statusColor, statusIcon, statusText;
        if (meeting.status === 'running') {
            statusColor = 'badge-success';
            statusIcon = 'fas fa-play-circle';
            statusText = 'Running';
        } else if (meeting.status === 'completed') {
            statusColor = 'badge-primary';
            statusIcon = 'fas fa-check';
            statusText = 'Completed';
        } else if (meeting.status === 'expired') {
            statusColor = 'badge-warning';
            statusIcon = 'fas fa-clock';
            statusText = 'Expired';
        } else if (meeting.status === 'canceled') {
            statusColor = 'badge-error';
            statusIcon = 'fas fa-ban';
            statusText = 'Canceled';
        }

        const meetingCard = document.createElement('div');
        meetingCard.className = 'bg-gradient-to-r from-base-100 to-primary/5 p-3 rounded-lg border border-primary/20 hover:border-primary/40 transition';
        
        let cancelButtonHTML = '';
        let completeButtonHTML = '';
        if (meeting.status === 'running') {
            cancelButtonHTML = `
                <button onclick="openCancelMeetingModal(${meeting.id}, '${meeting.title}')" class="btn btn-xs btn-outline btn-error gap-1">
                    <i class="fas fa-times-circle"></i> Cancel
                </button>
            `;
            completeButtonHTML = `
                <button onclick="completeMeeting(${meeting.id})" class="btn btn-xs btn-success gap-1">
                    <i class="fas fa-check-circle"></i> Complete
                </button>
            `;
        }
        
        meetingCard.innerHTML = `
            <div class="flex justify-between items-start mb-2 gap-2">
                <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1 flex-wrap">
                        <span class="badge badge-sm badge-outline">#${meeting.id}</span>
                        <span class="badge badge-sm badge-primary">${categoryLabel}</span>
                        <span class="badge badge-sm ${statusColor}">
                            <i class="${statusIcon}"></i> ${statusText}
                        </span>
                    </div>
                    <p class="font-bold text-sm truncate">${meeting.title}</p>
                </div>
            </div>
            <div class="text-xs space-y-1 text-base-content opacity-80 mb-2">
                <p><i class="fas fa-link"></i> <a href="${meeting.link}" target="_blank" class="link link-primary truncate">${meeting.link}</a></p>
                <p><i class="fas fa-clock"></i> ${meeting.dateTime}</p>
            </div>
            <div class="flex gap-2">
                ${cancelButtonHTML}
                ${completeButtonHTML}
            </div>
        `;
        container.appendChild(meetingCard);
    });

    // Update button states
    document.querySelector('button[onclick="previousMeetingPage()"]').disabled = currentMeetingPage === 1;
    document.querySelector('button[onclick="nextMeetingPage()"]').disabled = currentMeetingPage >= totalPages;
}

// Previous Meeting Page
function previousMeetingPage() {
    if (currentMeetingPage > 1) {
        currentMeetingPage--;
        loadMeetingsList();
    }
}

// Next Meeting Page
function nextMeetingPage() {
    let sortedMeetings = [...adminData.meetings];
    
    // Apply same sorting logic as loadMeetingsList
    const statusPriority = { 'running': 1, 'completed': 2, 'expired': 3, 'canceled': 4 };
    
    if (currentSortType === 'status') {
        sortedMeetings.sort((a, b) => {
            const p = statusPriority[a.status] - statusPriority[b.status];
            if (p !== 0) return p;
            return b.id - a.id; // newest first when status equal
        });
    } else if (currentSortType === 'date') {
        sortedMeetings.sort((a, b) => {
            const dateA = new Date(a.dateTime);
            const dateB = new Date(b.dateTime);
            return currentSortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });
    } else if (currentSortType === 'id') {
        sortedMeetings.sort((a, b) => currentSortOrder === 'asc' ? a.id - b.id : b.id - a.id);
    } else if (currentSortType === 'a-z') {
        sortedMeetings.sort((a, b) => a.title.localeCompare(b.title));
    } else if (currentSortType === 'z-a') {
        sortedMeetings.sort((a, b) => b.title.localeCompare(a.title));
    }
    
    const totalPages = Math.ceil(sortedMeetings.length / meetingsPerPage);
    if (currentMeetingPage < totalPages) {
        currentMeetingPage++;
        loadMeetingsList();
    }
}

// Open Cancel Meeting Modal
function openCancelMeetingModal(meetingId, meetingTitle) {
    meetingToCancel = meetingId;
    document.getElementById('cancelMeetingTitle').textContent = meetingTitle;
    document.getElementById('cancellationReason').value = '';
    document.getElementById('cancelMeetingModal').classList.remove('modal-hidden');
    document.getElementById('cancelMeetingModal').classList.add('modal-open');
}

// Close Cancel Meeting Modal
function closeCancelModal() {
    document.getElementById('cancelMeetingModal').classList.add('modal-hidden');
    document.getElementById('cancelMeetingModal').classList.remove('modal-open');
    meetingToCancel = null;
    document.getElementById('cancellationReason').value = '';
}

// Submit Cancel Meeting
function submitCancelMeeting(event) {
    event.preventDefault();
    
    if (!meetingToCancel) return;
    
    const reason = document.getElementById('cancellationReason').value.trim();
    if (!reason) {
        alert('Please enter a cancellation reason');
        return;
    }
    
    const meeting = adminData.meetings.find(m => m.id === meetingToCancel);
    if (meeting) {
        meeting.status = 'canceled';
        meeting.cancelReason = reason;

        // persist update for users
        const updates = JSON.parse(localStorage.getItem('meetingUpdates') || '{}');
        updates[meeting.id] = { status: 'canceled', reason };
        localStorage.setItem('meetingUpdates', JSON.stringify(updates));

        alert(`Meeting "${meeting.title}" has been canceled.\nReason: ${reason}`);
        loadMeetingsList();
        closeCancelModal();
    }
}

// Mark a meeting as completed and send a payment-request to all users
function completeMeeting(meetingId) {
    const meeting = adminData.meetings.find(m => m.id === meetingId);
    if (!meeting) return;

    // ask for percentage
    let pct = prompt('What percentage do you want to charge users? (5,10,15,20)');
    if (!pct) return;
    pct = parseInt(pct, 10);
    if (![5,10,15,20].includes(pct)) {
        alert('Invalid percentage. Please enter 5, 10, 15 or 20.');
        return;
    }

    if (!confirm(`Are you sure you want to request ${pct}% from users as payment?`)) {
        return;
    }

    meeting.status = 'completed';

    // record meeting update
    const updates = JSON.parse(localStorage.getItem('meetingUpdates') || '{}');
    updates[meeting.id] = { status: 'completed', percent: pct };
    localStorage.setItem('meetingUpdates', JSON.stringify(updates));

    // create payment requests for every member (and persist)
    const requests = JSON.parse(localStorage.getItem('paymentRequests') || '[]');
    adminData.members.forEach(member => {
        requests.push({ userId: member.email, meetingId, percent: pct });
    });
    localStorage.setItem('paymentRequests', JSON.stringify(requests));

    alert(`Meeting "${meeting.title}" marked as completed and payment requests (${pct}%) sent to users.`);
    loadMeetingsList();
}


// Approve Payment
function approvePayment(paymentId) {
    const payment = adminData.pendingPayments.find(p => p.id === paymentId);
    if (!payment) return;

    alert(`Payment of ${payment.amount} Tk from ${payment.userName} has been approved.`);
    // Remove from pending payments
    adminData.pendingPayments = adminData.pendingPayments.filter(p => p.id !== paymentId);
    loadPayments();
}

// Reject Payment
function rejectPayment(paymentId) {
    const payment = adminData.pendingPayments.find(p => p.id === paymentId);
    if (!payment) return;

    alert(`Payment from ${payment.userName} has been rejected.`);
    // Remove from pending payments
    adminData.pendingPayments = adminData.pendingPayments.filter(p => p.id !== paymentId);
    loadPayments();
}

// Edit Member
function editMember(memberId) {
    const member = adminData.members.find(m => m.id === memberId);
    if (!member) return;

    alert(`Edit member: ${member.name}\nThis feature is coming soon!`);
}

// Confirm Action
function confirmAction() {
    if (!currentAction) return;

    if (currentAction.type === 'approve') {
        // Remove from pending payments
        adminData.pendingPayments = adminData.pendingPayments.filter(p => p.id !== currentAction.paymentId);
        alert(`${currentAction.userName}'s payment has been approved.`);
    } else if (currentAction.type === 'reject') {
        // Remove from pending payments
        adminData.pendingPayments = adminData.pendingPayments.filter(p => p.id !== currentAction.paymentId);
        alert(`${currentAction.userName}'s payment has been rejected.`);
    }

    closeActionModal();

    // Reload payments
    if (document.getElementById('paymentsContent') && !document.getElementById('paymentsContent').classList.contains('hidden')) {
        loadPayments();
    }
}

// Close Action Modal
function closeActionModal() {
    currentAction = null;
}

// Handle Update Meeting (Create/Update)
function handleUpdateMeeting(event) {
    event.preventDefault();

    const category = document.getElementById('meetingCategory').value;
    const title = document.getElementById('meetingTitle').value;
    const link = document.getElementById('meetingLink').value;
    const dateTime = document.getElementById('meetingDateTime').value;

    if (!category || !title || !link || !dateTime) {
        alert('Please fill in all fields');
        return;
    }

    // Create new meeting
    const newMeeting = {
        id: adminData.meetings.length + 1,
        category: category,
        title: title,
        link: link,
        dateTime: dateTime,
        status: 'running' // newly created meetings start running
    };

    // add to front so new running meetings appear top when sorted
    adminData.meetings.unshift(newMeeting);
    alert(`Meeting "${title}" created successfully!`);
    
    // Reset form and reload list
    document.getElementById('updateMeetingForm').reset();
    currentMeetingPage = 1;
    loadMeetingsList();
}

// Update Statistics
function updateStats() {
    const paidCount = adminData.members.filter(m => m.paymentStatus === 'Paid').length;
    const pendingCount = adminData.members.filter(m => m.paymentStatus === 'Pending').length;
    const dueCount = adminData.members.filter(m => m.paymentStatus === 'Due').length;

    document.getElementById('totalMembers').textContent = adminData.members.length;
    document.getElementById('paidMembers').textContent = paidCount;
    document.getElementById('pendingPayments').textContent = pendingCount;
    document.getElementById('dueMembers').textContent = dueCount;
}

// Handle Logout
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userRole');
        window.location.href = 'index.html';
    }
}

// Initialize on Page Load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin Dashboard Loaded');
    loadMembers();
});

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('actionModal');
    if (event.target === modal) {
        closeActionModal();
    }
});
