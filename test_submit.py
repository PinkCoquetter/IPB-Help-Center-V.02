import requests, json, sys

url = "http://localhost:8000/tickets/submit"
data = {
    "subject": "Test",
    "topic": "IT Support",
    "nim": "G6401231000",
    "description": "Test ticket"
}
r = requests.post(url, data=data)
print(r.status_code)
print(r.text)
