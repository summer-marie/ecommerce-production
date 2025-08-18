# Server Documentation

## Getting Started

### Prerequisites

- [ ] Node.js (v16 or higher)
- [ ] MongoDB installed and running
- [ ] npm or yarn package manager

### Create `.env` File

Create a `.env` file in the `server/` directory with the following content:

```env
PORT=8010
MONGODB_ATLAS_URL=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
COOKIE_SECRET=your_cookie_secret
SESSION_SECRET=your_session_secret
WHITELISTED_DOMAINS=http://localhost:5173,http://127.0.0.1:5173
```

## Directory Structure

```plaintext
server/
├── auth/         # Authentication routes and logic
├── builders/     # Pizza builder endpoints
├── config/       # Database configuration
├── ingredients/  # Ingredient management
├── messages/     # Customer message handling
├── orders/       # Order processing
├── strategies/   # Passport authentication strategies
├── uploads/      # Image storage directory
└── index.js      # Main server entry point
```

## Environment Variables

| Variable            | Description         | Required |
| ------------------- | ------------------- | -------- |
| PORT                | Server port         | Yes      |
| MONGODB_ATLAS_URL   | Database connection | Yes      |
| JWT_SECRET          | JWT token secret    | Yes      |
| COOKIE_SECRET       | Cookie signing      | Yes      |
| SESSION_SECRET      | Session secret      | Yes      |
| WHITELISTED_DOMAINS | CORS origins        | Yes      |

## Middleware Configuration

- **Authentication:** JWT with Passport.js
- **Session Management:** express-session
- **File Upload:** Multer
- **Security:** CORS, bcrypt password hashing
- **Static Files:** Express static middleware for uploads
- 
### File Upload Implementation with Multer

Our application implements secure file uploads for pizza images using Multer middleware. Here's a detailed breakdown of the implementation:

#### Server Configuration

The server automatically creates and configures an uploads directory on startup:

```javascript
// ...\server\index.js
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use("/uploads", express.static(uploadsDir));
```
## Running the Server

**Development mode:**

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

## Seeding the Database

If you need to populate the database with initial data (such as default ingredients or admin users), you can use a seed script.

**To run a seed script, navigate to the `test` directory in your project root and execute the desired script:**

```bash
cd test
node seedAdmin.js
node seedBuilder.js
node seedMsgs.js
node seedOrders.js
```

## API Endpoints

### Authentication
- `POST /auth/login` – Admin login
- `GET /auth/logout` – Admin logout

### Pizza Builder
- `GET /builders` – Get all pizzas
- `POST /builders` – Create new pizza
- `PUT /builders/:id` – Update pizza
- `DELETE /builders/:id` – Delete pizza

### Ingredients
- `GET /ingredients` – Get all ingredients
- `POST /ingredients` – Add ingredient
- `PUT /ingredients/:id` – Update ingredient
- `DELETE /ingredients/:id` – Delete ingredient

### Orders
- `GET /orders` – Get all orders
- `GET /orders/open` – Get open orders
- `PUT /orders/:id` – Update order status
- `POST /orders` – Create new order

### Messages
- `GET /messages` – Get all messages
- `POST /messages` – Send message
- `DELETE /messages/:id` – Delete message

## Notes

- Images are stored in `/uploads` directory
- Maximum file upload size: 5MB
- Dates stored in UTC format
- Prices stored as floating-point numbers