#!/bin/bash
# Run this script to get the admin JWT token for testing
# Usage: bash get-admin-token.sh

RESPONSE=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@cardealership.com","password":"admin123"}')

TOKEN=$(echo "$RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "ERROR: Could not get token. Server may not be running."
  echo "Response: $RESPONSE"
else
  echo "=== Admin JWT Token ==="
  echo "$TOKEN"
  echo ""
  echo "=== Copy this for Postman Authorization header ==="
  echo "Authorization: Bearer $TOKEN"
fi
