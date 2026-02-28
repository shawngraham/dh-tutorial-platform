---
id: structured-data-01
title: Introduction to CSV and Tabular Data
moduleId: structured-data
prerequisites:
  - python-basics-05
estimatedTimeMinutes: 10
difficulty: beginner
learningObjectives:
  - Understand the tabular nature of humanities data (e.g., prosopography)
  - Identify the difference between csv.reader (lists) and csv.DictReader (dictionaries)
  - Process CSV data stored in strings using io.StringIO
  - Filter tabular data based on specific column values
keywords:
  - csv
  - tabular
  - rows
  - columns
  - dictionaries
  - prosopography
---

# Working with Tabular Data

  ## Data in Rows and Columns
  Much of Digital Humanities involves **structured lists**: a spreadsheet of every student at a university in 1850, or a catalog of every play performed at a specific theater. 

  In DH, we often use tables for **Prosopography**—the investigation of a common group of people (like "all women printers in 18th-century London") by looking at their shared biographical data.

  ---

  ## 1. What is a CSV?
  A **CSV (Comma-Separated Values)** file is a plain-text version of an Excel spreadsheet. 
  - Each line represents a **Row**.
  - Each comma represents a move to a new **Column**.

  ```text
  name,year,city
  Mary,1818,London
  Percy,1810,Oxford
  ```

  ---

  ## 2. Two Ways to Read CSVs in Python
  The `csv` module provides two main tools for reading data:

  ### A. `csv.reader` (The List Method)
  Each row becomes a **List**. You access columns by their number (index).
  - `row[0]` is the name, `row[1]` is the year.

  ### B. `csv.DictReader` (The Dictionary Method)
  Each row becomes a **Dictionary**. You access columns by their header name.
  - `row["name"]` is the name, `row["year"]` is the year. This is usually easier to read!

  ```python
  import csv

  # Using DictReader to access data by column names
  with open('authors.csv', mode='r', encoding='utf-8') as f:
      reader = csv.DictReader(f)
      for row in reader:
          print(row["name"]) # Accesses the "name" column directly
  ```

  ---

  ## 3. The `io.StringIO` Trick
  In the sandbox challenge in the sandbox, we don't have a physical file on a hard drive. Instead, we have a "string" of data. To use the `csv` module on a string, we use `io.StringIO`. 

  Think of `io.StringIO` as a "virtual file" that lets Python treat a block of text as if it were a `.csv` file you just opened.

  ---

  ## 4. Filtering Tabular Data
  The real power of Python is filtering thousands of rows instantly. 

  ```python
  # Example: Only print people born after 1800
  for row in reader:
      if int(row["year"]) > 1800:
          print(row["name"])
  ```

  :::try-it
  When reading a CSV, remember that everything starts as a **string**. If you want to do math on a year or a price, you must convert it using `int()` or `float()`!
  :::
  
  :::challenge
  A researcher has given you a prosopographical dataset of Romantic-era authors as a CSV string. Your task is to filter it and print only the **name and city** of authors who published their first work **after 1815**.
  :::

---challenges---

### Challenge: Filter a Prosopographical Dataset

- id: structured-data-01-c1
- language: python
- difficulty: beginner

#### Starter Code
```python
import csv
import io

csv_data = """name,year,city
Austen,1811,Steventon
Byron,1812,London
Shelley,1818,Bath
Keats,1817,London
Scott,1814,Edinburgh
Clare,1820,Helpston"""

# Goal: Print the name and city of every author whose year > 1815
# 1. Wrap csv_data in io.StringIO() to create a virtual file
# 2. Pass it to csv.DictReader() so you can access columns by name
# 3. Loop through the rows
# 4. Convert row["year"] to an int before comparing
# 5. Print row["name"] and row["city"] for matching rows

# Your code here
```

#### Expected Output
```
Shelley, Bath
Keats, London
Clare, Helpston
```

#### Hints

1. The syntax is: `reader = csv.DictReader(io.StringIO(csv_data))`
2. Each `row` is a dictionary — use `row["year"]`, `row["name"]`, `row["city"]`.
3. Year values are strings by default — use `int(row["year"])` before comparing with `> 1815`.
4. You can print two values together with `print(row["name"] + ", " + row["city"])`.

#### Solution
```python
import csv
import io

csv_data = """name,year,city
Austen,1811,Steventon
Byron,1812,London
Shelley,1818,Bath
Keats,1817,London
Scott,1814,Edinburgh
Clare,1820,Helpston"""

reader = csv.DictReader(io.StringIO(csv_data))

for row in reader:
    if int(row["year"]) > 1815:
        print(row["name"] + ", " + row["city"])
```

