// filename: complexApp.js

// This is a complex and elaborate JavaScript code demonstrating a fully functional e-commerce website
// with user authentication, product listing, shopping cart, and order processing functionality.

// Import required modules and dependencies

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Initialize the express application
const app = express();

// Define a database object to store the users, products, and orders

const database = {
  users: [
    {
      id: '1',
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password',
      cart: [],
    },
  ],
  products: [
    {
      id: '1',
      name: 'Product 1',
      price: 10,
    },
    {
      id: '2',
      name: 'Product 2',
      price: 20,
    },
  ],
  orders: [],
};

// Define routes and their handlers for the application

// User registration
app.post('/register', async (req, res) => {
  // Extract user data from request body
  const { name, email, password } = req.body;

  // Hash the user password using bcrypt
  const hashedPassword = await bcrypt.hash(password, 10);

  // Generate a unique user ID
  const userId = (database.users.length + 1).toString();

  // Create a new user object
  const newUser = {
    id: userId,
    name: name,
    email: email,
    password: hashedPassword,
    cart: [],
  };

  // Add the user to the database
  database.users.push(newUser);

  // Return a success response
  res.status(201).send('User registered successfully');
});

// User login and authentication
app.post('/login', (req, res) => {
  // Extract user credentials from request body
  const { email, password } = req.body;

  // Find the user with the matching email
  const user = database.users.find((user) => user.email === email);

  // Return an error if the user is not found
  if (!user) {
    return res.status(400).send('Invalid credentials');
  }

  // Verify the user's password using bcrypt
  const validPassword = await bcrypt.compare(password, user.password);

  // Return an error if the password is invalid
  if (!validPassword) {
    return res.status(400).send('Invalid credentials');
  }

  // Generate a JSON web token (JWT) for user authentication
  const token = jwt.sign({ id: user.id }, 'secretkey');

  // Return the token as a response
  res.status(200).json(token);
});

// Fetch all products
app.get('/products', (req, res) => {
  // Return the list of products from the database
  res.json(database.products);
});

// Add a product to user's cart
app.post('/cart/add', (req, res) => {
  // Extract user ID and product ID from request body
  const { userId, productId } = req.body;

  // Find the user with the matching ID
  const user = database.users.find((user) => user.id === userId);

  // Return an error if the user is not found
  if (!user) {
    return res.status(400).send('User not found');
  }

  // Find the product with the matching ID
  const product = database.products.find((product) => product.id === productId);

  // Return an error if the product is not found
  if (!product) {
    return res.status(400).send('Product not found');
  }

  // Add the product to the user's cart
  user.cart.push(product);

  // Return a success response
  res.status(200).send('Product added to cart');
});

// Process user's order
app.post('/orders', (req, res) => {
  // Extract user ID from request body
  const { userId } = req.body;

  // Find the user with the matching ID
  const user = database.users.find((user) => user.id === userId);

  // Return an error if the user is not found
  if (!user) {
    return res.status(400).send('User not found');
  }

  // Get the products in user's cart
  const cartProducts = user.cart;

  // Calculate the total order amount
  const totalAmount = cartProducts.reduce((total, product) => total + product.price, 0);

  // Create a new order object
  const newOrder = {
    id: (database.orders.length + 1).toString(),
    userId: userId,
    products: cartProducts,
    totalAmount: totalAmount,
  };

  // Add the order to the database
  database.orders.push(newOrder);

  // Clear the user's cart
  user.cart = [];

  // Return a success response
  res.status(201).send('Order placed successfully');
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

// This is a simplified example demonstrating the main features of an e-commerce website.
// In real-world applications, this code can be extended and enhanced further to handle various edge cases.