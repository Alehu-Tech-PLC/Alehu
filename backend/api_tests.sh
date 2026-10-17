#!/usr/bin/env bash
# ==============================================================================
# Alehu Backend API Verification Script (curl / bash)
# ==============================================================================

BASE_URL="http://127.0.0.1:5000"

echo -e "\n=== 1. Login as Admin ==="
LOGIN_RES=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@alehu.com","password":"Admin123!"}')

echo "$LOGIN_RES"
ACCESS_TOKEN=$(echo "$LOGIN_RES" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

echo -e "\n=== 2. Current User Profile ==="
curl -s -X GET "$BASE_URL/api/auth/me" \
  -H "Authorization: Bearer $ACCESS_TOKEN"

echo -e "\n\n=== 3. List Users ==="
curl -s -X GET "$BASE_URL/api/users?page=1&per_page=5" \
  -H "Authorization: Bearer $ACCESS_TOKEN"

echo -e "\n\n=== 4. List Customers ==="
curl -s -X GET "$BASE_URL/api/customers?page=1&per_page=5" \
  -H "Authorization: Bearer $ACCESS_TOKEN"

echo -e "\n\n=== 5. Create Customer ==="
curl -s -X POST "$BASE_URL/api/customers" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Curl Test Customer","email":"curltest@example.com","phone":"555-1234","address":"100 Curl Blvd"}'

echo -e "\n\n=== 6. List Devices ==="
curl -s -X GET "$BASE_URL/api/devices?page=1&per_page=5" \
  -H "Authorization: Bearer $ACCESS_TOKEN"

echo -e "\n\n=== 7. List Roles ==="
curl -s -X GET "$BASE_URL/api/roles" \
  -H "Authorization: Bearer $ACCESS_TOKEN"

echo -e "\n\n=== 8. List Permissions ==="
curl -s -X GET "$BASE_URL/api/permissions" \
  -H "Authorization: Bearer $ACCESS_TOKEN"

echo -e "\n\n=== API verification finished ==="
