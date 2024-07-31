# Agrisales Backend

The Agrisales Backend is built with Express.js. It serves as the server-side application, providing APIs for user authentication, product management, cart management, and message viewing.

## Features

- User Authentication (Login/Register)
- Product Management (Add/View Products)
- Cart Management (Add/View Products in Cart)
- Message Viewing for Farmers
- Payment Processing

## Technologies Used

- Node.js
- Express.js
- MongoDB (Database)
- JWT (JSON Web Tokens for Authentication)

## Installation

1. Clone the repository
    ```sh
    git https://github.com/mbienaimee/Agriconnect_Backend
    ```
2. Navigate to the project directory
    ```sh
    cd agrisales-backend
    ```
3. Install dependencies
    ```sh
    npm install
    ```
4. Create a `.env` file in the root directory and add the following environment variables
    ```plaintext
    MONGODB_CONNECTION_STRING = "mongodb+srv://Reine:2Ip1RgTpAFlgITEj@cluster0.fslpg5p.mongodb.net/Agri-connect"

PORT = 3001
JWT_SECRET ="GFDFAEYTJEYFAHDSGA"
EMAIL_SERVICE = 'gmail'
EMAIL_USER = 'bienaimeemariereine@gmail.com'
EMAIL_PASSWORD = 'd q z r k k x w p w h l w h t o'
ClOUD_NAME = dmlhqbavl
API_KEY = 478213997114722
API_SECRET = VB5zCx-8kZA8QDv3DMEUM92AJ7U
    ```
5. Start the server
    ```sh
    npm run dev
    ```

## API Endpoints

### Authentication

- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Login a user

### Products

- `GET /api/products`: Get all products
- `POST /api/products`: Add a new product (Farmer only)
- `GET /api/products/:id`: Get a single product by ID

### Cart

- `GET /api/cart`: Get all products in the cart (Buyer only)
- `POST /api/cart`: Add a product to the cart (Buyer only)

### Messages

- `GET /api/messages`: Get all messages (Farmer only)

### Payments

- `POST /api/payments`: Process a payment

## License

This project is licensed under the MIT License.

