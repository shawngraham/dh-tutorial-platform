---
id: data-viz-07
title: 'Stitching Data: Physicalization and Knitting'
moduleId: data-visualization
prerequisites:
  - data-viz-01
estimatedTimeMinutes: 10
difficulty: beginner
learningObjectives:
  - Define data physicalization and its role in the humanities
  - Map quantitative data values to physical variables (color, texture, and row count)
  - Generate a text-based "knitting pattern" from a Python list using loops and conditionals
keywords:
  - physicalization
  - encoding
  - textile
  - mapping
  - data-art
---

# Stitching Data: Physicalization and Knitting

## Analogy

Think of a spreadsheet as a piece of graph paper. In a digital chart, pixels are filled with color based on data. In knitting, each **stitch** is a pixel, and each **row** is a data point. Just as a web browser "renders" code into a visual interface, a knitter "renders" a pattern into a physical object. Both require a set of strict logical instructions to transform abstract numbers into a tangible form.

## Key Concepts

While we often view data on screens, **Data Physicalization** explores how bringing data into the physical world can change our emotional and intellectual understanding of it.

:::definition
**Data Physicalization**: The representation of data using physical artifacts rather than digital pixels. This allows for tactile, 3D, and multisensory exploration of information.
:::

### The Mapping Process

To turn data into a knit object (like a "Temperature Scarf"), you must create an **encoding schema**. You decide how a number (the data) translates into a physical choice:
1.  **Color**: Representing categories or ranges (e.g., Cold = Blue, Hot = Red).
2.  **Texture**: Representing different variables (e.g., Knit stitch = Positive sentiment, Purl stitch = Negative sentiment).
3.  **Scale**: Representing magnitude (e.g., more rows = a higher frequency of a word).

### Generating a Pattern

In Python, we can automate the creation of a pattern by iterating through a list of data and using `if/elif` statements to decide the "stitch" or "yarn color."

```python
# A list representing archive entries per year
data = [12, 45, 22] 

for year_value in data:
    if year_value > 30:
        print("Knit 2 rows with Red Yarn")
    else:
        print("Knit 2 rows with Blue Yarn")
```

## Practice

:::try-it
Imagine you are tracking how many characters speak in each chapter of a novel. If a chapter has more than 5 characters, you want to use a "Gold" yarn; otherwise, use "Grey." Try changing the threshold in the logic to see how it changes the "look" of your pattern.
:::

## Transfer

Physicalization is often used in "Data Activism." For example, the *Tempestry Project* uses knitted banners to show climate change over decades. How might a physical object—like a heavy, long scarf representing 100 years of census data—communicate "scale" differently than a small bar chart on a laptop screen?

:::challenge
In the challenges in the code sandbox, you will write a script to transform a list of "Sentiment Scores" from a diary into a sequence of knitting instructions.
:::

---challenges---

### Challenge: Mapping Colors to Mood

- id: data-viz-07-c1
- language: python
- difficulty: beginner

#### Starter Code

```python
# We have a list of sentiment scores from -1 (sad) to 1 (happy)
# Goal: For each score, if it's negative, use "Indigo". 
# If it's 0 or higher, use "Amber".

daily_scores = [-0.5, 0.2, 0.8, -0.1]

for score in daily_scores:
    # Your code here
    
```

#### Expected Output

```
Use Indigo yarn
Use Amber yarn
Use Amber yarn
Use Indigo yarn
```

#### Hints

1. Use an `if` statement to check if the `score` is less than 0.
2. Use `else` to catch all scores 0 or higher.
3. Make sure to print the exact strings "Use Indigo yarn" or "Use Amber yarn".

#### Solution

```python
daily_scores = [-0.5, 0.2, 0.8, -0.1]

for score in daily_scores:
    if score < 0:
        print("Use Indigo yarn")
    else:
        print("Use Amber yarn")
```

### Challenge: Determining Pattern Length

- id: data-viz-07-c2
- language: python
- difficulty: beginner

#### Starter Code

```python
# In knitting, "Scale" can represent frequency.
# Task: For each number of 'mentions' in the list, 
# print "Knit X rows", where X is the number of mentions.

mentions_per_page = [2, 5, 1]

for count in mentions_per_page:
    # Your code here
    
```

#### Expected Output

```
Knit 2 rows
Knit 5 rows
Knit 1 rows
```

#### Hints

1. You need to combine the string "Knit " with the variable `count` and the string " rows".
2. Remember that you can't add a number to a string directly; use `str(count)` or an f-string like `f"Knit {count} rows"`.

#### Solution

```python
mentions_per_page = [2, 5, 1]

for count in mentions_per_page:
    print(f"Knit {count} rows")
```

