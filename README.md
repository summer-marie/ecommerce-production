# Capstone Pizza App – Feature Overview

Welcome to Capstone Pizza! This README is designed to guide you through the core features, technologies, and architecture of the project for presentation or review.

---

## Customer Features

### Menu Browsing

Customers can view a visually appealing menu of pizzas, each with images, descriptions, ingredients, and prices. The menu displays consistent card layouts and ingredient details for easy browsing.

- **Languages/Frameworks:** React, Tailwind CSS
- **Processes:** Fetches pizza data from backend API, displays with responsive card components

### Custom Pizza Builder

Customers can create their own pizzas by selecting crust, sauce, meats, veggies, and cheese. The builder auto-calculates the price based on selected ingredients and displays a live preview.

- **Languages/Frameworks:** React, Redux Toolkit, Tailwind CSS
- **Processes:** Dynamic form state, price calculation logic, live ingredient preview

### Cart & Ordering

Customers can add pizzas to their cart, review their selections, and place orders. The checkout form validates user information before allowing submission.

- **Languages/Frameworks:** React, Redux Toolkit, HTML5 validation
- **Processes:** Cart state persisted with redux-persist, form validation, order submission via API


### About & Purpose Pages

Dedicated pages explain the business’s mission, purpose, and commitment to quality ingredients and community.

- **Languages/Frameworks:** React, Tailwind CSS
- **Processes:** Static content, responsive design

---

## Admin Features

### Secure Admin Login

Admins access a secure login page to authenticate before managing the app.

- **Languages/Frameworks:** React, Express.js, Node.js, Passport.js, JWT
- **Processes:** Secure login form, password hashing, JWT authentication, session management

### Sidebar Navigation

A persistent sidebar allows admins to quickly navigate between orders, menu management, ingredients, and messages.

- **Languages/Frameworks:** React, React Router, Tailwind CSS
- **Processes:** Reusable navigation component, client-side routing

### Menu Management

Admins can add, update, or delete pizzas from the menu. Each pizza can have an image, ingredient list, and price, with auto-calculation based on ingredients.

- **Languages/Frameworks:** React, Redux Toolkit, Express.js, Node.js, MongoDB, Mongoose, Multer
- **Processes:** CRUD operations, image upload and storage, price calculation, API integration

### Ingredient Management

Admins can view, add, edit, or remove ingredients. Ingredients are categorized (base, sauce, meat, veggie, cheese) and can be updated in bulk.

- **Languages/Frameworks:** React, Redux Toolkit, Express.js, Node.js, MongoDB, Mongoose
- **Processes:** Ingredient CRUD, modal dialogs, API endpoints, schema validation

### Order Management

Admins can view all open orders, update their status, and archive completed or cancelled orders. Completed orders are stored for history and analytics.

- **Languages/Frameworks:** React, Redux Toolkit, Express.js, Node.js, MongoDB, Mongoose
- **Processes:** Order status updates, archiving, async actions, UI feedback with spinners and badges

### Customer Messages

Admins can read, reply to, and delete customer messages. The inbox supports batch actions and marks messages as read.

- **Languages/Frameworks:** React, Redux Toolkit, Express.js, Node.js, MongoDB, Mongoose
- **Processes:** Message CRUD, reply logic, batch actions, read/unread status

---

## Technical Features

### Responsive Design

The app is fully responsive, ensuring a seamless experience on desktop and mobile devices.

- **Languages/Frameworks:** React, Tailwind CSS
- **Processes:** Flexbox and Grid layouts, mobile-first design

### Image Uploads

Admins can upload pizza images, which are stored and served from the backend with consistent sizing and aspect ratio.

- **Languages/Frameworks:** React, Express.js, Multer, Tailwind CSS
- **Processes:** File upload handling, static file serving, frontend image display with `object-cover` and aspect ratio utilities

### Validation & UX

Forms use required fields and disable submit buttons until all information is entered, improving data quality and user experience.

- **Languages/Frameworks:** React, HTML5, Tailwind CSS
- **Processes:** Controlled components, HTML5 validation, conditional button disabling, real-time feedback

### State Management

Redux is used for managing global state, including orders, menu items, ingredients, authentication, and cart.

- **Languages/Frameworks:** Redux Toolkit, redux-persist
- **Processes:** Global state slices, async thunks, persistent cart state

### Error Handling

The app provides user feedback for errors (e.g., failed uploads, invalid form submissions) and uses loading spinners for async actions.

- **Languages/Frameworks:** React, Redux Toolkit
- **Processes:** Try/catch blocks, error boundaries, loading and error state management, custom spinners

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
Capstone Pizza is a full-featured pizza ordering platform with robust admin tools, a customizable menu, and a focus on quality, community, and user experience. This README provides a comprehensive overview for presenting or reviewing the project’s features and technical stack.