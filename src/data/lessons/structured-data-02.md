---
id: structured-data-02
title: Pandas Basics
moduleId: structured-data
prerequisites:
  - structured-data-01
estimatedTimeMinutes: 10
difficulty: beginner
learningObjectives:
  - Load data into a Pandas DataFrame using dictionaries
  - Select specific columns and inspect data structure
  - Calculate the size and summary statistics of a dataset
  - Understand the advantage of DataFrames over manual CSV parsing
keywords:
  - pandas
  - dataframe
  - series
  - data science
  - metadata
---

# Introducing Pandas: The Powerhouse of DH Data

  ## Beyond the Spreadsheet
  While Excel is a common tool in the humanities, it has limits. It is difficult to track exactly how you changed your data in Excel, and it can crash with very large datasets. 

  **Pandas** is a Python library that treats data like a programmable spreadsheet called a **DataFrame**. Using Pandas makes your research **reproducible**: anyone can run your script and see exactly how you filtered or analyzed your data.

  ---

  ## 1. The DataFrame Structure
  A DataFrame is a two-dimensional table. You can think of it as a collection of **Series** (columns) that share the same index (row numbers).

  To use it, we always import it with the alias `pd`:
  ```python
  import pandas as pd

  # We can build a DataFrame from a dictionary of lists
  data = {
      'title': ['Frankenstein', 'Dracula', 'Jane Eyre'],
      'author': ['Shelley', 'Stoker', 'Brontë'],
      'year': [1818, 1897, 1847]
  }

  df = pd.DataFrame(data)
  ```

  ---

  ## 2. Inspecting Your Data
  Once your data is in a DataFrame, you can use these built-in methods to see what you have:

  - **`df.head(n)`**: Shows the first *n* rows.
  - **`df.shape`**: Shows the number of (rows, columns).
  - **`len(df)`**: Shows the total number of rows.
  - **`df['column_name']`**: Selects just one column.

  ```python
  print(df.shape) # Output: (3, 3)
  print(df['author']) # Shows just the authors list
  ```

  ---

  ## 3. Basic Statistics
  If your data has numbers (like publication years or word counts), Pandas can instantly calculate the "health" of your dataset.

  ```python
  # Gives count, mean, min, max, and percentiles for all numeric columns
  print(df.describe())
  ```

  :::tip
  **DH Use Case**: If you have a CSV of 10,000 library records, you can use `df['language'].value_counts()` to instantly see how many books are in English vs. French. This is much faster than manual counting!
  :::

  :::challenge
  In the challenge in the sandbox, you will practice creating a DataFrame from scratch. Remember that the **Keys** of your dictionary become the **Column Headers**, and the **Lists** become the **Rows**.
  :::
  

---challenges---

### Challenge: Create a Research DataFrame

- id: structured-data-02-c1
- language: python
- difficulty: beginner

#### Starter Code

```python
import pandas as pd

  # 1. Create a dictionary called 'research_data'
  #    It should have 3 columns: 'title', 'author', 'year'
  #    Add 3 books of your choice to each list.
  # 2. Convert the dictionary into a DataFrame named 'df'
  # 3. Print the length of the DataFrame using len(df)

  # Your code here
  
```

#### Expected Output

```
3
```

#### Hints

1. Your dictionary should look like: {"title": ["A", "B", "C"], ...}
2. To create the DataFrame, use: df = pd.DataFrame(research_data)
3. The output should be the number 3, as you added 3 books.

#### Solution

```python
import pandas as pd

  research_data = {
      'title': ['The Hobbit', 'Beloved', 'Oryx and Crake'],
      'author': ['Tolkien', 'Morrison', 'Atwood'],
      'year': [1937, 1987, 2003]
  }

  df = pd.DataFrame(research_data)

  print(len(df))
```

