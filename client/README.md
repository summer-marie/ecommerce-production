# Client (Frontend) Documentation

## Getting Started

### Prerequisites

- [ ] Node.js (v16 or higher)
- [ ] npm or yarn package manager

### Installation

1. Navigate to the `client` directory:
    ```bash
    cd client
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file in the `client/` directory with the following content:
    ```env
    VITE_API_SERVER_URL=http://localhost:8010
    ```

## Directory Structure

```plaintext
client/
├── 📁 Core Application Files
│   ├── public/                # Static assets, favicon, manifest
│   ├── src/
│   │   ├── App.jsx           # Main app component and route definitions
│   │   ├── main.jsx          # React app entry point
│   │   ├── store.js          # Redux store setup and middleware
│   │   ├── App.css           # Global application styles
│   │   └── index.css         # Base styles and Tailwind imports
│   └── index.html            # Main HTML template
│
├── 🛡️ Authentication & Security
│   └── PrivateRoute.jsx      # Protected route wrapper for admin access
│
├── 🎨 User Interface Modules
│   ├── admin/                # Complete admin dashboard system (15+ components)
│   │   ├── AdminLayout.jsx   # Admin dashboard layout and navigation
│   │   ├── AdminLogin.jsx    # Authentication interface
│   │   ├── AdminOperatingHours.jsx # Business hours management
│   │   ├── AdminBootstrap.jsx # System initialization and setup
│   │   └── ...              # Order management, menu creation, user management
│   │
│   ├── customer/             # Customer-facing application pages
│   │   ├── CustomerLayout.jsx # Customer app layout and navigation
│   │   ├── OrderMenu.jsx     # Pizza ordering interface
│   │   ├── Checkout.jsx      # Payment and order completion
│   │   ├── OrderSuccess.jsx  # Order confirmation page
│   │   └── ...              # About, Contact, and customer service
│   │
│   └── components/           # Shared UI components (14+ reusable components)
│       ├── Navbar.jsx        # Navigation header
│       ├── Footer.jsx        # Application footer
│       ├── OperatingBanner.jsx # Business hours status banner
│       ├── SquarePayment.jsx # Square payment integration
│       ├── AlertSuccess.jsx  # Success notification components
│       └── ...              # Alerts, modals, performance monitoring
│
├── 🔄 State Management
│   └── redux/               # Complete Redux state management system (📄 See redux/README.md)
│       ├── *Service.js      # API service layers for all features
│       ├── *Slice.js        # Redux state slices for all app modules
│       └── ...              # Orders, payments, auth, operating hours, etc.
│
├── ⚖️ Legal & Compliance
│   └── legal/               # Legal pages and compliance components
│       ├── PrivacyPolicy.jsx # Privacy policy page
│       ├── TermsCond.jsx    # Terms and conditions
│       ├── Licensing.jsx    # Software licensing information
│       └── legalMeta.js     # Legal metadata and configurations
│
├── 🛠️ Utilities & Tools
│   ├── utils/               # Utility functions and performance tools
│   │   ├── apiBase.js       # API base configuration
│   │   ├── imageUtils.js    # Image processing utilities
│   │   ├── performance.jsx  # Performance monitoring utilities
│   │   └── perfComponents.jsx # Performance tracking components
│   │
│   ├── assets/              # Static images and media files
│   ├── Colors.jsx           # Color theme definitions
│   └── TestingAlert.jsx     # Development testing component
```
## Environment Variables

| Variable            | Description          | Required |
| ------------------- | -------------------- | -------- |
| VITE_API_SERVER_URL | Backend API base URL | Yes      |

## Running the Client

**Development mode:**

```bash
npm run dev
```
**Production build:**
```bash
npm run build
```
**Preview production build:**
```bash
npm run preview
```

## 🚀 Key Features & Functionality

### 🏪 **Customer Experience Features**
- **Interactive Pizza Builder**: Custom pizza creation with real-time pricing
- **Order Management**: Cart, checkout, and order tracking
- **Square Payment Integration**: Secure payment processing with multiple payment methods
- **Operating Hours Awareness**: Dynamic ordering based on business hours
- **Order Confirmation**: Email receipts and order success pages
- **Responsive Design**: Mobile-first design with Tailwind CSS

### 🛡️ **Admin Dashboard Features**
- **Complete Order Management**: View, update, and track all orders (open/archived)
- **Operating Hours Control**: Set weekly schedules and special hours/holidays
- **Menu Management**: Create, update, delete pizzas with image uploads
- **Ingredient Management**: Full CRUD operations for pizza ingredients
- **User Administration**: Add admins, change passwords, user management
- **Customer Service**: Message inbox and customer communication
- **System Bootstrap**: Initial system setup and configuration
- **About Page Management**: Update store information and policies

### 💳 **Payment & E-commerce Features**
- **Square Integration**: Complete payment processing with Square API
- **Secure Transactions**: PCI-compliant payment handling
- **Order-Payment Linking**: Automatic payment-to-order association
- **Receipt Generation**: Automated email receipts for customers
- **Payment Status Tracking**: Real-time payment status monitoring

### ⚙️ **Advanced System Features**
- **Performance Monitoring**: Built-in performance tracking and optimization
- **Operating Hours Logic**: Automatic order blocking during closed hours
- **Admin Alerts**: Real-time notifications for new orders
- **Legal Compliance**: Privacy policy, terms, and licensing pages
- **PWA Support**: Service worker and manifest for app-like experience
- **Image Optimization**: Automatic image processing and display
- **State Persistence**: Redux persist for cart and session management

## 🔧 **Core Architecture**

### App Initialization & Routing
- **Entry Point**: `main.jsx` - React app mounting with Redux Provider, PersistGate, and BrowserRouter
- **Route Management**: `App.jsx` - Complete application routing with protected admin routes
- **Layout Systems**: Separate customer and admin layouts for optimal UX
- **Authentication**: `PrivateRoute.jsx` - Route protection with Redux auth state checking

### State Management Architecture
- **Redux Toolkit**: Modern Redux with RTK Query for API management
- **Comprehensive Slices**: Orders, ingredients, builders, cart, auth, messages, operating hours, payments
- **Service Layer**: Dedicated API service files for each feature module
- **State Persistence**: Redux-persist for cart continuity across sessions
- **Real-time Updates**: Automatic UI updates based on server state changes
  
### Image Handling
- Admins can upload pizza images via forms.
- Images are displayed with consistent aspect ratios using Tailwind CSS utility classes.
#### Image Upload Implementation
The frontend handles image uploads through FormData and specialized input components:

```jsx
// Frontend Form Implementation
<input
  type="file"
  name="image"
  accept="image/*"
  onChange={handleFileChange}
/>
```

**Process Flow:**
- Uses `FormData` to package pizza details with image file
- Implements file input with mime-type restrictions
- Handles file selection and preview
- Sends multipart form data to backend
- Displays uploaded images with consistent styling:
  ```jsx
  <img
    src={`${import.meta.env.VITE_API_SERVER_URL}/uploads/${filename}`}
    className="aspect-[4/3] object-cover rounded-t-lg"
    alt="Pizza"
  />
  ```

**Features:**
- Preview before upload
- File type validation
- Consistent aspect ratios
- Fallback image system
- Responsive image display

## 🎨 **UI/UX Features**

### Modern Design System
- **Tailwind CSS**: Utility-first responsive design system
- **Component Library**: 14+ reusable UI components
- **Consistent Theming**: Centralized color and style management (`Colors.jsx`)
- **Mobile-First Design**: Responsive across all device sizes
- **Accessibility**: WCAG compliant components and navigation

### Advanced UI Components
- **Operating Banner**: Dynamic business hours status display
- **Payment Interface**: Secure Square payment integration UI
- **Performance Monitor**: Real-time app performance tracking display
- **Alert System**: Success, error, and info notification components
- **Loading States**: Professional loading animations and states

### Layout Systems
- **Customer Layout**: Optimized for shopping and ordering experience
- **Admin Layout**: Comprehensive dashboard with sidebar navigation
- **Responsive Navigation**: Mobile-friendly hamburger menu and desktop nav
- **Footer**: Consistent footer with legal links and store information

## 🔄 **API Integration & Communication**

### Service Architecture
- **Centralized API Base**: Configured in `utils/apiBase.js`
- **Feature-Based Services**: Dedicated service files for each app module in `redux/`
- **Error Handling**: Comprehensive error management across all API calls
- **Loading States**: Automatic loading state management for all requests

### API Features
- **Authentication**: JWT-based secure API communication
- **File Uploads**: FormData handling for image uploads
- **Real-time Updates**: Automatic state synchronization with server
- **Offline Support**: Graceful handling of network connectivity issues

## 🔐 **Security & Authentication**

### Authentication System
- **JWT Integration**: Secure token-based authentication
- **Route Protection**: `PrivateRoute.jsx` for admin area security
- **Session Management**: Automatic session handling and renewal
- **Secure Logout**: Complete session cleanup on logout

### Data Security
- **Input Validation**: Client-side validation with server-side verification
- **XSS Protection**: Sanitized user inputs and secure rendering
- **CSRF Protection**: Cross-site request forgery prevention
- **Secure Payment Processing**: PCI-compliant payment handling

## 📱 **Progressive Web App Features**

### PWA Capabilities
- **Service Worker**: Offline functionality and caching
- **Web App Manifest**: App-like installation experience
- **Push Notifications**: Real-time order status notifications (when enabled)
- **Offline Mode**: Basic functionality during network outages

### Performance Optimization
- **Code Splitting**: Lazy loading for optimal bundle sizes
- **Image Optimization**: Responsive images with proper sizing
- **Caching Strategy**: Intelligent asset and API response caching
- **Performance Monitoring**: Built-in performance tracking (`utils/performance.jsx`)

## 📊 **Development & Testing Tools**

### Development Features
- **Hot Module Replacement**: Instant development feedback
- **Redux DevTools**: Complete state debugging capabilities  
- **Component Testing**: Individual component testing utilities
- **Performance Profiling**: Built-in performance measurement tools

### Debugging Tools
- **Testing Alert**: Development-only testing component (`TestingAlert.jsx`)
- **Performance Components**: Real-time performance monitoring (`utils/perfComponents.jsx`)
- **Console Logging**: Structured logging for development
- **Error Boundaries**: Graceful error handling and reporting

## 🚀 **Build & Deployment**

### Build Configuration
- **Vite**: Lightning-fast build tool and dev server
- **Environment Variables**: Secure configuration management
- **Asset Optimization**: Automatic image and asset optimization
- **Bundle Analysis**: Built-in bundle size analysis

### Production Features
- **Optimized Builds**: Minified and optimized production builds
- **Asset Caching**: Long-term asset caching strategies
- **SEO Optimization**: Meta tags and structured data
- **Performance Monitoring**: Production performance tracking

### Notes
- Make sure the backend server is running and accessible at the URL specified in `VITE_API_SERVER_URL`.
- For best results, use the same Node.js version as the backend.
- All environment variables must be set before running