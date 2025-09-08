# Redux State Management Documentation

This directory contains the complete state management system for the ecommerce application, built with Redux Toolkit and featuring comprehensive API integration, state slices, and service layers.

## 🏗️ Redux Architecture Overview

The Redux implementation follows a feature-based structure with dedicated slices and services for each major application domain.

## 📁 State Management Structure

```plaintext
redux/
├── 🍕 Core Business Logic
│   ├── builderSlice.js           # Pizza menu and builder state management
│   ├── builderService.js         # Pizza CRUD operations and API calls
│   ├── ingredientSlice.js        # Ingredient inventory and management
│   ├── ingredientService.js      # Ingredient API operations
│   ├── cartSlice.js             # Shopping cart state and logic
│   └── orderSlice.js            # Order processing and status management
│   └── orderService.js          # Order API operations and lifecycle
│
├── 💳 Payment & Commerce
│   ├── paymentSlice.js          # Payment state and transaction management
│   ├── paymentService.js        # Payment API integration
│   └── squarePaymentService.js  # Square-specific payment processing
│
├── 🔐 Authentication & Admin
│   ├── authSlice.js             # User authentication and session management
│   ├── authService.js           # Login, logout, and auth API calls
│   └── messageSlice.js          # Customer service messaging
│   └── messageService.js       # Message API operations
│
├── ⚙️ System & Configuration
│   ├── operatingSlice.js        # Business hours and operating status
│   ├── aboutSlice.js           # Store information and about page content
│   └── aboutService.js         # About page API operations
```

## 🔧 Feature Modules

### 🍕 **Pizza Builder & Menu Management**
**Files**: `builderSlice.js`, `builderService.js`

**State Management**:
- Pizza menu loading and caching
- Individual pizza CRUD operations
- Image upload handling
- Menu categorization and filtering
- Real-time menu updates

**API Operations**:
- `GET /builders` - Fetch all pizzas
- `POST /builders` - Create new pizza with image upload
- `PUT /builders/:id` - Update existing pizza
- `DELETE /builders/:id` - Remove pizza from menu
- Image upload with FormData handling

### 🥬 **Ingredient Management**
**Files**: `ingredientSlice.js`, `ingredientService.js`

**State Management**:
- Ingredient inventory tracking
- Available/unavailable ingredient status
- Pricing and category management
- Real-time ingredient updates

**API Operations**:
- `GET /ingredients` - Fetch all ingredients
- `POST /ingredients` - Add new ingredient
- `PUT /ingredients/:id` - Update ingredient details
- `DELETE /ingredients/:id` - Remove ingredient

### 🛒 **Shopping Cart System**
**File**: `cartSlice.js`

**Local State Features**:
- Add/remove items from cart
- Quantity management
- Price calculations with taxes
- Cart persistence across sessions
- Order total computation
- Clear cart functionality

**Persistence**: Uses Redux Persist to maintain cart state across browser sessions

### 📦 **Order Management**
**Files**: `orderSlice.js`, `orderService.js`

**State Management**:
- Order creation and submission
- Order status tracking (pending, preparing, ready, delivered)
- Order history and retrieval
- Admin order management
- Real-time order updates

**API Operations**:
- `POST /orders` - Create new order
- `GET /orders` - Fetch orders (admin)
- `GET /orders/open` - Get active orders
- `PUT /orders/:id` - Update order status
- Order filtering and pagination

### 💳 **Payment Processing**
**Files**: `paymentSlice.js`, `paymentService.js`, `squarePaymentService.js`

**Payment State**:
- Payment method validation
- Transaction status tracking
- Payment confirmation handling
- Error state management
- Receipt generation

**Square Integration**:
- Secure tokenization
- Payment form validation
- Transaction processing
- Refund handling (admin)
- Payment status monitoring

### 🔐 **Authentication & Security**
**Files**: `authSlice.js`, `authService.js`

**Auth State**:
- User login/logout state
- JWT token management
- Admin role verification
- Session persistence
- Automatic token refresh

**Security Features**:
- Protected route access
- Admin privilege checking
- Secure logout with token cleanup
- Session timeout handling

### 💬 **Customer Service Messaging**
**Files**: `messageSlice.js`, `messageService.js`

**Message Management**:
- Customer inquiry submission
- Admin message reading and response
- Message status tracking (read/unread)
- Message filtering and search
- Automated message cleanup

### ⏰ **Operating Hours System**
**File**: `operatingSlice.js`

**Business Logic**:
- Real-time open/closed status
- Weekly schedule management
- Special hours/holiday handling
- Operating hours display
- Order blocking during closed hours

### 🏪 **Store Information**
**Files**: `aboutSlice.js`, `aboutService.js`

**Content Management**:
- Store information updates
- Contact details management
- About page content editing
- Business information display
- Dynamic content loading

## 🔄 **Redux Store Configuration**

### Store Setup (`../store.js`)
```javascript
// Combines all slices with middleware
configureStore({
  reducer: {
    auth: authSlice,
    builders: builderSlice,
    ingredients: ingredientSlice,
    cart: cartSlice,
    orders: orderSlice,
    messages: messageSlice,
    operating: operatingSlice,
    payments: paymentSlice,
    about: aboutSlice
  },
  middleware: [
    // Redux Toolkit Query
    // Redux Persist
    // Thunk middleware
  ]
});
```

### State Persistence
- **Cart State**: Persisted across browser sessions
- **Auth State**: Maintains login status and user data
- **Settings**: Preserves user preferences and configurations

## 🌐 **API Integration Patterns**

### Service Layer Architecture
Each feature module includes a dedicated service file that handles:
- **API Base Configuration**: Centralized API endpoint management
- **Request/Response Transformation**: Data formatting and validation
- **Error Handling**: Consistent error management across services
- **Loading States**: Automatic loading state management
- **Caching**: Intelligent data caching and invalidation

### Common API Patterns
```javascript
// Standard service function structure
export const createItem = async (itemData) => {
  try {
    const response = await API.post('/endpoint', itemData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Operation failed');
  }
};
```

### RTK Query Integration
- **Automatic Caching**: Smart caching with automatic invalidation
- **Background Updates**: Automatic refetching of stale data
- **Optimistic Updates**: Immediate UI updates with rollback on error
- **Normalized State**: Efficient state normalization and updates

## 🎯 **State Management Best Practices**

### Slice Organization
- **Single Responsibility**: Each slice manages one feature domain
- **Immutable Updates**: All state updates use Immer for immutability
- **Normalized Data**: Complex data structures are normalized for efficiency
- **Derived State**: Computed values using selectors for performance

### Action Patterns
- **Async Thunks**: All API calls use createAsyncThunk
- **Action Creators**: Consistent action naming and payload structure
- **Error Handling**: Standardized error states and messaging
- **Loading States**: Automatic pending/fulfilled/rejected state management

### Selector Usage
- **Memoized Selectors**: Performance-optimized data selection
- **Computed Properties**: Dynamic data derivation
- **Component Optimization**: Prevents unnecessary re-renders

## 🔍 **Debugging & Development Tools**

### Redux DevTools Integration
- **Time Travel Debugging**: Step through state changes
- **Action Replay**: Replay specific actions for testing
- **State Inspection**: Deep inspection of current application state
- **Performance Monitoring**: Track action performance and state size

### Development Features
- **Hot Reloading**: State preservation during development
- **Mock Data**: Development data seeding for testing
- **API Mocking**: Service layer mocking for offline development
- **State Validation**: Runtime state structure validation

## 📊 **Performance Optimization**

### State Structure Optimization
- **Normalized Data**: Efficient data relationships and updates
- **Selective Updates**: Minimize unnecessary component re-renders
- **Lazy Loading**: On-demand state initialization
- **Memory Management**: Automatic cleanup of unused state

### Network Optimization
- **Request Batching**: Combine multiple API calls where possible
- **Caching Strategy**: Intelligent caching with appropriate TTL
- **Background Sync**: Non-blocking background data synchronization
- **Error Recovery**: Automatic retry mechanisms for failed requests

## 🛠️ **Usage Examples**

### Accessing State in Components
```javascript
import { useSelector, useDispatch } from 'react-redux';
import { fetchBuilders } from '../redux/builderSlice';

// In component
const builders = useSelector(state => state.builders.items);
const dispatch = useDispatch();

// Fetch data
useEffect(() => {
  dispatch(fetchBuilders());
}, [dispatch]);
```

### Making API Calls
```javascript
import { createOrder } from '../redux/orderService';

// In component or thunk
try {
  const newOrder = await dispatch(createOrder(orderData)).unwrap();
  // Handle success
} catch (error) {
  // Handle error
}
```

This Redux system provides a robust, scalable foundation for the entire ecommerce application, with comprehensive state management, API integration, and performance optimization built-in.
