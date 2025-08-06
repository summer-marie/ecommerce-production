# Test Folder Documentation

This folder contains scripts and resources for testing and seeding the Capstone Pizza application's database.

## Purpose

- Seed the database with initial or sample data for development and testing.
- Provide scripts to quickly populate collections such as admins, pizzas, orders, and messages.

## Directory Structure

```plaintext
test/
├── seedAdmin.js      # Script to seed admin users
├── seedBuilder.js    # Script to seed pizza builder data
├── seedMsgs.js       # Script to seed customer messages
├── seedOrders.js     # Script to seed orders
└── README.md         # This documentation file
```

## Prerequisites

- [ ] Node.js (v16 or higher)
- [ ] MongoDB running and accessible
- [ ] All environment variables set in the main server `.env` file

## .env File

Create a `.env` file in the `test/` directory with the following content:

```env
SERVER_URL=http://localhost:8010
```

> Make sure this matches your server's configuration.

## Usage

1. **Navigate to the test folder:**

    ```bash
    cd test
    ```

2. **Run the desired seed script:**

    ```bash
    node seedAdmin.js
    node seedBuilder.js
    node seedMsgs.js
    node seedOrders.js
    ```

> You can run one or more scripts as needed. Each script will connect to your MongoDB database and insert sample data.

## Notes

- Ensure your MongoDB server is running and your `.env` file in the server directory is properly configured before running any seed scripts.
- These scripts are intended for development and testing purposes only. Do not run them on a production database unless you intend to overwrite data.
- You can modify the seed data in each script to fit your testing needs.

## Troubleshooting

- If you encounter connection errors, check your MongoDB URI in the `.env` file.
- If data is not appearing, ensure the server and database are running and accessible.