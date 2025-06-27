#!/bin/sh
set -e

echo "Waiting for next-app to be healthy..."
until [ "$(curl -s -o /dev/null -w '%{http_code}' http://next:3000)" = "200" ]; do
  sleep 2
done

echo "next-app is healthy, checking update status..."

if [ -f /tmp/update_response.txt ] && grep -q '{"message":"Successfully updated database"}' /tmp/update_response.txt; then
  echo "Update already successful, skipping update."
else
  update_response=$(curl -s -w "%{http_code}" -o /tmp/update_response.txt -X POST http://next:3000/api/update -H "x-api-key: $API_KEY")
  echo "Update status: $update_response"
  cat /tmp/update_response.txt
fi

catchup_response=$(curl -s -w "%{http_code}" -o /tmp/catchup_response.txt -X POST http://next:3000/api/catchup -H "x-api-key: $API_KEY")
echo "Catchup status: $catchup_response"
cat /tmp/catchup_response.txt

if [ "$catchup_response" = "200" ]; then
  agregate_response=$(curl -s -w "%{http_code}" -o /tmp/agregate_response.txt -X POST http://next:3000/api/agregate -H "x-api-key: $API_KEY")
  echo "Agregate status: $agregate_response"
  cat /tmp/agregate_response.txt
else
  echo "Catchup failed, not running agregate."
  exit 1
fi
