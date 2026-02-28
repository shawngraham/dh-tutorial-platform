---
id: structured-data-04
title: Grouping and Aggregation
moduleId: structured-data
prerequisites:
  - structured-data-03
estimatedTimeMinutes: 10
difficulty: intermediate
learningObjectives:
  - Understand the "Split-Apply-Combine" pattern of data analysis
  - Use GroupBy to categorize humanities data by metadata (genre, year, author)
  - Apply aggregate functions like sum, mean, and count to grouped data
  - Perform manual grouping using Python dictionaries
keywords:
  - groupby
  - aggregate
  - summary
  - statistics
  - counts
---

# Grouping and Aggregation: Comparing Categories

  In Digital Humanities, we often want to compare groups. We don't just want the average word count of a whole library; we want to compare the average word count of **Gothic novels** vs. **Romance novels**, or **18th-century letters** vs. **19th-century letters**.

  ---

  ## 1. The "Split-Apply-Combine" Pattern
  To analyze categories, we follow a three-step process:
  1.  **Split**: Divide the dataset into groups based on a label (e.g., "Genre").
  2.  **Apply**: Calculate a statistic for each group (e.g., "Count the rows" or "Find the Mean").
  3.  **Combine**: Merge those results back into a new summary table.

  ### The Pandas Way
  Pandas makes this process incredibly efficient with the `.groupby()` method.

  ```python
  import pandas as pd

  # Example: Finding the average publication year per genre
  summary = df.groupby('genre')['year'].mean()
  print(summary)
  ```

  ---

  ## 2. Common Aggregation Methods
  Once you have grouped your data, you can "Apply" different mathematical operations:
  - **`.count()`**: How many items are in this category?
  - **`.mean()`**: What is the average value?
  - **`.sum()`**: What is the total?
  - **`.max() / .min()`**: What are the extreme values in this group?

  ---

  ## 3. Under the Hood: Grouping with Dictionaries
  Before using Pandas, it's helpful to understand the logic of grouping. In Python, we use a dictionary to "collect" counts for different categories. 

  As we loop through our data, we check: *"Have I seen this genre before? If so, add 1 to its count. If not, start the count at 1."*

  ```python
  books = [('Gothic', 'Frankenstein'), ('Romance', 'Emma'), ('Gothic', 'Dracula')]
  counts = {}

  for genre, title in books:
      # Use .get() to avoid errors if the genre isn't in the dictionary yet
      counts[genre] = counts.get(genre, 0) + 1

  print(counts) # Output: {'Gothic': 2, 'Romance': 1}
  ```

  :::definition
  **Aggregation**: The process of turning many data points (individual books) into a single significant number (total count or average) that describes a group.
  :::

  :::challenge
  In the challenge in the sandbox, you are given a list of tuples. Each tuple contains a **genre** and a **title**. Your goal is to manually count how many books belong to the 'Gothic' genre using the dictionary method.
  :::
  

---challenges---

### Challenge: Group and Count by Genre

- id: structured-data-04-c1
- language: python
- difficulty: intermediate

#### Starter Code

```python
# A list of book tuples: (Genre, Title)
  books = [('Gothic', 'Frankenstein'), ('Gothic', 'Dracula'), ('Romance', 'Emma')]

  # 1. Create an empty dictionary called 'counts'
  # 2. Loop through the 'books' list
  # 3. For each book, update the count for that genre in the dictionary
  #    (Hint: Use counts[genre] = counts.get(genre, 0) + 1)
  # 4. Print the count specifically for 'Gothic'

  # Your code here
  
```

#### Expected Output

```
2
```

#### Hints

1. When looping through tuples, use: for genre, title in books:
2. The .get(genre, 0) method ensures that if a genre is new, it starts at 0 before adding 1.
3. To see the final result, make sure you print counts["Gothic"]

#### Solution

```python
books = [('Gothic', 'Frankenstein'), ('Gothic', 'Dracula'), ('Romance', 'Emma')]
  counts = {}

  for genre, title in books:
      counts[genre] = counts.get(genre, 0) + 1

  print(counts['Gothic'])
```

