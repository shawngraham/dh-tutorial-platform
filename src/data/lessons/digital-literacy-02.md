---
id: digital-literacy-02
title: 'Data Formats: TXT, CSV, JSON, XML'
moduleId: digital-literacy-foundations
prerequisites:
  - digital-literacy-01
estimatedTimeMinutes: 10
difficulty: beginner
learningObjectives:
  - Distinguish between structured and unstructured data
  - Understand the strengths of CSV for tabular data
  - Recognize nested hierarchies in JSON and XML
  - Choose the appropriate format for different DH research tasks
keywords:
  - txt
  - csv
  - json
  - xml
  - data formats
---

# Data Formats for the Humanities

## Choosing the Right Vessel
In the digital humanities, data isn't just "information"; it's information formatted for a specific purpose. Choosing the wrong format can make analysis impossible. We generally categorize data into two types:

1. **Unstructured Data**: Plain text with no pre-defined model (e.g., a raw TXT file of a novel). Great for reading, hard for machines to "parse" into categories.
2. **Structured Data**: Data organized into a searchable, predictable format (e.g., a CSV or JSON file). Great for machines to count, sort, and map.

---

## The DH "Big Four"

### 1. Plain Text (.txt)
The "gold standard" for long-term preservation. It contains no formatting (no bold, no italics), making it perfect for **Natural Language Processing (NLP)**.
- **Use Case**: Running a word frequency count on the complete works of Shakespeare.

### 2. CSV (Comma-Separated Values)
Used for **tabular data** (spreadsheets). Each line is a row, and each comma represents a new column. 
- **Use Case**: A list of archival objects with columns for "Date," "Creator," and "Location."
```text
title,author,year
Frankenstein,Shelley,1818
```

### 3. JSON (JavaScript Object Notation)
The language of the web. It uses **key-value pairs** and can "nest" data inside other data, allowing for complex relationships.
- **Use Case**: Downloading metadata from the Digital Public Library of America (DPLA) via an API.
```json
{
  "book": "Dracula",
  "metadata": {
    "author": "Stoker", 
    "year": 1897,
    "themes": ["Gothic", "Epistolary"]
  }
}
```

### 4. XML (eXtensible Markup Language)
The backbone of scholarly digital editions. Using the **TEI (Text Encoding Initiative)** standard, XML uses "tags" to describe the *meaning* of text, not just its appearance.
- **Use Case**: Marking up a manuscript to show which words were crossed out by the author.
```xml
<poem>
  <line>The woods are <del>dark</del> <add>lovely</add>, dark and deep</line>
</poem>
```

---

## Format Comparison Guide

| Format | Structure | Best For... | DH Example |
| :--- | :--- | :--- | :--- |
| **TXT** | None | Text Analysis | Distant Reading |
| **CSV** | Tabular | Statistics / Mapping | Prosopography (Social Networks) |
| **JSON** | Nested | Web Data / Metadata | Storing API results |
| **XML** | Hierarchical | Complex Encoding | Scholarly Digital Editions |

:::tip
In the challenge in the sandbox, we use the `csv` module. Because we are working with a "string" of text rather than an actual file on your hard drive, we use `io.StringIO` to trick Python into treating that text like an open file, called 'virtual_file'. On your own computer, you wouldn't do that.
:::

:::challenge
This challenge has you do the basic building block of much more complicated workflows: read in each row of data, then do something with that row.
:::

---challenges---

### Challenge: Parse a CSV string

- id: digital-literacy-02-c1
- language: python
- difficulty: beginner

#### Starter Code

```python
import csv
import io

# A researcher gives you this string of archival data:
csv_data = """name,year,genre
Frankenstein,1818,Gothic
Pride and Prejudice,1813,Romance
Dracula,1897,Gothic"""

# Goal: Use csv.reader to print each row as a list
# 1. Wrap csv_data in io.StringIO()
# 2. Pass that to csv.reader()
# 3. Loop through and print each row

# Your code here
```

#### Expected Output

```
['name', 'year', 'genre']
['Frankenstein', '1818', 'Gothic']
['Pride and Prejudice', '1813', 'Romance']
['Dracula', '1897', 'Gothic']
```

#### Hints

1. The syntax is: reader = csv.reader(io.StringIO(csv_data))
2. Use "for row in reader:" to see the individual lists.

#### Solution

```python
import csv
import io

csv_data = """name,year,genre
Frankenstein,1818,Gothic
Pride and Prejudice,1813,Romance
Dracula,1897,Gothic"""

# Convert the string to a file-like object
virtual_file = io.StringIO(csv_data)

# Create the reader object
reader = csv.reader(virtual_file)

# Print each row
for row in reader:
    print(row)
```

