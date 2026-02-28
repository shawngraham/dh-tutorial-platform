---
id: rel-mod-05
title: 'Measuring Truth: Evaluation Metrics'
moduleId: relational-models
prerequisites:
  - rel-mod-04
estimatedTimeMinutes: 10
difficulty: intermediate
learningObjectives:
  - Define "Negative Sampling" and why it is necessary for training
  - Calculate a simple "Hits@K" metric
  - Interpret model performance in the context of historical archives
keywords:
  - evaluation
  - hits-at-k
  - negative-sampling
  - accuracy
---

# Measuring Truth: Evaluation Metrics

## Analogy: The Multiple Choice Test

Imagine you are an English teacher. You give a student a question: *"Who wrote Frankenstein?"*

If the student just says "A person," they aren't exactly wrong, but they aren't right either. To really test them, you give them a list of choices:
1. Mary Shelley
2. Percy Shelley
3. Lord Byron
4. Bram Stoker

If the correct answer is in their **Top 1** guess, they are an expert. If the correct answer is at least in their **Top 3** list, they are doing okay. In Knowledge Graphs, we call this **Hits@K**.

## Key Concepts

### 1. Negative Sampling
To learn what is "true," a model like PyKEEN must also see what is "false." If a model only ever sees correct triples, it might start to believe that *everyone* wrote *Frankenstein*. 

:::definition
**Negative Sampling**: The process of creating "fake" triples by taking a real triple and swapping the Head or Tail with a random entity. 
*Real: (Shelley, wrote, Frankenstein)*
*Fake: (Napoleon, wrote, Frankenstein)*
:::

### 2. Hits@K
When we evaluate a model, we ask: "When you ranked all possible answers, where did the correct one land?"

*   **Hits@1**: Was the correct answer the #1 choice?
*   **Hits@3**: Was the correct answer in the top 3?
*   **Hits@10**: Was the correct answer in the top 10?

```python
# A model's ranked guesses for "Capital of France"
predictions = ["Lyon", "Marseille", "Paris", "Nice", "Bordeaux"]

# In Python, index 2 is the 3rd item
# Hits@3 = True (It's in the first 3)
# Hits@1 = False (It's not in the first 1)
```

## Practice

:::try-it
Imagine a model is trying to predict which philosopher influenced **Mary Wollstonecraft**. It has ranked its top 5 guesses in a list. 

In the sandbox, use **list slicing** to extract the "Top 3" and check if "Rousseau" made the cut.

```python
# The model's ranked guesses (Index 0 is the #1 guess)
guesses = ["Godwin", "Locke", "Rousseau", "Burke", "Paine"]

# 1. Get the first three items
top_3 = guesses[0:3]

# 2. Print the top_3 list to see who is in it
print(f"Top 3 Candidates: {top_3}")

# 3. Check if 'Rousseau' is in that specific slice
if "Rousseau" in top_3:
    print("Result: Hit@3")
```
:::

## Transfer: What is a "Good" Score?

In the hard sciences, a low Hits@1 score might be considered a failure. But in the **Digital Humanities**, a model that can't get the #1 answer might still be incredibly useful. 

If a model's Hits@10 is high, it means the model has learned the "neighborhood" of truth. It might not know exactly which monk wrote a specific manuscript, but it knows the correct *monastery* or *time period*. In an archive of thousands of people, narrowing a mystery down to the "Top 10" candidates is often a massive breakthrough.

:::challenge
Determine if the correct answers fall within the model's top-ranked results.
:::

---challenges---

### Challenge: Constructing Negative Samples

- id: rel-mod-05-c1
- language: python
- difficulty: intermediate

#### Starter Code
```python
# Before a model can learn what is TRUE, it must also see what is FALSE.
# We create "negative" triples by corrupting a real triple —
# swapping either the Head or Tail with a random entity from the archive.

import random
random.seed(42)

# All known entities in the archive
entities = [
    "Mary_Shelley", "Percy_Shelley", "Byron", "Polidori",
    "Frankenstein", "Prometheus_Unbound", "Childe_Harold", "The_Vampyre"
]

# Real (positive) triples
positive_triples = [
    ("Mary_Shelley",  "authored", "Frankenstein"),
    ("Percy_Shelley", "authored", "Prometheus_Unbound"),
    ("Byron",         "authored", "Childe_Harold"),
    ("Polidori",      "authored", "The_Vampyre"),
]

# Step 1: For each positive triple, generate one CORRUPTED triple
# by replacing the Tail with a randomly chosen entity from `entities`.
# Make sure the replacement is not the same as the original Tail.
# Store each corrupted triple as a tuple in `negative_triples`.

negative_triples = []

for head, relation, tail in positive_triples:
    # Pick a random entity that is NOT the correct tail
    fake_tail = tail
    while fake_tail == tail:
        fake_tail = random.choice(entities)
    # Your code here — append (head, relation, fake_tail) to negative_triples
    pass

# Step 2: Print a labelled comparison for each pair
for i in range(len(positive_triples)):
    print(f"REAL: {positive_triples[i]}")
    print(f"FAKE: {negative_triples[i]}")
    print()
```

#### Expected Output
```
REAL: ('Mary_Shelley', 'authored', 'Frankenstein')
FAKE: ('Mary_Shelley', 'authored', 'Childe_Harold')

REAL: ('Percy_Shelley', 'authored', 'Prometheus_Unbound')
FAKE: ('Percy_Shelley', 'authored', 'Polidori')

REAL: ('Byron', 'authored', 'Childe_Harold')
FAKE: ('Byron', 'authored', 'Frankenstein')

REAL: ('Polidori', 'authored', 'The_Vampyre')
FAKE: ('Polidori', 'authored', 'Byron')
```

#### Hints

1. The `while fake_tail == tail:` loop keeps picking until it finds something different — you just need to append the finished tuple after the loop exits.
2. A corrupted triple keeps the Head and Relation unchanged: only the Tail is swapped.
3. Think about why we must ensure `fake_tail != tail` — what would happen to training if a "fake" triple were accidentally true?

#### Solution
```python
import random
random.seed(42)

entities = [
    "Mary_Shelley", "Percy_Shelley", "Byron", "Polidori",
    "Frankenstein", "Prometheus_Unbound", "Childe_Harold", "The_Vampyre"
]

positive_triples = [
    ("Mary_Shelley",  "authored", "Frankenstein"),
    ("Percy_Shelley", "authored", "Prometheus_Unbound"),
    ("Byron",         "authored", "Childe_Harold"),
    ("Polidori",      "authored", "The_Vampyre"),
]

negative_triples = []
for head, relation, tail in positive_triples:
    fake_tail = tail
    while fake_tail == tail:
        fake_tail = random.choice(entities)
    negative_triples.append((head, relation, fake_tail))

for i in range(len(positive_triples)):
    print(f"REAL: {positive_triples[i]}")
    print(f"FAKE: {negative_triples[i]}")
    print()
```

### Challenge: Calculating and Interpreting Hits@K

- id: rel-mod-05-c2
- language: python
- difficulty: intermediate

#### Starter Code
```python
# A model has been evaluated on 6 historical queries.
# For each query, we have the model's ranked predictions
# and the single correct answer.

queries = [
    {
        "question": "Who authored Frankenstein?",
        "correct": "Mary_Shelley",
        "predictions": ["Percy_Shelley", "Byron", "Mary_Shelley", "Polidori", "Godwin",
                        "Wollstonecraft", "Hardy", "Dickens", "Eliot", "Gaskell"]
    },
    {
        "question": "Who authored Middlemarch?",
        "correct": "George_Eliot",
        "predictions": ["Gaskell", "Brontë", "Oliphant", "Trollope", "George_Eliot",
                        "Hardy", "Dickens", "Collins", "Kingsley", "Jewsbury"]
    },
    {
        "question": "Who authored Jane Eyre?",
        "correct": "Charlotte_Brontë",
        "predictions": ["Charlotte_Brontë", "Emily_Brontë", "Gaskell", "Eliot", "Oliphant",
                        "Hardy", "Trollope", "Dickens", "Collins", "Kingsley"]
    },
    {
        "question": "Who authored The Tenant of Wildfell Hall?",
        "correct": "Anne_Brontë",
        "predictions": ["Gaskell", "Oliphant", "Trollope", "Dickens", "Collins",
                        "Anne_Brontë", "Hardy", "Eliot", "Kingsley", "Jewsbury"]
    },
    {
        "question": "Who authored North and South?",
        "correct": "Gaskell",
        "predictions": ["Gaskell", "Eliot", "Oliphant", "Trollope", "Hardy",
                        "Dickens", "Collins", "Brontë", "Kingsley", "Jewsbury"]
    },
    {
        "question": "Who authored The Half-Sisters?",
        "correct": "Geraldine_Jewsbury",
        "predictions": ["Oliphant", "Gaskell", "Eliot", "Trollope", "Collins",
                        "Geraldine_Jewsbury", "Hardy", "Dickens", "Brontë", "Kingsley"]
    },
]

# Step 1: Write a function `hits_at_k(predictions, correct, k)` that returns
# True if `correct` appears in the first `k` items of `predictions`.
def hits_at_k(predictions, correct, k):
    # Your code here
    pass

# Step 2: Calculate Hits@1, Hits@3, and Hits@5 across all queries.
# For each K, count how many queries scored a hit, then divide by total queries.
for k in [1, 3, 5]:
    hit_count = 0
    for query in queries:
        if hits_at_k(query["predictions"], query["correct"], k):
            hit_count += 1
    score = hit_count / len(queries)
    print(f"Hits@{k}: {score:.2f}  ({hit_count}/{len(queries)} queries)")

print()

# Step 3: Find queries that missed Hits@5 but recovered by Hits@10.
# These are cases where the model KNOWS the correct answer exists
# but doesn't rank it highly enough — a subtler problem than ignorance.
# Print: "  '<question>' — correct answer ranked #<rank>"
print("Late recoveries (missed Top 5, found in Top 10):")
for query in queries:
    missed_5 = not hits_at_k(query["predictions"], query["correct"], 5)
    found_10 = hits_at_k(query["predictions"], query["correct"], 10)
    if missed_5 and found_10:
        # Your code here — find the rank and print it
        pass

print()

# Step 4: Reflect on what the Jewsbury result tells you.
# The model ranked her #6 — it knows she exists, but not confidently enough.
# Complete these sentences:
print("Jewsbury appears in the model's predictions but is ranked #6, not Top 5, because: ___")
print("This matters for DH research because: ___")
```

#### Expected Output
```
Hits@1: 0.50  (3/6 queries)
Hits@3: 0.67  (4/6 queries)
Hits@5: 0.67  (4/6 queries)

Late recoveries (missed Top 5, found in Top 10):
  'Who authored The Tenant of Wildfell Hall?' — correct answer ranked #6
  'Who authored The Half-Sisters?' — correct answer ranked #6

Jewsbury appears in the model's predictions but is ranked #6, not Top 5, because: the archive contains fewer documents connecting her name to her works than it does for Eliot or Gaskell
This matters for DH research because: a researcher using Hits@5 as their threshold would never be directed to her, even though the model has enough evidence to place her at #6
```

#### Hints

1. `hits_at_k` needs one line: `return correct in predictions[:k]`.
2. For Step 2, the loop structure is provided — call your function and accumulate `hit_count`.
3. For Step 3, use `query["predictions"].index(query["correct"]) + 1` to find the rank (`.index()` is zero-based, so add 1 for a human-readable rank number).
4. For Step 4, notice that *two* authors are late recoveries. Is there anything they have in common that might explain why the model underranks them?

#### Solution
```python
queries = [
    {
        "question": "Who authored Frankenstein?",
        "correct": "Mary_Shelley",
        "predictions": ["Percy_Shelley", "Byron", "Mary_Shelley", "Polidori", "Godwin",
                        "Wollstonecraft", "Hardy", "Dickens", "Eliot", "Gaskell"]
    },
    {
        "question": "Who authored Middlemarch?",
        "correct": "George_Eliot",
        "predictions": ["Gaskell", "Brontë", "Oliphant", "Trollope", "George_Eliot",
                        "Hardy", "Dickens", "Collins", "Kingsley", "Jewsbury"]
    },
    {
        "question": "Who authored Jane Eyre?",
        "correct": "Charlotte_Brontë",
        "predictions": ["Charlotte_Brontë", "Emily_Brontë", "Gaskell", "Eliot", "Oliphant",
                        "Hardy", "Trollope", "Dickens", "Collins", "Kingsley"]
    },
    {
        "question": "Who authored The Tenant of Wildfell Hall?",
        "correct": "Anne_Brontë",
        "predictions": ["Gaskell", "Oliphant", "Trollope", "Dickens", "Collins",
                        "Anne_Brontë", "Hardy", "Eliot", "Kingsley", "Jewsbury"]
    },
    {
        "question": "Who authored North and South?",
        "correct": "Gaskell",
        "predictions": ["Gaskell", "Eliot", "Oliphant", "Trollope", "Hardy",
                        "Dickens", "Collins", "Brontë", "Kingsley", "Jewsbury"]
    },
    {
        "question": "Who authored The Half-Sisters?",
        "correct": "Geraldine_Jewsbury",
        "predictions": ["Oliphant", "Gaskell", "Eliot", "Trollope", "Collins",
                        "Geraldine_Jewsbury", "Hardy", "Dickens", "Brontë", "Kingsley"]
    },
]

def hits_at_k(predictions, correct, k):
    return correct in predictions[:k]

for k in [1, 3, 5]:
    hit_count = 0
    for query in queries:
        if hits_at_k(query["predictions"], query["correct"], k):
            hit_count += 1
    score = hit_count / len(queries)
    print(f"Hits@{k}: {score:.2f}  ({hit_count}/{len(queries)} queries)")

print()

print("Late recoveries (missed Top 5, found in Top 10):")
for query in queries:
    missed_5 = not hits_at_k(query["predictions"], query["correct"], 5)
    found_10 = hits_at_k(query["predictions"], query["correct"], 10)
    if missed_5 and found_10:
        rank = query["predictions"].index(query["correct"]) + 1
        print(f"  '{query['question']}' — correct answer ranked #{rank}")

print()

print("Jewsbury appears in the model's predictions but is ranked #6, not Top 5, because: the archive contains fewer documents connecting her name to her works than it does for Eliot or Gaskell")
print("This matters for DH research because: a researcher using Hits@5 as their threshold would never be directed to her, even though the model has enough evidence to place her at #6")
```