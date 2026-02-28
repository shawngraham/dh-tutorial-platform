---
id: rel-mod-02
title: Linking Facts with Knowledge Graph Embedding Models
moduleId: relational-models
prerequisites:
  - rel-mod-01
estimatedTimeMinutes: 10
difficulty: beginner
learningObjectives:
  - Define the structure of a "Triple" (Head-Relation-Tail)
  - Understand how Knowledge Graph Embeddings (KGE) model structured relationships
  - Identify potential gaps in historical linked data
keywords:
  - knowledge-graphs
  - pykeen
  - linked-data
  - triples
---

# Linking Facts with Knowledge Graph Embedding Models

## Analogy: From Clouds to Constellations

In the previous lesson, we saw that **Word Vectors** are like a cloud of stars: we know which stars are near each other, but we don't necessarily know *why*.

A **Knowledge Graph** (also know as a relational model) is a constellation. It doesn't just put stars in a space; it draws explicit lines between them and labels those lines. It tells us that Star A is "connected to" Star B by a specific relationship, like "is-the-parent-of" or "was-written-by."

## Key Concepts

### 1. The Triple
While word vectors learn from messy, unstructured sentences, **Knowledge Graph Embeddings (KGE)** learn from structured facts called **Triples**. A triple is the smallest unit of information in a graph.

:::definition
**Triple**: A statement consisting of three parts:
1.  **Head** (Subject): The starting entity.
2.  **Relation** (Predicate): The link or verb.
3.  **Tail** (Object): The ending entity.
:::

In Python, we can represent a single fact using a simple list.

```python
# Representing a triple: [Head, Relation, Tail]
triple = ["Jane_Austen", "author_of", "Persuasion"]

print(f"Entity 1: {triple[0]}")
print(f"Relationship: {triple[1]}")
print(f"Entity 2: {triple[2]}")
```

### 2. PyKEEN and Predictive History
**PyKEEN** is a Python library used to train models on these triples. Once a model understands the "geometry" of your graph, it can predict missing links.

If the graph knows that *Person A* was born in *City B*, and *City B* is in *Country C*, PyKEEN helps the computer mathematically "guess" that *Person A* is a citizen of *Country C*. 

```python
# A Knowledge Graph is just a collection of these triples
knowledge_graph = [
    ["London", "located_in", "United_Kingdom"],
    ["Charles_Dickens", "born_in", "Landport"],
    ["Landport", "located_in", "United_Kingdom"]
]

print(f"Our graph contains {len(knowledge_graph)} facts.")
```

## Practice: Navigating the List

When we store triples in a list, we use **indexes** to access the different parts:
*   `triple[0]` is the **Head**
*   `triple[1]` is the **Relation**
*   `triple[2]` is the **Tail**

:::try-it
In the sandbox, try to print just the **Relation** from this historical triple.

```python
fact = ["Rosalind_Franklin", "discovered", "DNA_Structure"]

# Access index 1 to get the relation
print(fact[1]) 
```
:::

## Transfer: The Silence of the Archive

Knowledge Graphs are powerful, but they are only as good as their data. If an archive primarily records the letters of "Great Men," a Knowledge Graph will visualize women and marginalized groups as **"Isolated Nodes"**—stars with no lines connecting them to the rest of the constellation. 

When you build a graph, ask: *Who is missing a connection, and why?*

:::challenge
Examine the knowledge graph for its silences.
:::

---challenges---

### Challenge: Querying and Auditing a Knowledge Graph

- id: rel-mod-02-c1
- language: python
- difficulty: beginner

#### Starter Code
```python
# A knowledge graph of 19th-century literary figures and locations
archive = [
    ["Mary_Shelley",     "author_of",    "Frankenstein"],
    ["Jane_Austen",      "author_of",    "Emma"],
    ["Jane_Austen",      "born_in",      "Steventon"],
    ["Charles_Dickens",  "author_of",    "Oliver_Twist"],
    ["Charles_Dickens",  "born_in",      "Landport"],
    ["George_Eliot",     "author_of",    "Middlemarch"],
    ["Steventon",        "located_in",   "England"],
    ["Landport",         "located_in",   "England"],
]

# Step 1: Collect every unique relation type in the graph.
# Loop through archive; append triple[1] only if not already in the list.
relation_types = []
# Your code here

print("Relation types:", relation_types)

# Step 2: For every "author_of" triple, print: "<author> wrote <work>"
# Your code here

print()

# Step 3: Find all entities that appear ONLY as a Head or Tail in "author_of"
# triples and NEVER as a Head in a "born_in" triple.
# These are "isolated nodes" — entities the graph knows something about
# but whose biographical context is missing.
#
# a. Collect all entities that appear as Head in a "born_in" triple
has_birthplace = []
# Your code here

# b. Collect all entities that appear as Head in an "author_of" triple
is_author = []
# Your code here

# c. An isolated node is an author with no birthplace recorded.
# Print: "Missing birthplace: <name>" for each one.
print("Archive gaps:")
# Your code here
```

#### Expected Output
```
Relation types: ['author_of', 'born_in', 'located_in']
Mary_Shelley wrote Frankenstein
Jane_Austen wrote Emma
Charles_Dickens wrote Oliver_Twist
George_Eliot wrote Middlemarch

Archive gaps:
Missing birthplace: Mary_Shelley
Missing birthplace: George_Eliot
```

#### Hints

1. For Step 1, use `if triple[1] not in relation_types:` before appending.
2. For Step 3a and 3b, the pattern is the same as Step 1 — loop through `archive`, check `triple[1]`, and append `triple[0]` to the right list if it isn't already there.
3. For Step 3c, loop through `is_author` and check `if name not in has_birthplace:`.
4. Think about what it means for a scholar that Mary Shelley appears in this graph only as "someone who wrote something." What can't you ask the graph about her?

#### Solution
```python
archive = [
    ["Mary_Shelley",     "author_of",    "Frankenstein"],
    ["Jane_Austen",      "author_of",    "Emma"],
    ["Jane_Austen",      "born_in",      "Steventon"],
    ["Charles_Dickens",  "author_of",    "Oliver_Twist"],
    ["Charles_Dickens",  "born_in",      "Landport"],
    ["George_Eliot",     "author_of",    "Middlemarch"],
    ["Steventon",        "located_in",   "England"],
    ["Landport",         "located_in",   "England"],
]

# Step 1
relation_types = []
for triple in archive:
    if triple[1] not in relation_types:
        relation_types.append(triple[1])
print("Relation types:", relation_types)

# Step 2
for triple in archive:
    if triple[1] == "author_of":
        print(f"{triple[0]} wrote {triple[2]}")

print()

# Step 3a
has_birthplace = []
for triple in archive:
    if triple[1] == "born_in" and triple[0] not in has_birthplace:
        has_birthplace.append(triple[0])

# Step 3b
is_author = []
for triple in archive:
    if triple[1] == "author_of" and triple[0] not in is_author:
        is_author.append(triple[0])

# Step 3c
print("Archive gaps:")
for name in is_author:
    if name not in has_birthplace:
        print(f"Missing birthplace: {name}")
```

