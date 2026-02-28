---
id: rel-mod-03
title: Vector Arithmetic in 2D Space
moduleId: relational-models
prerequisites:
  - rel-mod-02
estimatedTimeMinutes: 10
difficulty: beginner
learningObjectives:
  - Perform element-wise vector addition and subtraction in Python
  - Define the "TransE" model (Translation Embeddings) in a 2D space
  - Explain how relations act as directional "journeys" between entities
keywords:
  - vector-arithmetic
  - TransE
  - embedding-space
  - 2D-vectors
---

# Vector Arithmetic: Thinking with Directions

## Analogy: A Map of Meaning

Imagine a map where cities aren't placed by geography, but by **culture**. The North-South axis measures **Artistic Significance**, and the East-West axis measures **Economic Power**.

On this map, to get from "Florence" to "Leonardo da Vinci," you would travel a specific direction: **North-West** (High Art, Lower Economic Power). This "journey"—`[Change in Economy, Change in Art]`—is a **vector**. 

If you start at "Rome" and take that *exact same journey*, you should land near "Michelangelo." The relationship "was_home_to_artist" is a repeatable, directional step on the map.

## Key Concepts

### 1. Relationships as Translations (TransE)
The model that powers this is called **TransE**. It treats relationships as a literal translation (or "shift") across the map.

:::definition
**TransE (Translation Embedding)**: A model that represents entities as points and relationships as vectors. It assumes that if you start at the Head's coordinates and "walk" along the Relation's vector, you will arrive at the Tail's coordinates.
`Head + Relation ≈ Tail`
:::

### 2. The Arithmetic of Meaning
In Python, we represent these 2D coordinates as lists with two numbers. To add vectors, we add each element at the same index.

```python
# Coordinates: [Economic_Power, Artistic_Significance]
florence = [7, 9]
was_home_to_artist = [-2, 1] # Move left (less econ), move up (more art)

# Predict the artist's location
# Add the first elements: 7 + (-2) = 5
# Add the second elements: 9 + 1 = 10
da_vinci = [florence[0] + was_home_to_artist[0], florence[1] + was_home_to_artist[1]]

print(f"The artist is at: {da_vinci}")
```

## Practice

:::try-it
In the sandbox, create coordinates for "UK" `[8, 6]` and a "capital_of" relation `[-1, 2]`. Calculate the coordinates for "London" by adding the two vectors element-wise.

```python
uk = [8, 6]
capital_of = [-1, 2]

london_x = uk[0] + capital_of[0]
london_y = uk[1] + capital_of[1]

print([london_x, london_y])
```
:::

## Transfer: Detecting Bias through Subtraction

This vector arithmetic is a powerful tool for digital humanities research. By training a model on historical texts, we can uncover hidden biases.

If we calculate the vector for `Doctor - Man + Woman`, a perfectly unbiased model would result in `Doctor`. However, models trained on 20th-century texts often result in `Nurse`. The vector difference between the expected and actual result gives us a measurable coordinate for the social bias present in the archive.

:::challenge
Apply vector arithmetic to predict entity positions and identify relationship vectors.
:::

---challenges---

### Challenge: Building the Vector Tools

- id: rel-mod-03-c1
- language: python
- difficulty: beginner

#### Starter Code

```python
# Before we can navigate the "map of meaning," we need two tools:
# one for adding vectors (following a relation forward)
# and one for subtracting them (working out what a relation IS).

def vec_add(a, b):
    # Return a new 2D list: [a[0]+b[0], a[1]+b[1]]
    pass

def vec_sub(a, b):
    # Return a new 2D list: [a[0]-b[0], a[1]-b[1]]
    pass

# Verify both functions work before moving on
print(vec_add([1, 2], [3, 4]))   # Expected: [4, 6]
print(vec_sub([9, 8], [3, 2]))   # Expected: [6, 6]
```

#### Expected Output
```
[4, 6]
[6, 6]
```

#### Hints

1. Both functions follow the same shape: operate on index 0, operate on index 1, return a new two-element list.
2. `vec_add([1,2], [3,4])` should return `[1+3, 2+4]`.
3. `vec_sub([9,8], [3,2])` should return `[9-3, 8-2]`.

#### Solution

```python
def vec_add(a, b):
    return [a[0] + b[0], a[1] + b[1]]

def vec_sub(a, b):
    return [a[0] - b[0], a[1] - b[1]]

print(vec_add([1, 2], [3, 4]))
print(vec_sub([9, 8], [3, 2]))
```

---

### Challenge: TransE in Both Directions

- id: rel-mod-03-c2
- language: python
- difficulty: beginner

#### Starter Code

```python
def vec_add(a, b):
    return [a[0] + b[0], a[1] + b[1]]

def vec_sub(a, b):
    return [a[0] - b[0], a[1] - b[1]]

# Coordinates: [Critical_Acclaim, Popular_Reach]
# The TransE formula: Head + Relation ≈ Tail

# Part A: Predicting a Tail
# We know where "Charlotte_Bronte" sits on the map,
# and we know the "authored" relation vector.
# Use vec_add to predict where "Jane_Eyre" should be.

charlotte_bronte = [7, 6]
authored         = [2, 4]  # This relation moves a work toward higher acclaim and reach

jane_eyre = # Your code here
print(f"Jane Eyre predicted at: {jane_eyre}")   # Expected: [9, 10]

# Part B: Recovering a Relation
# We know where both "George_Eliot" and "Middlemarch" sit.
# In TransE: Relation = Tail - Head
# Use vec_sub to find the "authored" relation vector from Eliot's perspective.

george_eliot = [8, 7]
middlemarch  = [9, 10]

eliot_authored = # Your code here
print(f"Eliot's 'authored' vector: {eliot_authored}")  # Expected: [1, 3]
```

#### Expected Output

```
Jane Eyre predicted at: [9, 10]
Eliot's 'authored' vector: [1, 3]
```

#### Hints

1. Part A is the forward TransE formula: `Tail = Head + Relation`. Call `vec_add` with `charlotte_bronte` and `authored`.
2. Part B is the inverse: `Relation = Tail - Head`. Call `vec_sub(tail, head)` — order matters here.
3. Notice that the two "authored" vectors `[2, 4]` and `[1, 3]` are close but not identical — in a real model, slight differences like this arise because each author's writing career has its own nuance.

#### Solution

```python
def vec_add(a, b):
    return [a[0] + b[0], a[1] + b[1]]

def vec_sub(a, b):
    return [a[0] - b[0], a[1] - b[1]]

charlotte_bronte = [7, 6]
authored         = [2, 4]

jane_eyre = vec_add(charlotte_bronte, authored)
print(f"Jane Eyre predicted at: {jane_eyre}")

george_eliot = [8, 7]
middlemarch  = [9, 10]

eliot_authored = vec_sub(middlemarch, george_eliot)
print(f"Eliot's 'authored' vector: {eliot_authored}")
```

### Challenge: Measuring Bias Through Vector Analogy

- id: rel-mod-03-c3
- language: python
- difficulty: beginner

#### Starter Code

```python
def vec_add(a, b):
    return [a[0] + b[0], a[1] + b[1]]

def vec_sub(a, b):
    return [a[0] - b[0], a[1] - b[1]]

# Coordinates: [Domestic_Role, Professional_Role]
# These embeddings were learned from a historical archive.

man    = [2, 9]
woman  = [8, 3]
doctor = [1, 10]

# The analogy: "Doctor is to Man as ??? is to Woman"
# Vector formula: result = Doctor - Man + Woman
# If the archive were unbiased, result would land on Doctor's coordinates.

# Step 1: Calculate the result using your two functions.
# Hint: you'll need to chain them — subtract first, then add.
result = # Your code here
print(f"Doctor - Man + Woman = {result}")   # Expected: [9, 4]

# Step 2: Calculate the Manhattan Distance between result and doctor.
# This gives us a single number measuring how far the archive "moves"
# a woman away from the profession of Doctor.
bias_distance = # Your code here
print(f"Bias distance from 'Doctor': {bias_distance}")   # Expected: 14

# Step 3: Reflect. Look at the result coordinates [9, 4].
# On a [Domestic_Role, Professional_Role] axis, what does that position mean?
# Complete this sentence:
print("This suggests the archive associates women in medicine more with: ___")
```

#### Expected Output

```
Doctor - Man + Woman = [9, 4]
Bias distance from 'Doctor': 14
This suggests the archive associates women in medicine more with: domestic and caregiving roles than professional authority
```

#### Hints

1. The formula is `(Doctor − Man) + Woman`. Call `vec_sub(doctor, man)` first, store the result, then pass it and `woman` to `vec_add`.
2. Manhattan Distance between two 2D points: `abs(result[0] - doctor[0]) + abs(result[1] - doctor[1])`.
3. Look at the two coordinates in `result`: the first (Domestic_Role) jumped from 1 to 9. The second (Professional_Role) dropped from 10 to 4. What story does that tell?

#### Solution

```python
def vec_add(a, b):
    return [a[0] + b[0], a[1] + b[1]]

def vec_sub(a, b):
    return [a[0] - b[0], a[1] - b[1]]

man    = [2, 9]
woman  = [8, 3]
doctor = [1, 10]

result = vec_add(vec_sub(doctor, man), woman)
print(f"Doctor - Man + Woman = {result}")

bias_distance = abs(result[0] - doctor[0]) + abs(result[1] - doctor[1])
print(f"Bias distance from 'Doctor': {bias_distance}")

print("This suggests the archive associates women in medicine more with: domestic and caregiving roles than professional authority")
```