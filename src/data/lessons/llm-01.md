---
id: llm-01
title: 'Words as Coordinates: Vectors and Embeddings'
moduleId: llm-foundations
prerequisites:
  - text-analysis-fundamentals
estimatedTimeMinutes: 10
difficulty: advanced
learningObjectives:
  - Explain what a vector is and why words can be represented as vectors
  - Describe how embedding spaces encode semantic similarity
  - Compute cosine similarity between two word vectors
keywords:
  - vectors
  - embeddings
  - word2vec
  - cosine similarity
  - representation learning
  - distributional hypothesis
---

# Words as Coordinates: Vectors and Embeddings

## Analogy

Think of how librarians classify books using a subject catalogue. A book on *19th-century American poetry* occupies a specific position in a conceptual space — close to other poetry books, further from mathematics textbooks. An **embedding** does the same thing for words: it assigns each word a *position* in a mathematical space so that words with similar meanings end up near each other.

## What Is a Vector?

A **vector** is an ordered list of numbers — coordinates that locate a point in space.

- In 2D: `[3, 7]` places a point 3 units right, 7 units up.
- In 300D: `[0.23, -0.91, 0.04, ..., 0.67]` places a *word* in a 300-dimensional space.

Those numbers are not arbitrary. Systems like **Word2Vec** and **GloVe** learn them by processing enormous text corpora, adjusting the numbers so that words appearing in similar *contexts* end up with similar vectors.

:::definition
**Embedding**: A learned mapping of a discrete object (such as a word or a token) to a dense, fixed-length vector of real numbers. The numbers themselves carry no meaning in isolation — meaning emerges from the *distances and directions* between vectors.
:::

## Why Does Context Shape Embeddings?

The core hypothesis — sometimes called the **distributional hypothesis** — is:

> *"You shall know a word by the company it keeps."* — J.R. Firth (1957)

If "monarch," "throne," "crown," and "reign" appear together frequently across millions of documents, their vectors cluster together in embedding space. The model never reads a definition; it infers meaning from co-occurrence.

## Arithmetic in Embedding Space

One of the most striking properties of trained embeddings is that *relationships* become *directions*:

```
king − man + woman ≈ queen
```
.
```
Paris − France + Italy ≈ Rome
```

These are not metaphors. The vector arithmetic literally produces a point in space close to those target words. Gender, geography, and tense can all be represented as consistent directional offsets.

## Measuring Similarity: Cosine Distance

To compare two word vectors, we use **cosine similarity** — the cosine of the angle between them.

| Value | Interpretation |
|-------|---------------|
| 1.0   | Identical direction (very similar) |
| 0.0   | Perpendicular (unrelated) |
| −1.0  | Opposite directions |

```python
import math

def dot_product(a, b):
    return sum(x * y for x, y in zip(a, b))

def magnitude(v):
    return math.sqrt(sum(x**2 for x in v))

def cosine_similarity(a, b):
    return dot_product(a, b) / (magnitude(a) * magnitude(b))

# Toy 4-dimensional embeddings
# Dimensions (loosely): [royalty, literary, mechanical, temporal]
king   = [0.9, 0.05, 0.0, 0.0]
queen  = [0.88, 0.15, 0.0, 0.0]
hammer = [0.0,  0.0,  0.9, 0.1]

print(f"king  ↔ queen:  {cosine_similarity(king, queen):.3f}")
print(f"king  ↔ hammer: {cosine_similarity(king, hammer):.3f}")
```

:::try-it
Modify the toy vectors above. Can you create vectors where "novel" and "poem" are closer to each other than either is to "equation"? Try adjusting the numbers and re-running to see what changes.
:::

## Transfer

In digital humanities, embeddings let you ask *spatial* questions about language: Are discussions of "freedom" closer to "slavery" in antebellum Southern newspapers than in Northern ones? Is the meaning of "progress" the same in 1850 and 1950? Embeddings turn interpretive questions into measurable distances across a corpus.

:::challenge
Cosine Similarity is used **a lot**. Try to implement it!
:::

---challenges---

### Challenge: Implement Cosine Similarity

- id: llm-01-c1
- language: python
- difficulty: intermediate

#### Starter Code

```python
import math

def cosine_similarity(a, b):
    # Step 1: compute the dot product (sum of element-wise products)
    dot = sum(x * y for x, y in zip(a, b))
    # Step 2: compute the magnitude of vector a
    mag_a = math.sqrt(sum(x**2 for x in a))
    # Your code here: compute mag_b, then return dot / (mag_a * mag_b)

# Dimensions (loosely): [royalty, literary, mechanical, temporal]
word_vectors = {
    "king":   [0.9,  0.05, 0.0, 0.0],
    "queen":  [0.88, 0.15, 0.0, 0.0],
    "hammer": [0.0,  0.0,  0.9, 0.1],
    "sonnet": [0.1,  0.85, 0.0, 0.2],
}

sim = cosine_similarity(word_vectors["king"], word_vectors["queen"])
print(f"{sim:.2f}")
```

#### Expected Output

```
0.99
```

#### Hints

1. The magnitude of a vector `v` is `sqrt(sum of each element squared)` — the same formula used for mag_a, applied to `b`.
2. Return `dot / (mag_a * mag_b)`.
3. With nearly identical direction, king and queen should score very close to 1.0.

#### Solution

```python
import math

def cosine_similarity(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    mag_a = math.sqrt(sum(x**2 for x in a))
    mag_b = math.sqrt(sum(x**2 for x in b))
    return dot / (mag_a * mag_b)

word_vectors = {
    "king":   [0.9,  0.05, 0.0, 0.0],
    "queen":  [0.88, 0.15, 0.0, 0.0],
    "hammer": [0.0,  0.0,  0.9, 0.1],
    "sonnet": [0.1,  0.85, 0.0, 0.2],
}

sim = cosine_similarity(word_vectors["king"], word_vectors["queen"])
print(f"{sim:.2f}")
```

### Challenge: The Odd One Out

- id: llm-01-c2
- language: python
- difficulty: intermediate

#### Starter Code

```python
import math

def cosine_similarity(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    mag_a = math.sqrt(sum(x**2 for x in a))
    mag_b = math.sqrt(sum(x**2 for x in b))
    return dot / (mag_a * mag_b)

# [royalty, literary, mechanical, temporal]
words = {
    "poem":    [0.05, 0.95, 0.0,  0.30],
    "ode":     [0.05, 0.90, 0.0,  0.25],
    "sonnet":  [0.10, 0.92, 0.0,  0.20],
    "spanner": [0.00, 0.00, 0.95, 0.10],
}

# For each word, compute its average cosine similarity to all other words.
# The word with the lowest average similarity is the odd one out.
avg_similarities = {}
word_list = list(words.keys())

for w in word_list:
    others = [x for x in word_list if x != w]
    avg_sim = sum(cosine_similarity(words[w], words[o]) for o in others) / len(others)
    avg_similarities[w] = avg_sim

# Your code here: find and print the word with the lowest average similarity
```

#### Expected Output

```
spanner
```

#### Hints

1. Use `min(avg_similarities, key=avg_similarities.get)` to find the key with the smallest value.
2. Then print that word.

#### Solution

```python
import math

def cosine_similarity(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    mag_a = math.sqrt(sum(x**2 for x in a))
    mag_b = math.sqrt(sum(x**2 for x in b))
    return dot / (mag_a * mag_b)

words = {
    "poem":    [0.05, 0.95, 0.0,  0.30],
    "ode":     [0.05, 0.90, 0.0,  0.25],
    "sonnet":  [0.10, 0.92, 0.0,  0.20],
    "spanner": [0.00, 0.00, 0.95, 0.10],
}

avg_similarities = {}
word_list = list(words.keys())

for w in word_list:
    others = [x for x in word_list if x != w]
    avg_sim = sum(cosine_similarity(words[w], words[o]) for o in others) / len(others)
    avg_similarities[w] = avg_sim

odd_one_out = min(avg_similarities, key=avg_similarities.get)
print(odd_one_out)
```
