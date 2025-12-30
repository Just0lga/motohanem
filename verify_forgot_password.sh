#!/bin/bash

BASE_URL="http://localhost:3000"
TIMESTAMP=$(date +%s)
USERNAME="testuser_$TIMESTAMP"
EMAIL="testuser_$TIMESTAMP@example.com"
PASSWORD="password123"
NEW_PASSWORD="password456"

echo "1. Registering user..."
curl -s -X POST "$BASE_URL/users" \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"$USERNAME\", \"email\": \"$EMAIL\", \"password\": \"$PASSWORD\"}"
echo -e "\n"

echo "2. Calling Forgot Password..."
curl -s -X POST "$BASE_URL/users/forgot-password" \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"$USERNAME\", \"email\": \"$EMAIL\", \"newPassword\": \"$NEW_PASSWORD\"}"
echo -e "\n"

echo "3. Attempting Login with NEW Password..."
curl -s -X POST "$BASE_URL/users/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\", \"password\": \"$NEW_PASSWORD\"}"
echo -e "\n"
