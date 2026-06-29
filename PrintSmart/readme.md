# PrintSmart - Smart Printing Order & Pickup System

A complete web-based system for managing print orders and pickups with separate interfaces for students and shop owners.

## Features

### Student Interface
- **Landing Page**: Browse features and get started
- **Authentication**: Secure login and signup
- **Dashboard**: View order statistics and recent orders
- **Order Creation**: Upload files, select print options, and place orders
- **Order Tracking**: Monitor order status from pending to completion
- **Account Management**: Update profile and preferences

### Shop Owner Interface
- **Dashboard**: Overview of pending, processing, and ready orders
- **Order Management**: View all orders with search and filter capabilities
- **Status Updates**: Change order status through the workflow
- **Analytics**: View business metrics and charts
- **Real-time Stats**: Track revenue, completion rates, and order distribution

## Technology Stack

- **Frontend**: HTML5, Tailwind CSS, vanilla JavaScript
- **Storage**: Browser LocalStorage
- **Icons**: Font Awesome 6.4
- **Charts**: Chart.js 3.9
- **Color Scheme**: Modern dark theme with indigo/purple accents

## File Structure

\`\`\`
├── index.html                 # Main landing page
├── students/
│   ├── index.html            # Student landing page
│   ├── login.html            # Student login
│   ├── signup.html           # Student signup
│   ├── dashboard.html        # Student dashboard
│   ├── order-create.html     # Create new order
└── shop/
    ├── index.html            # Shop login
    ├── dashboard.html        # Shop dashboard
\`\`\`

## Getting Started

1. **Open the Landing Page**: Start at `index.html`
2. **Choose Your Role**:
   - Students: Click "Student Portal" to access the student interface
   - Shop Owners: Click "Shop Portal" to access the shop interface

## Demo Credentials

### Student Account
- Email: student@example.com
- Password: password123

### Shop Account
- Shop Name: Shop
- Password: password

## Key Features

### Order Lifecycle
1. Student creates order with files and options
2. Shop owner receives order notification
3. Owner moves order through workflow (Pending → Processing → Ready)
4. Student picks up completed order
5. Order marked as completed

### Pricing System
- Black & White: $0.10 per page
- Color: $0.30 per page
- Binding options available (Stapled, Spiral)

### Real-time Analytics
- Order status distribution charts
- Color mode usage analytics
- Revenue tracking
- Completion rate monitoring

## Utilities & Functions

### Auth Module
- User authentication
- Session management
- Logout functionality

### Orders Module
- Create, read, update orders
- Filter by status and user
- Calculate order statistics

### Pricing Module
- Dynamic price calculation
- Support for multiple options
- Currency formatting

### UI Module
- Notifications system
- Modal dialogs
- Data formatting utilities

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Data Storage

All data is stored locally using browser LocalStorage. Data persists across browser sessions.

**Note**: Data is cleared when browser cache is cleared.

## Customization

### Colors
Edit `shared/styles.css` to customize the color scheme:
- Primary color: `--color-primary`
- Secondary color: `--color-secondary`
- Accent colors for status badges

### Pricing
Update the pricing rates in `shared/utils.js`:
\`\`\`javascript
Pricing.rates = {
  bw: 0.10,
  color: 0.30,
  binding_stapled: 0.50,
  binding_spiral: 1.50
}
\`\`\`

### Status Badges
Customize status badge colors in `shared/styles.css`

## Future Enhancements

- Backend API integration
- Payment gateway integration
- Email notifications
- SMS alerts
- Inventory management
- Printing history reports
- Advanced search filters
- Multi-language support
- Mobile app

## Support

For issues or feature requests, please contact support@printsmart.com

---

Made with by the PrintSmart Team
