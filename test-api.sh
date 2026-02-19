#!/bin/bash
set -e
BASE="${BASE_URL:-http://localhost:8080}"
echo "=== Тест API: $BASE ==="

echo "1. Регистрация..."
REG=$(curl -s -X POST "$BASE/api/auth/register" -H "Content-Type: application/json" -d '{"login":"testuser","password":"test123"}')
echo "$REG" | head -c 200
echo ""
TOKEN=$(echo "$REG" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
if [ -z "$TOKEN" ]; then
  echo "Ошибка: не получен token. Проверьте, что backend запущен и порт 8080 свободен."
  exit 1
fi
echo "Token получен."

echo ""
echo "2. Котировки..."
curl -s "$BASE/api/quotes" -H "Authorization: Bearer $TOKEN" | head -c 300
echo ""

echo ""
echo "3. Портфель..."
curl -s "$BASE/api/portfolio" -H "Authorization: Bearer $TOKEN" | head -c 400
echo ""

echo ""
echo "4. Покупка 2 SBER..."
curl -s -X POST "$BASE/api/orders/buy" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"ticker":"SBER","quantity":2}' | head -c 300
echo ""

echo ""
echo "5. Портфель после покупки..."
curl -s "$BASE/api/portfolio" -H "Authorization: Bearer $TOKEN" | head -c 500
echo ""

echo ""
echo "6. История операций..."
curl -s "$BASE/api/orders/history?limit=5" -H "Authorization: Bearer $TOKEN" | head -c 400
echo ""

echo ""
echo "=== Тест завершён успешно ==="
