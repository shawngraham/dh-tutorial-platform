---
id: rel-mod-01
title: The Geometry of Language
moduleId: relational-models
prerequisites:
  - python-basics
estimatedTimeMinutes: 10
difficulty: beginner
learningObjectives:
  - Explain the distributional hypothesis ("words are known by the company they keep")
  - Visualize words as coordinates in a multi-dimensional space
  - Calculate basic similarity between two word concepts using Python
keywords:
  - word-vectors
  - embeddings
  - similarity
  - abs
---

# The Geometry of Language

## The Library of Proximity

Imagine a library where books aren't organized by alphabet or author, but by **meaning**. 

In this library, the distance between two books tells you how much they have in common. To find a book about "Sailing," you don't look for the letter 'S'; you walk toward the "Ocean" section. 

If you walk 5 steps from "King" to "Man," and then walk 5 steps from "Queen" in the same direction, you should arrive at "Woman." This "Map of Meaning" is what computer scientists call a **Vector Space**.

## Key Concepts

### 1. The Distributional Hypothesis
Computers don't have childhood memories or sensory experiences. They learn what "Coffee" is by noticing it often appears near words like "mug," "drink," "caffeine," and "morning."

:::definition
**Distributional Hypothesis**: The idea that words appearing in similar contexts share similar meanings.
:::

### 2. Words as Coordinates
To place a word on a map, we give it coordinates. In a 2D map, a point is `[x, y]`. In language models, we might use hundreds of dimensions.

Imagine we score words based on two features: **[Nature, Technology]**.
*   **Tree**: `[0.9, 0.1]` (High nature, Low tech)
*   **Circuit**: `[0.1, 0.9]` (Low nature, High tech)
*   **Park**: `[0.7, 0.2]` (Mostly nature, some tech like benches/lights)

These lists of numbers are called **Word Vectors** or **Embeddings**.

### 3. Measuring the Gap
To find out how similar two words are, we calculate the **distance** between their coordinates. 

A simple way to start is with the `abs()` (absolute value) function. This tells us the positive distance between two numbers, regardless of which one is larger.

```python
# If "Epic_Poetry" has a Formality score of 9
# and "Diary_Entry" has a Formality score of 3
distance = abs(9 - 3) # Result: 6 — they are quite different
```

When we have **two features**, we find the total distance by adding the absolute differences for each dimension. This is called the **Manhattan Distance** (imagine walking along a city grid rather than flying in a straight line).

## Practice: Comparing Texts on a Feature Map

In the sandbox, we place two types of historical text on a 2D map of **[Formality, Sentiment]** and calculate the total gap across both dimensions.

:::try-it
Calculate the distance between a royal proclamation and a love letter using both features.
:::

```python
# Coordinates: [Formality, Sentiment]
royal_proclamation = [9, 3]
love_letter = [2, 9]

# Total distance = abs difference in Formality + abs difference in Sentiment
dist = abs(royal_proclamation[0] - love_letter[0]) + abs(royal_proclamation[1] - love_letter[1])
print(f"The distance is: {dist}")
```

## Transfer: Changing Contexts

How might "Word Vectors" change based on the archive you use? 

If you trained a model on **18th-century medical journals**, the word "Treatment" would be geographically very close to "Leeches" and "Bloodletting." In a **21st-century** model, "Treatment" would move far away from "Leeches" and closer to "Antibiotics" or "Therapy."

:::challenge
You have five historical documents scored on two features: **Formality** and **Sentiment**. Using Manhattan Distance, find which document is most similar to the diary entry then reflect on what their shared coordinates tell you about the kind of language they share.
:::

---challenges---

### Challenge: Finding the Nearest Neighbour

- id: rel-mod-01-c1
- language: python
- difficulty: beginner

#### Starter Code
```python
# Coordinates: [Formality, Sentiment]
# Five historical documents scored on two features
documents = {
    "legal_contract":   [9, 1],
    "personal_letter":  [3, 7],
    "royal_proclamation": [8, 2],
    "newspaper_report": [6, 4],
    "diary_entry_2":    [2, 9],
}

# The document we want to compare everything against
diary_entry = [2, 8]

# Step 1: Write a function that takes two coordinate lists [f, s]
# and returns the Manhattan Distance: the sum of absolute differences
# across both dimensions.
def manhattan(a, b):
    # Your code here
    pass

# Step 2: Loop through the documents dictionary.
# Calculate the distance from diary_entry to each document.
# Track which document has the smallest distance and what that distance is.
closest_name = ""
closest_dist = float("inf")  # Start with infinity so any real distance beats it

for name, coords in documents.items():
    dist = manhattan(diary_entry, coords)
    # Your code here — update closest_name and closest_dist if dist is smaller

print(f"Most similar to the diary: {closest_name} (distance: {closest_dist})")

# Step 3: Reflect on the distributional hypothesis.
# Look at the coordinates of the closest document and the diary entry.
# Print a one-line observation: what shared feature makes them close?
# Complete this string:
print("They share similar coordinates because: ___")
```

#### Expected Output
```
Most similar to the diary: diary_entry_2 (distance: 1)
They share similar coordinates because: both score low on formality and high on sentiment
```

#### Hints

1. `manhattan(a, b)` should return `abs(a[0] - b[0]) + abs(a[1] - b[1])` — the same formula from the try-it block, now wrapped so you can reuse it.
2. Inside your loop: `if dist < closest_dist:` then update both `closest_dist` and `closest_name`.
3. For Step 3, look at the winning document's coordinates and compare them to `diary_entry = [2, 8]` — what do the two numbers represent?

#### Solution
```python
documents = {
    "legal_contract":     [9, 1],
    "personal_letter":    [3, 7],
    "royal_proclamation": [8, 2],
    "newspaper_report":   [6, 4],
    "diary_entry_2":      [2, 9],
}

diary_entry = [2, 8]

def manhattan(a, b):
    return abs(a[0] - b[0]) + abs(a[1] - b[1])

closest_name = ""
closest_dist = float("inf")

for name, coords in documents.items():
    dist = manhattan(diary_entry, coords)
    if dist < closest_dist:
        closest_dist = dist
        closest_name = name

print(f"Most similar to the diary: {closest_name} (distance: {closest_dist})")
print("They share similar coordinates because: both score low on formality and high on sentiment")
```
