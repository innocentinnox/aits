import requests


data = {
    "title": "Missing marks",
    "token": "#45",
    "description": "I missed marks for my end of year semester 2 math exam",
}


# Assuming 'issue' is an object with attributes: title, token, and description
payload = {
    "to": "fwangoda@gmail.com",
    "subject": "Issue Submitted Successfully",
    "html": f"""<h3>Issue Submitted Successfully</h3>
<p>Your issue '{data['title']}' has been submitted.</p>
<p><strong>Token:</strong> {data['token']}</p>
<p><strong>Details:</strong> {data['description']}</p>"""
}

response = requests.post('http://127.0.0.1:8000/api/accounts/send-email/', json=payload)

print(response.status_code)
print(response.json())
