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
├── public/                # Static assets
├── src/
│   ├── admin/             # Admin dashboard components and pages
│   ├── customer/          # Customer-facing components and pages
│   ├── redux/             # Redux slices, services, and store configuration
│   ├── assets/            # Images and static resources
│   ├── App.jsx            # Main app component and route definitions
│   ├── main.jsx           # Entry point for React app
│   ├── PrivateRoute.jsx   # Route protection for admin pages
│   └── store.js           # Redux store setup and middleware
└── index.html             # Main HTML file
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

## Core Processes

### App Initialization
- The app starts from `main.jsx`, which mounts the React app and wraps it with Redux `<Provider>`, `<PersistGate>`, and `<BrowserRouter>` for state management and routing.

### Routing & Layout
- All routes are defined in `App.jsx` using React Router.
- Customer and admin routes are separated by layout components.
- Admin routes are protected by `PrivateRoute.jsx`, which checks authentication state from Redux and redirects unauthorized users to the login page.

### State Management
- Redux Toolkit is used for global state management.
- Slices for orders, ingredients, pizzas (builders), cart, authentication, and messages are located in `src/redux/`.
- The Redux store is configured in `store.js` and uses `redux-persist` to keep the cart state across reloads.
  
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

### API Communication
- All API requests are made using `axios` in service files under `src/redux/`.
- The base URL for API requests is set by the `VITE_API_SERVER_URL` environment variable.

### Forms & Validation
- Forms use controlled React components.
- Required fields and button disabling logic ensure users cannot submit incomplete forms.
- Dropdowns and selects use the `required` attribute for validation.


### UI & Styling
- The app uses Tailwind CSS for responsive, utility-first styling.
- Components are organized for both admin and customer experiences.

### Notes
- Make sure the backend server is running and accessible at the URL specified in `VITE_API_SERVER_URL`.
- For best results, use the same Node.js version as the backend.
- All environment variables must be set before running