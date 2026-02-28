---
id: llm-02
title: 'The Art of Paying Attention: Transformers and Self-Attention'
moduleId: llm-foundations
prerequisites:
  - llm-01
estimatedTimeMinutes: 10
difficulty: advanced
learningObjectives:
  - Describe the Query, Key, Value framework for attention
  - Explain why attention replaced recurrence in sequence models
  - Compute a basic attention weight distribution by hand
keywords:
  - attention
  - transformer
  - query key value
  - self-attention
  - sequence modeling
  - softmax
---

# The Art of Paying Attention: Transformers and Self-Attention

## Analogy

Imagine writing a summary of a dense archival document. You do not read every word with equal care: when you write "the king signed the decree," your eye is drawn back to the king's name, the nature of the decree, the date. You *attend* selectively to what is most relevant. The **attention mechanism** formalises this selective focus mathematically, letting a model weigh every part of its input dynamically rather than treating all positions equally.

## Why Attention? The Problem with Earlier Approaches

Before the 2017 paper *"Attention Is All You Need"* (Vaswani et al.), sequence models processed text word by word, left to right, carrying a **hidden state** that compressed everything seen so far. The problem: that hidden state is a single fixed-size vector. By word 400 of a 500-word document, information from word 1 has been overwritten. Long-range dependencies — the pronoun that refers to a noun fifty words back — were difficult to capture.

**Attention solves this** by letting every position look directly at every other position, regardless of distance.

## Query, Key, Value: A Library Analogy

Think of a library retrieval system:

- **Query (Q)**: Your search request — *"books about 17th-century astronomy"*
- **Keys (K)**: The catalogue labels on every book — *"astronomy-1632"*, *"theology-1680"*, ...
- **Values (V)**: The actual content inside each book

The system scores your query against every key. Books whose labels match your query get high scores; those scores determine how much of each book's *content* flows into your result.

In a Transformer:
1. Each token's embedding is projected into three vectors: Q, K, and V.
2. Each token's Q is compared (via dot product) with every other token's K.
3. The scores are scaled and passed through **softmax** to produce **attention weights** — probabilities that sum to 1.
4. The output is a weighted sum of all V vectors.

:::definition
**Self-Attention**: When a sequence attends to itself — every position queries every other position in the same input. This is the core operation of the Transformer architecture.
:::

## The Mathematics

For a sequence of n tokens, each represented as a vector of dimension d:

```
Attention(Q, K, V) = softmax( Q · Kᵀ / √d ) · V
```

The `√d` scaling prevents dot products from growing too large in high-dimensional spaces, which would push the softmax into near-zero gradients and stall learning.

```python
import math

def softmax(scores):
    """Convert a list of raw scores to a probability distribution."""
    max_score = max(scores)  # numerical stability trick
    exp_scores = [math.exp(s - max_score) for s in scores]
    total = sum(exp_scores)
    return [e / total for e in exp_scores]

def dot(a, b):
    return sum(x * y for x, y in zip(a, b))

# Toy example: 3 tokens, 2-dimensional Q/K/V vectors
# Tokens: ["The", "ancient", "manuscript"]
queries = [[1.0, 0.0], [0.5, 0.5], [0.0, 1.0]]
keys    = [[1.0, 0.0], [0.6, 0.4], [0.0, 1.0]]
values  = [[1.0, 0.0], [0.5, 0.5], [0.0, 1.0]]

d = len(queries[0])

# Attention from position 0 ("The") to all positions
q = queries[0]
raw_scores = [dot(q, k) / math.sqrt(d) for k in keys]
weights = softmax(raw_scores)

print("Attention weights from 'The':", [f"{w:.3f}" for w in weights])

# Weighted sum of values produces the output for "The"
output = [sum(weights[i] * values[i][j] for i in range(3)) for j in range(d)]
print("Output vector:", [f"{v:.3f}" for v in output])
```

:::try-it
Change `queries[0]` from `[1.0, 0.0]` to `[0.0, 1.0]` and observe how the attention weights shift. Which token does "The" now attend to most? This is how changing a word's query vector changes what it "looks for" in the rest of the sequence.
:::

## Multi-Head Attention

A single attention operation captures one kind of relationship (perhaps subject-verb agreement). **Multi-head attention** runs several attention operations in parallel, each with different learned Q/K/V projections, then concatenates the results. Each "head" can specialise in a different linguistic relationship — one might track coreference, another might track syntactic dependencies.

## Transfer

For literary scholars and historians, attention weights are interpretable artifacts. Researchers have visualised attention heads in BERT and found that some heads track pronouns back to their antecedents, others track syntactic governors. This makes attention a potential analytical tool for computational stylistics — though always with the caveat that correlation with linguistic structure does not equal causal explanation.

:::challenge
Compute the attention weights. In the challenge, the model is trying to decide which "archival fragment" (the **Keys**) best matches a specific "research question" (the **Query**).
:::

---challenges---

### Challenge: Thematic Attention

- id: llm-02-c1
- language: python
- difficulty: advanced

#### Starter Code

```python
import math

def softmax(scores):
    """Converts raw relevance scores into probabilities that sum to 1.0."""
    max_score = max(scores)
    exp_scores = [math.exp(s - max_score) for s in scores]
    total = sum(exp_scores)
    return [e / total for e in exp_scores]

# Each vector represents [Religion, Politics, Science]
# A value of 1.0 means that theme is strongly present.
themes = ["Ecclesiastical History", "Parliamentary Records", "Lab Manual", "Royal Decree"]

keys = [
    [1.0, 0.0, 0.0], # Key 0: Heavily religious
    [0.0, 1.0, 0.0], # Key 1: Heavily political
    [0.0, 0.0, 1.0], # Key 2: Heavily scientific
    [0.8, 0.7, 0.0], # Key 3: Mixture of Divine Right (Relig/Pol)
]

# Our Query: We are looking for documents about "Faith and Theology"
query = [1.0, 0.0, 0.0]
d = len(query)

# Your code here: compute raw_relevance_scores as a list.
# For each 'k' in keys, the score is the 'alignment' with the query.
# Formula: (Dot Product of query and k) / sqrt(d)
# Note: Dot Product is the sum of (query[i] * k[i]) for all dimensions.
raw_relevance_scores = [] 

# Convert raw scores to Attention Weights
weights = softmax(raw_relevance_scores)

# Find the index of the fragment the model "attends" to most
best_index = weights.index(max(weights))

print(f"The model attends most to: {themes[best_index]}")
print(f"Attention Weight: {weights[best_index]:.2f}")
```

#### Expected Output

```
The model attends most to: Ecclesiastical History
Attention Weight: 0.44
```

#### Hints

1. **The Dot Product**: This measures how much two vectors "overlap." For each key, multiply `query[0]*key[0]`, `query[1]*key[1]`, etc., and add them up.
2. **The Scaling Factor**: Divide your dot product by `math.sqrt(d)` (in this case, `math.sqrt(3)`). This is a standard Transformer trick to keep scores from getting too large.
3. **Softmax Logic**: Notice that "Ecclesiastical History" (Key 0) and "Royal Decree" (Key 3) both contain religious themes. The Attention mechanism will distribute

#### Solution

```python
import math

def softmax(scores):
    max_score = max(scores)
    exp_scores = [math.exp(s - max_score) for s in scores]
    total = sum(exp_scores)
    return [e / total for e in exp_scores]

themes = ["Ecclesiastical History", "Parliamentary Records", "Lab Manual", "Royal Decree"]
keys = [
    [1.0, 0.0, 0.0],
    [0.0, 1.0, 0.0],
    [0.0, 0.0, 1.0],
    [0.8, 0.7, 0.0],
]

query = [1.0, 0.0, 0.0]
d = len(query)

# Compute raw scores using a list comprehension or a loop
raw_relevance_scores = []
for k in keys:
    # Calculate Dot Product
    dot_product = sum(query[i] * k[i] for i in range(d))
    # Scale by sqrt(d)
    raw_relevance_scores.append(dot_product / math.sqrt(d))

weights = softmax(raw_relevance_scores)
best_index = weights.index(max(weights))

print(f"The model attends most to: {themes[best_index]}")
print(f"Attention Weight for '{themes[best_index]}': {weights[best_index]:.2f}")
print(f"Attention Weight for '{themes[3]}': {weights[3]:.2f}")
```
