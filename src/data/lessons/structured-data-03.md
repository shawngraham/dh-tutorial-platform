---
id: structured-data-03
title: Filtering and Sorting Data
moduleId: structured-data
prerequisites:
  - structured-data-02
estimatedTimeMinutes: 10
difficulty: intermediate
learningObjectives:
  - Perform boolean indexing to filter datasets
  - Sort data by one or more criteria (e.g., chronological order)
  - Identify and handle missing data (NaNs) in historical records
  - Filter structured lists using list comprehensions
keywords:
  - filter
  - sort
  - query
  - boolean indexing
  - nan
---

# Filtering and Sorting: Interrogating the Archive

  The true power of structured data is the ability to "interrogate" it. Instead of scrolling through 5,000 rows in a spreadsheet, you can ask specific questions: *"Show me all books published in London between 1850 and 1860 that mention 'Science'."*

  ---

  ## 1. Boolean Indexing (Filtering)
  In Pandas, filtering is done using "Boolean Indexing." You create a rule, and Pandas applies it to every row, keeping only the ones that are `True`.

  The syntax looks a bit strange at first because you see the name of the DataFrame twice:
  ```python
  # "Inside the DataFrame (df), find rows where df['year'] is greater than 1850"
  later_books = df[df['year'] > 1850]
  ```

  ---

  ## 2. Sorting Data
  Sorting is essential for seeing chronological trends or finding outliers (like the longest or shortest books in a corpus).

  ```python
  # Sort by year, oldest first
  chronological_df = df.sort_values(by='year', ascending=True)

  # Sort by author alphabetically
  alphabetical_df = df.sort_values(by='author')
  ```

  ---

  ## 3. The "Gap" in the Archive (NaN)
  Historical data is rarely perfect. You will often encounter **NaN** (Not a Number), which represents missing data—perhaps a page was torn, or the publication year wasn't recorded.

  - **`df.dropna()`**: Removes any row that has missing data.
  - **`df.fillna("Unknown")`**: Replaces missing values with a placeholder string.

  ---

  ## 4. Filtering Lists of Dictionaries
  Sometimes, before you even get into Pandas, you have a simple Python list of dictionaries. To filter these, we use a **List Comprehension**. This is a condensed loop that "filters" as it goes:

  ```python
  data = [
      {"name": "Frankenstein", "year": 1818},
      {"name": "Dracula", "year": 1897}
  ]

  # Keep only items where year is greater than 1850
  filtered_list = [d for d in data if d['year'] > 1850]
  ```

  :::tip
  Think of a List Comprehension as: *[Item for Item in List if Condition]*. It is the "Intermediate" way to write a four-line loop in just one line.
  :::

  :::challenge
  In the challenge in the sandbox, you are given a list of dictionaries representing archival records. Use a list comprehension to filter for records where the year is greater than 1850.
  :::
  

---challenges---

### Challenge: Filter Archival Records

- id: structured-data-03-c1
- language: python
- difficulty: intermediate

#### Starter Code

```python
# A list of archival records
  data = [
      {'name': 'Pride and Prejudice', 'year': 1813},
      {'name': 'Frankenstein', 'year': 1818},
      {'name': 'Dracula', 'year': 1897}
  ]

  # Goal: Create a new list called 'filtered' that contains 
  # only the dictionaries where the 'year' is greater than 1850.

  # Your code here
  # 1. Use a list comprehension to filter the data
  # 2. Print the length of the filtered list

  
```

#### Expected Output

```
1
```

#### Hints

1. A list comprehension looks like: [d for d in data if d["year"] > 1850]
2. To get the length, use len(filtered).
3. Only "Dracula" (1897) matches the criteria, so your length should be 1.

#### Solution

```python
data = [
      {'name': 'Pride and Prejudice', 'year': 1813},
      {'name': 'Frankenstein', 'year': 1818},
      {'name': 'Dracula', 'year': 1897}
  ]

  # List comprehension filtering
  filtered = [d for d in data if d['year'] > 1850]

  print(len(filtered))
```

