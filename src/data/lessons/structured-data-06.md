---
id: structured-data-06
title: Working with Metadata
moduleId: structured-data
prerequisites:
  - structured-data-02
estimatedTimeMinutes: 10
difficulty: intermediate
learningObjectives:
  - Distinguish between descriptive, administrative, and structural metadata
  - Explain the importance of interoperability and standards like Dublin Core
  - Extract and transform metadata from complex nested dictionaries
  - Perform faceted analysis (summarizing a collection by metadata fields)
keywords:
  - metadata
  - cataloguing
  - dublin core
  - faceted search
  - collections
  - interoperability
---

# Working with Metadata

## The Analogy: The Library Spine

If you walk into a library, the book itself is the **data**—the words, characters, and plot. But the label on the spine, the barcode, and the entry in the digital catalog are the **metadata**: data *about* the data. 

In Digital Humanities, metadata is what allows us to organize a "pile of files" into a "searchable archive." Without it, we couldn't ask questions like "How did the sentiment of novels change between 1850 and 1900?" because the computer wouldn't know which file belongs to which year.

## Key Concepts

### 1. Types of Metadata
Humanities researchers typically deal with three types:
*   **Descriptive**: Information about the content (Title, Author, Abstract, Keywords).
*   **Administrative**: Technical details (File format, Rights/Copyright, Date of Digitization).
*   **Structural**: How the resource is put together (e.g., Page 1 comes before Page 2).

### 2. Standards and Interoperability
If every archive used their own names for fields (one uses "Author," another "Writer," another "Creator"), we couldn't combine them. We use **Standards** to ensure **Interoperability**.

:::definition
**Dublin Core (DC)**: A set of 15 "core" elements used globally by libraries and museums. Common fields include *Title, Creator, Subject, Description, Publisher, Contributor, Date, Type, Format, Identifier, Source, Language, Relation, Coverage, and Rights*.
:::

### 3. Metadata as Dictionaries
In Python, a single metadata record is almost always represented as a **Dictionary**. Often, these are "nested," meaning a value might be a list or another dictionary.

```python
# A typical DH metadata record
record = {
    "dc:title": "The Last Man",
    "dc:creator": ["Mary Shelley"],
    "dc:date": "1826-01-23",
    "dc:subject": ["Apocalyptic fiction", "Pandemic", "Gothic"],
    "admin": {
        "scanner_model": "Epson v600",
        "rights": "Public Domain"
    }
}

# Accessing a nested field
print(f"Format: {record['admin']['rights']}") 
# Accessing an item in a list
print(f"Primary Subject: {record['dc:subject'][0]}")
```

### 4. Faceted Analysis
Once we have a collection of records, we can "facet" them. This means grouping them by a specific field (like "Date" or "Subject") to see the bird's-eye view of a collection.

## The Reality: Metadata Cleaning
Real-world metadata is often "dirty." You will frequently need to:
1.  **Normalize Dates**: Changing "Jan 1826" and "1826-01-23" both to "1826".
2.  **Split Strings**: Changing "Shelley, Mary; Byron, Lord" into a clean list of names.
3.  **Handle Missing Data**: Deciding what to do if a record has no "Creator."

---

## Practice

:::try-it
**The Archivist's Choice**
Look at the record above. If you were building a website for this collection, which fields would you use for a "Search Bar" and which would you use for a "Filter" (facet)? Why?
:::

## Transfer: DH Use Cases

*   **Museum Studies**: Analyzing the "Provenance" (history of ownership) of artifacts using the source and description fields.
*   **Digital Archives**: Using tools like **Omeka** or **Tropy**, which are built entirely around the Dublin Core standard.
*   **Zotero**: When you save a paper to Zotero, you are actually just capturing its metadata for later citation.

:::challenge
Produce a summary report from a mock archive.
:::

---challenges---

### Challenge: Summarize by Subject

- id: structured-data-06-c1
- language: python
- difficulty: intermediate

#### Starter Code

```python
from collections import Counter

# A small digital collection from a Gothic Archive
collection = [
    {"title": "Frankenstein", "subjects": ["Gothic", "Science Fiction"]},
    {"title": "The Vampyre", "subjects": ["Gothic", "Horror"]},
    {"title": "The Last Man", "subjects": ["Science Fiction", "Post-Apocalyptic"]},
    {"title": "Northanger Abbey", "subjects": ["Gothic", "Satire"]},
    {"title": "The Monk", "subjects": ["Gothic", "Horror"]},
]

# Task:
# 1. Create a list called 'all_subjects' containing every subject from every book
# 2. Use Counter to find the frequencies
# 3. Print the results sorted alphabetically: "Subject: Count"

all_subjects = []

# Your code here

```

#### Expected Output

```
Gothic: 4
Horror: 2
Post-Apocalyptic: 1
Satire: 1
Science Fiction: 2
```

#### Hints

1. Use a nested loop: `for item in collection:` then `for sub in item["subjects"]:`
2. Use `all_subjects.append(sub)` or `all_subjects.extend(item["subjects"])`
3. Use `sorted(counts.items())` to get the alphabetical order.

#### Solution

```python
from collections import Counter

collection = [
    {"title": "Frankenstein", "subjects": ["Gothic", "Science Fiction"]},
    {"title": "The Vampyre", "subjects": ["Gothic", "Horror"]},
    {"title": "The Last Man", "subjects": ["Science Fiction", "Post-Apocalyptic"]},
    {"title": "Northanger Abbey", "subjects": ["Gothic", "Satire"]},
    {"title": "The Monk", "subjects": ["Gothic", "Horror"]},
]

all_subjects = []
for item in collection:
    all_subjects.extend(item["subjects"])

counts = Counter(all_subjects)
for subject, count in sorted(counts.items()):
    print(f"{subject}: {count}")
```

### Challenge: Cleaning Dates for Decades

- id: structured-data-06-c2
- language: python
- difficulty: intermediate

#### Starter Code

```python
from collections import Counter

# Metadata often has inconsistent date formats
collection = [
    {"title": "Work A", "date": "1794-05-12"},
    {"title": "Work B", "date": "1818"},
    {"title": "Work C", "date": "1819-12-01"},
    {"title": "Work D", "date": "1796"},
    {"title": "Work E", "date": "1826-01-01"},
]

# Task: 
# 1. Extract the year (first 4 characters) from each date string
# 2. Convert that year into a decade (e.g., "1818" -> "1810s")
# 3. Print the count of items per decade, sorted chronologically

# Your code here
```

#### Expected Output

```
1790s: 2
1810s: 2
1820s: 1
```

#### Hints

1. To get the decade, use string slicing: `date_str[:3] + "0s"`
2. Example: "1794"[:3] is "179". Adding "0s" makes it "1790s".

#### Solution

```python
from collections import Counter

collection = [
    {"title": "Work A", "date": "1794-05-12"},
    {"title": "Work B", "date": "1818"},
    {"title": "Work C", "date": "1819-12-01"},
    {"title": "Work D", "date": "1796"},
    {"title": "Work E", "date": "1826-01-01"},
]

decades = []
for item in collection:
    year_prefix = item["date"][:3]
    decades.append(year_prefix + "0s")

counts = Counter(decades)
for decade, count in sorted(counts.items()):
    print(f"{decade}: {count}")
```

