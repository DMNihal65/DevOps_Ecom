#!/bin/bash

API_URL="http://localhost:3001/api"

# Test health endpoint
echo "Testing health endpoint..."
curl -X GET "${API_URL}/health"
echo -e "\n"

# Create a user
echo "Creating a user..."
USER_RESPONSE=$(curl -X POST "${API_URL}/users" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User","password":"password123"}')
echo $USER_RESPONSE
echo -e "\n"

# Get all products
echo "Getting products..."
curl -X GET "${API_URL}/products"
echo -e "\n"

# Create an order
echo "Creating an order..."
curl -X POST "${API_URL}/orders" \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"products":[{"productId":1,"quantity":2},{"productId":2,"quantity":1}]}'
echo -e "\n"

# Get all orders
echo "Getting orders..."
curl -X GET "${API_URL}/orders"
echo -e "\n" 