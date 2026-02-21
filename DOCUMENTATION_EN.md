# Elite FX Insights - Frontend Documentation

Elite FX Insights is a Forex trading analysis and mentorship platform. This documentation details the frontend structure, user flows, and technical implementation.

## 1. Project Overview

### Goal
Provide a secure learning dashboard for both new and experienced traders.

### Key Features
- Dynamic meeting access control
- Payment gateway integration (Bkash)
- Comprehensive admin control panel
- Real-time session management

### Tech Stack (Frontend)
- **HTML5**: Semantic markup
- **Tailwind CSS**: Utility-first CSS framework
- **DaisyUI**: Component library built on Tailwind
- **Lucide Icons**: Modern icon system
- **Vanilla JavaScript**: Native JavaScript without external frameworks

## 2. Pages & Section Logic

### A. Home/Landing Page (`index.html`)

**Sections:**
1. **Navigation Bar** - Sticky header with links to Dashboard and Admin
2. **Hero Section** - Main value proposition with CTA button
3. **Services Section** - Three main service cards:
   - Live Sessions
   - Market Analysis
   - Dedicated Support
4. **Features Section** - Platform benefits highlight
5. **Footer** - Copyright and platform info

### B. User Dashboard (`dashboard.html`)

**Structure:**
Divided into two main tabs:

#### Tab 1: Meetings List
- **Orientation Meeting** (Always Unlocked)
  - Automatically unlocked for new users
  - Green border with "Unlocked" badge
  - Active "Join Meeting" button
  - Shows meeting date, time, and link
  
- **Subsequent Meetings** (Locked by Default)
  - Blurred background with CSS `backdrop-filter: blur(8px)`
  - "Payment Required" overlay message
  - No access without payment confirmation

#### Tab 2: Payment Form
**Form Fields:**
- Bkash number (with format validation)
- Payment amount (minimum 500 BDT)
- Transaction ID (TrxID)
- Additional comments (optional)

**Submission Flow:**
1. Validate all required fields
2. Show success confirmation
3. Update status to "Pending"
4. Display payment status card

### C. Admin Dashboard (`admin.html`)

**Theme:** Dark mode (Slate-900 `#1e293b` background)

#### Statistics Section
Four metric cards:
1. Total Members
2. Paid Members (✓ Paid)
3. Pending Payments (⏳ Waiting)
4. Due Payments (⚠️ Overdue)

#### Three Management Tabs:

**1. Member Management**
- Table view of all users
- Columns: Name, Email, Role, Join Date, Payment Status, Actions
- Role badges (Admin 👑 / User 👤)
- Payment status badges (Paid/Pending/Due)
- Edit member option

**2. Payment Verification**
- Card view of pending payments
- Each card shows:
  - User name
  - Bkash number (masked)
  - Amount
  - TrxID
  - Payment date
  - Status badge
  - Approve and Reject buttons

**3. Meeting Control**
Two forms:

a) **Update Meeting Link:**
   - Select meeting
   - New meeting link (Zoom/Google Meet URL)
   - Meeting datetime
   - Update button

b) **Unlock Meeting for User:**
   - Select user dropdown
   - Select meeting dropdown
   - Unlock button

## 3. Access Control Logic

Timeline-based access system:

| Event | Action | Status |
|-------|--------|--------|
| New Registration | First meeting unlocked | Active |
| Meeting Completed | Next meeting locked | Payment Due |
| Payment Submitted | Awaiting admin verification | Pending |
| Admin Approved | All links unlocked | Paid/Premium |

## 4. UI/UX Design Guide

### Color Palette

**User Interface:**
- Primary Blue: `#3b82f6` (Professional)
- Success Green: `#10b981` (Approval)
- Warning Yellow: `#f59e0b` (Pending)
- Danger Red: `#ef4444` (Rejection)

**Admin Interface:**
- Background: Slate-950 `#0f172a` (Very Dark)
- Surface: Slate-900 `#1e293b` (Cards)
- Border: Slate-700 `#334155`
- Text: Slate-100 `#f1f5f9`

### Typography
- Headings: Font-weight 700-900
- Body: Font-weight 400-500
- Labels: Font-weight 600-700
- Font Family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif

### Responsiveness
Tailwind breakpoints:
- Mobile (`< 640px`): Stacked layout
- Tablet (`640px - 1024px`): 2-column grid
- Desktop (`> 1024px`): Full layout

## 5. File Structure

```
elite-fx-insights/
├── index.html              # Landing page
├── dashboard.html          # User dashboard
├── admin.html             # Admin dashboard
├── css/
│   ├── styles.css         # General styles
│   └── admin.css          # Admin theme styles
├── js/
│   ├── main.js            # Home page logic
│   ├── dashboard.js       # Dashboard functionality
│   └── admin.js           # Admin functionality
└── assets/                # Images and resources
```

## 6. JavaScript Functions

### main.js
- `goToDashboard()` - Navigate to dashboard
- `handleLogout()` - User logout with confirmation
- Navigation smooth scrolling

### dashboard.js
- `showTab(tabName)` - Switch between tabs
- `joinMeeting(meetingId)` - Join a meeting
- `handlePaymentSubmit(event)` - Process payment form
- `updatePaymentStatus()` - Update payment display
- `closeModal()` - Close success modal

### admin.js
- `showAdminTab(tabName)` - Switch admin tabs
- `loadMembers()` - Load member table
- `loadPayments()` - Load payment cards
- `approvePayment(paymentId)` - Approve payment
- `rejectPayment(paymentId)` - Reject payment
- `handleUpdateMeeting(event)` - Update meeting link
- `handleUnlockMeeting(event)` - Unlock meeting for user
- `updateStats()` - Update statistics cards

## 7. Local Storage Keys

- `currentUser` - Current logged-in user ID
- `userRole` - User role (Admin/User)
- `paymentHistory` - User payment history

## 8. Security Considerations

**Current Implementation:**
- Mock data stored in browser memory
- No actual authentication

**Production Requirements:**
- JWT token-based authentication
- SSL/TLS encryption
- Backend payment processing
- CORS and CSRF protection
- Input sanitization
- Rate limiting

## 9. Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- IE11: Limited support

## 10. Performance Optimization

- Tailwind CSS (small file size)
- Font Awesome via CDN
- Vanilla JavaScript (no heavy framework)
- Efficient DOM manipulation
- CSS transitions and animations

## 11. Future Enhancements

- Backend API integration
- Real Bkash payment gateway
- Email notifications
- SMS alerts
- Video meeting integration
- Mobile app version
- Dark mode toggle
- Multi-language support

---

**Documentation Last Updated**: February 18, 2026
