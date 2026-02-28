---
id: structured-data-05
title: JSON and Nested Structures
moduleId: structured-data
prerequisites:
  - python-basics-02
estimatedTimeMinutes: 10
difficulty: intermediate
learningObjectives:
  - Understand the hierarchical nature of JSON data
  - Navigate complex data by chaining dictionary keys and list indices
  - Identify why JSON is used for complex metadata (e.g., TEI or Web APIs)
  - Safely access deep data points using .get()
keywords:
  - json
  - nested
  - keys
  - parsing
  - hierarchy
---

# Navigating Nested Data: The JSON Onion

  ## Why JSON?
  If a CSV is a flat spreadsheet, **JSON (JavaScript Object Notation)** is an onion. While tables are great for simple lists, they struggle with complexity. 

  Imagine a library book: it might have multiple authors, five different publication dates, and hundreds of chapters. In a CSV, this becomes a mess of redundant columns. In JSON, we can "nest" information inside other information to maintain its natural structure.

  ---

  ## 1. Peeling the Layers
  To get to the "heart" of nested data, you must chain your access commands. In Python, this means using multiple sets of brackets `[]` or the `.get()` method.

  Look at this record from a digital archive:

  ```python
  archive_entry = {
      "id": "A100",
      "metadata": {
          "creator": "Shelley, Mary",
          "dates": [1818, 1823, 1831]
      }
  }
  ```

  To reach the first date (1818), you follow the path:
  1.  **`archive_entry["metadata"]`**: This gets you the inner dictionary.
  2.  **`["dates"]`**: This gets you the list of years inside that dictionary.
  3.  **`[0]`**: This gets you the first item in that list.

  **Combined:** `archive_entry["metadata"]["dates"][0]`

  ---

  ## 2. Navigating Lists of Dictionaries
  In DH, the most common structure you will encounter is a **List of Dictionaries**. This is how a book is often represented: the book is a dictionary, and one of its keys is "chapters," which contains a list of smaller dictionaries.

  ```python
  book = {
      "title": "Frankenstein",
      "chapters": [
          {"num": 1, "title": "Letter 1"},
          {"num": 2, "title": "Letter 2"}
      ]
  }

  # Accessing the title of the first chapter:
  print(book["chapters"][0]["title"]) 
  ```

  ---

  ## 3. Data Safety: The `.get()` Method
  Archival data is often "spotty." Some records might have a "creator" field, while others don't. If you try to access a key that isn't there using brackets, your script will crash.

  ```python
  # If "location" is missing, this returns None instead of an error:
  loc = archive_entry.get("location") 
  ```

  :::tip
  **DH Use Case**: When you harvest data from the **Digital Public Library of America (DPLA)** or the **Library of Congress API**, the data will arrive as a massive, nested JSON object. Learning to "drill down" through these layers is how you extract specific information for your research.
  :::

  :::challenge
  In the challenge in the sandbox, look closely at the "chapters" key. It contains a list. To get to the second chapter, you must first index the list, then access the dictionary key inside it.
  :::
  

---challenges---

### Challenge: Access Nested Chapter Data

- id: structured-data-05-c1
- language: python
- difficulty: intermediate

#### Starter Code

```python
data = {
      "title": "Frankenstein",
      "chapters": [
          {"num": 1, "title": "Letters"},
          {"num": 2, "title": "Birth"}
      ]
  }

  # Goal: Access the "title" of the SECOND chapter in the list.
  # 1. Access the "chapters" key.
  # 2. Select the second item in that list (Index 1).
  # 3. Access the "title" key of that item.

  # Your code here
  
```

#### Expected Output

```
Birth
```

#### Hints

1. Remember that lists start at 0. The second item is [1].
2. Your code should look like: data["key"][index]["key"]
3. Make sure the final result is exactly what you print.

#### Solution

```python
data = {
      "title": "Frankenstein",
      "chapters": [
          {"num": 1, "title": "Letters"},
          {"num": 2, "title": "Birth"}
      ]
  }

  # Navigate: data -> chapters -> second item -> title
  result = data["chapters"][1]["title"]

  print(result)
```

