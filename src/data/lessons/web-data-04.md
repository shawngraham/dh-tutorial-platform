---
id: web-data-04
title: Working with Digital Archives
moduleId: web-data-collection
prerequisites:
  - web-data-03
estimatedTimeMinutes: 10
difficulty: intermediate
learningObjectives:
  - Navigate and parse structured data from cultural heritage APIs (JSON)
  - Extract metadata from deeply nested records using safe navigation patterns
  - Handle "dirty data" (missing fields or empty lists) in archival records
  - Flatten complex archive responses into a research-ready catalogue
keywords:
  - archives
  - digital collections
  - cultural heritage
  - api
  - json
  - nested data
---

# Working with Digital Archives

  ## Analogy: The Digital Finding Aid

  In a physical archive, you use a **finding aid**—a guide that tells you which box contains which letter. In a digital archive, the **API (Application Programming Interface)** serves a similar purpose. 

  Instead of flipping through a paper folder, you send a digital request and receive a **JSON record**. This record is the digital equivalent of a catalogue card, containing everything the archive knows about an item: its author, the type of paper it's on, its dimensions, and a link to the scanned image.

  ## Key Concepts

  ### 1. The Complexity of Archival JSON
  Archival data is rarely a simple list. Because history is complex (a letter can have multiple authors, various dates, and several subject tags), the data is **nested**. 

  One record is usually a dictionary containing lists, which contain more dictionaries:

  ```python
  # A typical nested archive record
  record = {
      "id": "item-992",
      "title": "Journal entry by Mary Shelley",
      "metadata": {
          "dates": [{"year": 1814, "type": "composition"}],
          "creators": [{"name": "Shelley, Mary", "role": "author"}]
      },
      "subjects": ["Travel", "France", "Gothic"]
  }
  ```

  ### 2. Defending Against "KeyErrors"
  In a perfect world, every record has a date and a creator. In a digital archive, many records are incomplete. If you try to access `record["date"]` and it doesn't exist, your Python script will crash.

  We use **Defensive Extraction**:
  1.  **The `.get()` method**: Returns `None` (or a default) instead of crashing.
  2.  **Conditional checks**: "If this list exists, give me the first item."

  ```python
  # Safe extraction
  title = record.get("title", "Unknown Title")

  # Nested safe extraction
  # We use .get("metadata", {}) to ensure we have a dict to call .get() on again
  year = record.get("metadata", {}).get("dates", [{}])[0].get("year", "n.d.")
  ```

  ### 3. Building a "Flat" Catalogue
  For analysis (like counting items per year), we want to turn those nested "clouds" of data into a clean, flat table. This process is called **Normalization**.

  ---

  ## Practice

  :::try-it
  **Exploring Hierarchy**
  Look at the `record` example above. How would you access the string "France"? 
  *Answer: `record["subjects"][1]`.*
  Now imagine a collection of 10,000 records. If only 5,000 of them have a "subjects" list, how would your code need to change to avoid breaking?
  :::

  ## Transfer: DH in the Real World

  *   **DPLA (Digital Public Library of America)**: Aggregates millions of records from US libraries into a single API.
  *   **The Smithsonian**: Provides an API to search millions of museum objects, from fossils to space suits.
  *   **Trove (National Library of Australia)**: A massive API for historical newspapers and gazettes.

  Understanding how to "dig" through JSON layers is a superpower for DH researchers. It allows you to build your own datasets instead of relying on what a website's "Search" button chooses to show you.

  :::challenge
  Extract target information from the API response.
  :::

  ---challenges---

  ### Challenge: Archive Record Flattener

- id: web-data-04-c1
- language: python
- difficulty: intermediate

  #### Starter Code
```python
# Mock API response mirroring real cultural heritage API structure
raw_api_data = [
    {
        "title": "Letter to Lord Byron",
        "metadata": {
            "dates": [{"year": 1816, "type": "composition"}],
            "creators": [{"name": "Shelley, Mary", "role": "author"}],
            "format": "manuscript"
        }
    },
    {
        "title": "Frankenstein, First Edition",
        "metadata": {
            "dates": [{"year": 1818, "type": "publication"}],
            "creators": [{"name": "Shelley, Mary", "role": "author"}],
            "format": "printed book"
        }
    },
    {
        "title": "Geneva Survey Map",
        "metadata": {
            "dates": [],          # No date recorded
            "creators": [],       # No creator recorded
            "format": "cartographic"
        }
    },
    {
        "title": "Untitled Fragment",
        "metadata": {}            # Entire metadata block is empty
    }
]

# Task: Loop through raw_api_data and safely extract:
#   - title:   use "Unknown Title" as fallback
#   - year:    first item in the dates list; use "n.d." if the list is empty
#   - creator: first creator's name; use "Anonymous" if the list is empty
#   - format:  use "unknown" as fallback
#
# Print each as: "<year> | <title> | <creator> (<format>)"

for item in raw_api_data:
    # Your code here
    pass
```

#### Expected Output
```
1816 | Letter to Lord Byron | Shelley, Mary (manuscript)
1818 | Frankenstein, First Edition | Shelley, Mary (printed book)
n.d. | Geneva Survey Map | Anonymous (cartographic)
n.d. | Untitled Fragment | Anonymous (unknown)
```

#### Hints

1. Retrieve the whole `metadata` block safely first: `meta = item.get("metadata", {})`. Then call `.get()` on `meta` for each field — this avoids chaining `.get()` calls on a missing key.
2. For `year`, get the dates list with `meta.get("dates", [])`, then check `if dates:` before accessing `dates[0].get("year", "n.d.")`.
3. The same pattern works for `creators`: get the list, check if it's non-empty, then access `creators[0].get("name", "Anonymous")`.

#### Solution
```python
raw_api_data = [
    {
        "title": "Letter to Lord Byron",
        "metadata": {
            "dates": [{"year": 1816, "type": "composition"}],
            "creators": [{"name": "Shelley, Mary", "role": "author"}],
            "format": "manuscript"
        }
    },
    {
        "title": "Frankenstein, First Edition",
        "metadata": {
            "dates": [{"year": 1818, "type": "publication"}],
            "creators": [{"name": "Shelley, Mary", "role": "author"}],
            "format": "printed book"
        }
    },
    {
        "title": "Geneva Survey Map",
        "metadata": {
            "dates": [],
            "creators": [],
            "format": "cartographic"
        }
    },
    {
        "title": "Untitled Fragment",
        "metadata": {}
    }
]

for item in raw_api_data:
    title = item.get("title", "Unknown Title")
    meta = item.get("metadata", {})

    dates = meta.get("dates", [])
    year = dates[0].get("year", "n.d.") if dates else "n.d."

    creators = meta.get("creators", [])
    creator = creators[0].get("name", "Anonymous") if creators else "Anonymous"

    fmt = meta.get("format", "unknown")

    print(f"{year} | {title} | {creator} ({fmt})")
```

---

### Challenge: Build a Format Report from the Catalogue

- id: web-data-04-c2
- language: python
- difficulty: intermediate

#### Starter Code
```python
# A flattened catalogue — the kind of output your Challenge 1 code would produce
# at scale across thousands of archival records
catalogue = [
    {"year": 1816, "title": "Letter to Lord Byron",         "creator": "Shelley, Mary",  "format": "manuscript"},
    {"year": 1818, "title": "Frankenstein, First Edition",  "creator": "Shelley, Mary",  "format": "printed book"},
    {"year": 1810, "title": "Geneva Survey Map",            "creator": "Anonymous",       "format": "cartographic"},
    {"year": 1812, "title": "Childe Harold's Pilgrimage",   "creator": "Byron, George",   "format": "printed book"},
    {"year": 1814, "title": "Journal Entry, July",          "creator": "Shelley, Mary",  "format": "manuscript"},
    {"year": 1819, "title": "Ode to the West Wind",         "creator": "Shelley, Percy", "format": "manuscript"},
    {"year": 1820, "title": "Topographical Survey, Alps",   "creator": "Anonymous",       "format": "cartographic"},
    {"year": 1823, "title": "Valperga",                     "creator": "Shelley, Mary",  "format": "printed book"},
]

# Task: Count how many items belong to each format.
# 1. Create an empty dictionary called format_counts.
# 2. Loop through the catalogue.
# 3. For each item, get its format and increment its count in format_counts.
#    (If the format isn't in the dictionary yet, start its count at 0.)
# 4. After the loop, print each format and its count,
#    sorted from most to least common.

format_counts = {}

# Your code here
```

#### Expected Output
```
manuscript: 3
printed book: 3
cartographic: 2
```

#### Hints

1. To safely increment a count that might not exist yet, use `format_counts[fmt] = format_counts.get(fmt, 0) + 1`.
2. To sort a dictionary by its values, use `sorted(format_counts.items(), key=lambda x: x[1], reverse=True)`.
3. `dict.items()` returns pairs of `(key, value)` — unpack them in your print loop with `for fmt, count in ...`.

#### Solution
```python
catalogue = [
    {"year": 1816, "title": "Letter to Lord Byron",         "creator": "Shelley, Mary",  "format": "manuscript"},
    {"year": 1818, "title": "Frankenstein, First Edition",  "creator": "Shelley, Mary",  "format": "printed book"},
    {"year": 1810, "title": "Geneva Survey Map",            "creator": "Anonymous",       "format": "cartographic"},
    {"year": 1812, "title": "Childe Harold's Pilgrimage",   "creator": "Byron, George",   "format": "printed book"},
    {"year": 1814, "title": "Journal Entry, July",          "creator": "Shelley, Mary",  "format": "manuscript"},
    {"year": 1819, "title": "Ode to the West Wind",         "creator": "Shelley, Percy", "format": "manuscript"},
    {"year": 1820, "title": "Topographical Survey, Alps",   "creator": "Anonymous",       "format": "cartographic"},
    {"year": 1823, "title": "Valperga",                     "creator": "Shelley, Mary",  "format": "printed book"},
]

format_counts = {}
for item in catalogue:
    fmt = item["format"]
    format_counts[fmt] = format_counts.get(fmt, 0) + 1

for fmt, count in sorted(format_counts.items(), key=lambda x: x[1], reverse=True):
    print(f"{fmt}: {count}")
```

