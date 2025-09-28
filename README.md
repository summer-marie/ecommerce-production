# 🍕 Pizza E-commerce App – Complete E-commerce Platform

**A full-featured pizza ordering platform with advanced admin tools, secure payments, and comprehensive business management.**

## 🚀 **Technology Stack & Architecture**

### **🎨 Frontend Technologies**
- **React 19.0.0** - Latest React with modern features and performance improvements
- **Redux Toolkit 2.6.1** - Modern Redux with RTK Query for efficient state management
- **React Router 7.4.1** - Latest routing with enhanced navigation capabilities
- **Tailwind CSS 4.1.2** - Cutting-edge utility-first CSS framework
- **Vite 6.2.0** - Lightning-fast build tool and development server
- **Square Web SDK 2.1.0** - Secure payment processing integration

**Performance & UX Libraries:**
- **React Window & Virtualization** - Optimized rendering for large datasets
- **React Intersection Observer** - Efficient scroll-based interactions
- **Redux Persist** - Seamless state persistence across sessions

### **🛡️ Backend Technologies**
- **Node.js with Express.js 5.1.0** - Latest Express with enhanced security and performance
- **MongoDB with Mongoose 8.13.1** - Modern NoSQL database with robust ODM
- **ES Modules** - Native JavaScript module system for better performance

**Security & Authentication:**
- **Passport.js 0.7.0** - Comprehensive authentication strategies (JWT & Local)
- **Argon2 0.41.1** - State-of-the-art password hashing (more secure than bcrypt)
- **JSON Web Tokens 9.0.2** - Secure token-based authentication
- **Helmet 8.1.0** - Advanced security headers and protection
- **Express Rate Limiting & Slow Down** - DDoS and abuse prevention
- **HPP 0.2.3** - HTTP Parameter Pollution protection

**Business Logic & Integrations:**
- **Square API 43.0.1** - Enterprise payment processing with PCI compliance
- **SendGrid 8.1.3** - Professional email delivery and notifications
- **Luxon 3.5.0** - Modern date/time handling (successor to Moment.js)
- **Node-cron 4.2.1** - Reliable scheduled task management

**Performance & Monitoring:**
- **Winston 3.17.0** - Professional logging with multiple transports
- **Compression 1.8.1** - Response compression for faster delivery
- **Connect-Mongo 5.1.0** - Efficient MongoDB session storage

### **🛠️ Development & Testing Tools**
- **ESLint 9.21.0** - Latest linting with React-specific rules
- **Faker.js 9.6.0** - Realistic test data generation
- **MongoDB Memory Server 10.2.0** - In-memory database for testing
- **Nodemon 3.1.10** - Development auto-restart functionality

### **📁 Architecture Highlights**
- **Monorepo Structure** - Organized `/client`, `/server`, and `/test` directories
- **Base64 Image Processing** - Secure image handling without external dependencies
- **Microservice-Ready Design** - Modular architecture for easy scaling
- **Comprehensive Documentation** - Full technical docs for all components
- **Automated Testing Suite** - Complete testing framework with data seeding

### **🎯 Modern Development Practices**
- **Latest Framework Versions** - Using React 19, Tailwind 4, Express 5, Vite 6
- **Security-First Approach** - Argon2, JWT, comprehensive middleware protection
- **Performance Optimization** - Virtualization, compression, caching strategies
- **Developer Experience** - Hot reloading, TypeScript support, ESLint integration
- **Production Ready** - Professional logging, monitoring, error handling

---

## 📈 **Technical Achievements**

This platform demonstrates mastery of:
- **🏗️ Modern Full-Stack Architecture** - Latest React, Express, and MongoDB technologies
- **🔒 Enterprise Security Standards** - PCI compliance, advanced authentication, comprehensive protection
- **⚡ High Performance Design** - Optimized rendering, efficient data handling, fast loading
- **📱 Progressive Web App** - Modern web standards with app-like functionality  
- **🚀 Scalable Foundation** - Modular design ready for enterprise deployment

**Pizza E-commerce App** represents a production-ready platform built with cutting-edge technologies, demonstrating professional-level full-stack development capabilities and modern web development best practices. Pizza E-commerce App! This application demonstrates a complete e-commerce solution with sophisticated features for both customers and business administrators.

---

## 🎯 **Platform Overview**

Pizza E-commerce App is a modern, full-stack e-commerce platform that provides:
- **Customer Experience**: Interactive pizza ordering with real-time customization
- **Business Management**: Complete admin dashboard for operations management  
- **Payment Processing**: Secure Square payment integration
- **Advanced Features**: Operating hours management, automated alerts, performance monitoring

---
- **Frontend**: Modern React application with Redux state management
- **Backend**: Robust Node.js/Express API with comprehensive middleware
- **Database**: MongoDB with Mongoose ODM for scalable data management
- **Testing**: Comprehensive testing suite with automated database seeding

### **Key Technology Integrations**
- **Payment Processing**: Square API integration for secure transactions
- **Email Services**: SendGrid integration for automated notifications
- **Authentication**: JWT-based security with Passport.js strategies
- **File Management**: Multer-based image upload and storage system

### **Development & Deployment**
- **Monorepo Structure**: Organized `/client`, `/server`, and `/test` directories
- **Environment Management**: Comprehensive environment configuration
- **Documentation**: Complete technical documentation for all components
- **Monitoring**: Built-in performance and system health monitoring

---

## 📚 **Documentation Structure**

For detailed technical information, see the specialized README files:

- **📁 `/client/README.md`** - Frontend architecture, components, and Redux state management
- **📁 `/server/README.md`** - Backend API, middleware, and database configuration  
- **📁 `/test/README.md`** - Testing framework, seeding scripts, and validation tools
- **📁 `/server/utils/README.md`** - Email services, cleanup utilities, and automation tools
- **📁 `/server/middleware/README.md`** - Security, performance, and validation middleware
- **📁 `/server/payments/README.md`** - Square payment integration and transaction management
- **📁 `/server/scripts/README.md`** - Administrative scripts and maintenance tools

### 📝 Logging

Structured logging is implemented across the backend (routes, utilities, scripts, tests) using a centralized Pino logger with request and operation correlation. For event naming standards, level usage, redaction guidance, and examples, see: **`LOGGING_CONVENTIONS.md`**.

Example (inside an Express route handler):

```js
import { getLog } from './logger.js';

export async function createOrder(req, res) {
	const log = getLog(req, { feature: 'orderCreate' });
	log.info({ event: 'order.create.start', itemCount: req.body.items?.length || 0 }, 'Creating order');
	try {
		// domain logic ...
		const order = await orderService.create(req.body, req.user);
		log.info({ event: 'order.create.success', orderId: order._id }, 'Order created');
		return res.status(201).json(order);
	} catch (err) {
		log.error({ event: 'order.create.error', err: err.message }, 'Order creation failed');
		return res.status(500).json({ error: 'Internal server error' });
	}
}
```

For background tasks / scripts (no req object):

```js
import { getLog } from './logger.js';

async function runCleanup() {
	const log = getLog(null, { operationId: 'nightlyCleanup' });
	log.info({ event: 'script.cleanup.start' }, 'Starting nightly cleanup');
	// work...
	log.info({ event: 'script.cleanup.summary', removed: 42 }, 'Cleanup complete');
}
```

---

## 🎯 **Project Summary**

**Pizza E-commerce App** represents a complete, production-ready e-commerce platform that demonstrates:

- **🏪 Full E-commerce Functionality**: From product browsing to secure checkout and order management
- **🛡️ Enterprise-Grade Security**: PCI-compliant payments, JWT authentication, and comprehensive data protection
- **📱 Modern User Experience**: Progressive web app with responsive design and accessibility features
- **⚙️ Advanced Business Tools**: Operating hours management, automated alerts, and comprehensive analytics
- **🚀 Scalable Architecture**: Modular design with comprehensive documentation and testing framework

This platform showcases modern web development best practices, sophisticated business logic, and a user-centric approach to e-commerce applications. Whether for portfolio demonstration or real-world deployment, Pizza E-commerce App provides a comprehensive solution for online food ordering businesses.d comprehensive business management.**

Welcome to Pizza E-commerce App! This application demonstrates a complete e-commerce solution with sophisticated features for both customers and business administrators.

---

## 🎯 **Platform Overview**

Pizza E-commerce App is a modern, full-stack e-commerce platform that provides:
- **Customer Experience**: Interactive pizza ordering with real-time customization
- **Business Management**: Complete admin dashboard for operations management  
- **Payment Processing**: Secure Square payment integration
- **Advanced Features**: Operating hours management, automated alerts, performance monitoring

---

## 🛒 **Customer Experience Features**

### 📱 **Interactive Pizza Ordering**
- **Dynamic Menu Browsing**: Visually appealing pizza menu with high-quality images and detailed ingredient lists
- **Custom Pizza Builder**: Real-time pizza customization with live price calculation and ingredient preview
- **Smart Shopping Cart**: Persistent cart with session management and automatic price calculations
- **Operating Hours Awareness**: Dynamic ordering that respects business hours with real-time status updates

### 💳 **Secure Payment Processing**
- **Square Payment Integration**: PCI-compliant payment processing with multiple payment methods
- **Real-time Transaction Processing**: Instant payment validation and confirmation
- **Automated Receipt Generation**: Email receipts sent automatically upon successful orders
- **Order Confirmation System**: Comprehensive order success pages with tracking information

### 🎨 **Modern User Interface**
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices
- **Progressive Web App**: App-like experience with offline capabilities and fast loading
- **Accessibility Features**: WCAG compliant design with keyboard navigation and screen reader support
- **Real-time Status Updates**: Live operating hours banner and order status notifications

### 📞 **Customer Service**
- **Contact & Support**: Easy-to-use contact forms for customer inquiries
- **About & Information**: Comprehensive store information and business details
- **Legal Compliance**: Privacy policy, terms of service, and licensing information
- **Business Hours Display**: Real-time business status with operating hours information


### About & Purpose Pages

Dedicated pages explain the business’s mission, purpose, and commitment to quality ingredients and community.

- **Languages/Frameworks:** React, Tailwind CSS
- **Processes:** Static content, responsive design

---

## 🛡️ **Administrative Dashboard Features**

### 📊 **Complete Business Management**
- **Advanced Order Management**: Real-time order tracking with status updates (pending, preparing, ready, delivered)
- **Archived Order System**: Historical order data with search, filtering, and analytics capabilities
- **Operating Hours Control**: Sophisticated scheduling system with weekly hours and special event management
- **Performance Monitoring**: Built-in system performance tracking and optimization tools

### 👥 **User & Staff Management**
- **Admin User Management**: Create, manage, and remove administrative users
- **Password Security**: Secure password change functionality with validation
- **Role-Based Access**: Different permission levels for various administrative functions
- **Session Management**: Secure JWT-based authentication with automatic session renewal

### 🍕 **Menu & Inventory Control**
- **Dynamic Menu Management**: Create, update, and delete pizzas with image upload capability
- **Advanced Ingredient System**: Comprehensive ingredient management with categories and pricing
- **Real-time Price Calculation**: Automatic price updates based on ingredient changes
- **Image Management**: Professional image upload and optimization system

### 💬 **Customer Service Tools**
- **Message Management**: Customer inquiry handling with read/unread status tracking
- **Bulk Operations**: Efficient batch actions for message management
- **Response System**: Built-in customer communication tools
- **Service Analytics**: Message statistics and response time tracking

### ⚙️ **System Administration**
- **Bootstrap Setup**: Initial system configuration and setup wizard
- **About Page Management**: Dynamic content management for store information
- **Legal Page Updates**: Manage privacy policy, terms of service, and compliance content
- **Email Alert Configuration**: Customizable admin notification system for new orders

---

## 💡 **Advanced Platform Features**

### 🚀 **Performance & Optimization**
- **Progressive Web App**: Offline capabilities, fast loading, and app-like experience
- **Performance Monitoring**: Real-time performance tracking and optimization tools
- **Lazy Loading**: Optimized resource loading for improved user experience
- **Responsive Design**: Mobile-first design with seamless cross-device compatibility

### 🔒 **Security & Compliance**
- **PCI-Compliant Payments**: Secure Square payment processing with industry standards
- **JWT Authentication**: Secure token-based authentication with automatic renewal
- **Data Protection**: Comprehensive input validation and sanitization
- **Legal Compliance**: Privacy policy, terms of service, and GDPR considerations

### ⚙️ **Business Intelligence**
- **Operating Hours Management**: Sophisticated scheduling with holiday and special event handling
- **Automated Email Alerts**: Real-time order notifications and system alerts
- **Order Analytics**: Comprehensive order tracking and business insights
- **System Health Monitoring**: Built-in monitoring for system performance and uptime

### 🎨 **User Experience Innovation**
- **Real-time Updates**: Live status updates for orders and business hours
- **Smart Cart Management**: Persistent shopping cart with session recovery
- **Interactive Components**: Dynamic pizza builder with live price calculations
- **Accessibility Features**: WCAG compliant design with full keyboard navigation

### 🛠️ **Development & Maintenance**
- **Automated Testing Suite**: Comprehensive testing framework for all features
- **Database Management**: Advanced MongoDB operations with automated cleanup
- **Admin Utilities**: Built-in tools for system maintenance and user management
- **API Documentation**: Complete documentation for all endpoints and features

---

## Architecture & Structure

- **Monorepo Structure:** Separate `/client`, `/server`, and `/test` folders, each with their own README and setup instructions.
- **API Communication:** All client-server communication via RESTful API endpoints using Axios.
- **Security:** JWT authentication, password hashing, CORS configuration, and session management.
- **Database:** MongoDB with Mongoose ODM for schema validation and data modeling.
- **Testing & Seeding:** `/test` folder contains scripts for seeding the database with sample data.

---

## Languages & Frameworks Summary

- **Frontend:** React, Redux Toolkit, Tailwind CSS, Axios
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, Multer, Passport.js, JWT
- **Other:** redux-persist, dotenv, bcrypt, CORS

---

**Summary:**  
Pizza E-commerce App is a full-featured pizza ordering platform with robust admin tools, a customizable menu, and a focus on quality, community, and user experience. This README provides a comprehensive overview for presenting or reviewing the project’s features and technical stack.
