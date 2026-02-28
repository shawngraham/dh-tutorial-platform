---
id: web-data-03
title: APIs and JSON Data
moduleId: web-data-collection
prerequisites:
  - web-data-02
estimatedTimeMinutes: 10
difficulty: intermediate
learningObjectives:
  - Explain the difference between Scraping and using an API
  - Use the requests library to retrieve data from a web endpoint
  - Understand HTTP status codes (e.g., 200 vs 404)
  - Navigate nested JSON response objects to extract research data
keywords:
  - api
  - json
  - requests
  - rest
  - endpoint
---

# APIs: The "Front Door" of Data

  ## What is an API?
  An **API (Application Programming Interface)** is a way for two computers to talk to each other. If a website's HTML is like the front of a building (meant for humans to look at), an API is like a "service entrance" designed specifically for computers to exchange clean, structured data.

  ### The Restaurant Analogy
  - **You (The Researcher)**: The customer at the table.
  - **The API (The Waiter)**: Takes your specific request to the kitchen and brings back your "order" (data).
  - **The Server (The Kitchen)**: The database where all the books, records, or tweets are stored.

  ---

  ## 1. Why APIs are Better for DH
  Researchers prefer APIs over web scraping for three main reasons:
  1.  **Reliability**: Websites change their design constantly (breaking your scraper). APIs are "contracts" that rarely change.
  2.  **Speed**: You get exactly the data you need (JSON) without the "bloat" of images, CSS, and HTML.
  3.  **Legality**: Using an API is an explicit invitation from an institution to use their data.

  ---

  ## 2. Using the `requests` Library
  Python uses the `requests` library to communicate with APIs. The most important part of a request is the **Status Code**.

  - **200**: Success!
  - **404**: Not Found (The URL is wrong).
  - **403**: Forbidden (You don't have permission).

  ```python
  import requests

  # The 'Endpoint' (the URL for the data)
  url = "https://chroniclingamerica.loc.gov/search/pages/results/?format=json&proxtext=humanities"

  response = requests.get(url)

  if response.status_code == 200:
      # .json() converts the raw text into a Python Dictionary/List
      data = response.json() 
      print("Data retrieved successfully!")
  ```

  ---

  ## 3. Notable APIs for Humanities Research
  - **Library of Congress**: Access millions of digitized newspaper pages and photos.
  - **DPLA (Digital Public Library of America)**: Metadata for millions of items across US heritage institutions.
  - **Europeana**: The gateway to European cultural heritage.
  - **Open Library**: Access to millions of book records and full texts.

  :::tip
  **From String to Data**: When an API sends data, it arrives as a long string. In Python, we use `json.loads()` to turn that string into a list or dictionary we can actually work with. In the `requests` library, `response.json()` does this step for you automatically!
  :::

:::challenge
  A simulated response from the Digital Public Library of America API is provided below. It mirrors the structure of a real DPLA response: a wrapper object containing metadata
  and a nested list of records. Check the status code before proceeding, then navigate the nested structure to print the title and provider name for each item.
  :::

---challenges---

### Challenge: Navigate a Nested API Response

- id: web-data-03-c1
- language: python
- difficulty: intermediate

#### Starter Code
```python
import json

# A simulated DPLA-style API response (this is what real APIs actually look like)
raw_response = """{
    "status_code": 200,
    "count": 3,
    "results": [
        {
            "title": "Narrative of the Life of Frederick Douglass",
            "date": "1845",
            "provider": {
                "name": "Boston Public Library",
                "state": "Massachusetts"
            }
        },
        {
            "title": "Incidents in the Life of a Slave Girl",
            "date": "1861",
            "provider": {
                "name": "Library of Congress",
                "state": "Washington D.C."
            }
        },
        {
            "title": "Twelve Years a Slave",
            "date": "1853",
            "provider": {
                "name": "New York Public Library",
                "state": "New York"
            }
        }
    ]
}"""

# Step 1: Use json.loads() to convert raw_response into a Python dictionary.

# Step 2: Check the "status_code" key. Only proceed if it equals 200.
#         If not, print "Request failed." and stop.

# Step 3: Loop through the list found at the "results" key.
#         For each record, print the title and the provider's name
#         in the format: "Title — Provider"
#         Note: "provider" is itself a nested dictionary.

# Your code here
```

#### Expected Output
```
Request successful. 3 records found.
Narrative of the Life of Frederick Douglass — Boston Public Library
Incidents in the Life of a Slave Girl — Library of Congress
Twelve Years a Slave — New York Public Library
```

#### Hints

1. After `json.loads()`, your data is a dictionary. Access the status code with `data["status_code"]`.
2. The list of records is at `data["results"]` — loop through that.
3. Each record's provider is itself a dictionary. To get the provider name you need to go two levels deep: `record["provider"]["name"]`.
4. Print the record count before your loop using `data["count"]`.

#### Solution
```python
import json

raw_response = """{
    "status_code": 200,
    "count": 3,
    "results": [
        {
            "title": "Narrative of the Life of Frederick Douglass",
            "date": "1845",
            "provider": {
                "name": "Boston Public Library",
                "state": "Massachusetts"
            }
        },
        {
            "title": "Incidents in the Life of a Slave Girl",
            "date": "1861",
            "provider": {
                "name": "Library of Congress",
                "state": "Washington D.C."
            }
        },
        {
            "title": "Twelve Years a Slave",
            "date": "1853",
            "provider": {
                "name": "New York Public Library",
                "state": "New York"
            }
        }
    ]
}"""

data = json.loads(raw_response)

if data["status_code"] != 200:
    print("Request failed.")
else:
    print(f"Request successful. {data['count']} records found.")
    for record in data["results"]:
        title = record["title"]
        provider = record["provider"]["name"]
        print(f"{title} — {provider}")
```

