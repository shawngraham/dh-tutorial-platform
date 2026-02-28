---
id: network-analysis-01
title: Introduction to Network Concepts
moduleId: network-analysis
prerequisites:
  - structured-data-05
estimatedTimeMinutes: 10
difficulty: beginner
learningObjectives:
  - Define nodes and edges in the context of humanities data
  - Distinguish between directed and undirected graphs
  - Understand "Edge Weights" as a measure of relationship strength
  - Identify use cases for network analysis in history and literature
keywords:
  - graph theory
  - nodes
  - edges
  - directed graph
  - network analysis
  - republic of letters
---

# Introduction to Network Concepts

  ## Analogy: The Whiteboard of Relationships
  Imagine a pile of letters found in an archive. If you read them one by one, you learn about individual lives. However, if you draw a line on a whiteboard connecting the sender of every letter to its recipient, you create a "web" that reveals something invisible in the individual texts: **a community structure**. 

  You might find that a seemingly quiet figure is actually the central hub connecting two rival political groups. This "web" is a **network** (or graph), and the whiteboard drawing is the essence of **Network Analysis**.

  ---

  ## 1. Nodes and Edges
  Network analysis (or Graph Theory) requires us to simplify complex humanities data into two specific components:

  :::definition
  **Node (or Vertex)**: The "things" in the network. In the humanities, these are often people (authors, historical figures), but they can also be places, books, or even abstract concepts like "keywords."
  :::

  :::definition
  **Edge (or Link)**: The relationship connecting two nodes. This represents the "action" or "connection," such as "wrote a letter to," "is related to," or "appeared in the same scene as."
  :::

  ---

  ## 2. Types of Graph Logic
  When modeling your research data, you must decide how your edges behave:

  1.  **Undirected Graph**: Relationships are mutual.
      *   *Example*: Two characters appear in the same scene. If A is with B, B is necessarily with A.
  2.  **Directed Graph**: Relationships flow in a specific direction.
      *   *Example*: Citations. Book A cites Book B, but Book B does not necessarily cite Book A.
  3.  **Weighted Graph**: The connection has a "strength" or "frequency."
      *   *Example*: If Ada sends Charles one letter, the edge weight is 1. If she sends him 50 letters, the edge weight is 50.

  ---

  ## 3. Representing Networks in Python
  The simplest way to store a network in Python is an **Edge List**. This is a list of tuples, where each tuple represents a connection between two nodes.

  ```python
  # A list of co-occurrence (Undirected)
  # Romeo appears with Juliet, Juliet appears with Nurse
  interactions = [
      ("Romeo", "Juliet"),
      ("Juliet", "Nurse")
  ]

  # Accessing the participants of the first interaction
  print(f"{interactions[0][0]} connected to {interactions[0][1]}")
  ```

  ---

  ## 4. Why Use This in DH?
  We use network analysis to move from "Close Reading" (analyzing one text) to **"Distant Reading"** of systems.
  *   **History (The Republic of Letters)**: Mapping the vast exchange of letters between Enlightenment thinkers to see how ideas traveled across borders.
  *   **Literature**: Analyzing character networks in plays to identify the protagonist based on "centrality" rather than word count.

  :::tip
  **Modeling Tip**: Before you start coding, always ask: "What is a node in my project?" and "What constitutes an edge?" If you can't define these clearly, your network will be "hairball" of data that is impossible to interpret.
  :::

  :::challenge
  Model a small correspondence network using Python tuples. You will create a directed "Edge List" where the first name is the Sender and the second is the Recipient.
  :::

---challenges---

### Challenge: Building a Weighted Correspondence Network

- id: network-analysis-01-c1
- language: python
- difficulty: beginner

#### Starter Code
```python
# A historian has transcribed the following letters from an archive.
# Each entry is (Sender, Recipient). Some pairs wrote to each other repeatedly.

raw_letters = [
    ("Voltaire",   "Rousseau"),
    ("Rousseau",   "Hume"),
    ("Voltaire",   "Rousseau"),
    ("Hume",       "Voltaire"),
    ("Rousseau",   "Hume"),
    ("Voltaire",   "Hume"),
    ("Hume",       "Rousseau"),
    ("Voltaire",   "Rousseau"),
]

# Step 1: Build a DIRECTED edge list with weights.
# Loop through raw_letters. For each (sender, recipient) pair,
# count how many times that exact directed edge appears.
# Store results in a dictionary: edge_weights[(sender, recipient)] = count

edge_weights = {}
for sender, recipient in raw_letters:
    # Your code here
    pass

print("Weighted directed edges:")
for edge, weight in edge_weights.items():
    print(f"  {edge[0]} -> {edge[1]}: {weight}")

print()

# Step 2: Identify the most active correspondent — the sender who wrote
# the most letters in total across all their edges.
# Store the result as (name, total_letters_sent).
sender_totals = {}
for (sender, recipient), weight in edge_weights.items():
    # Your code here
    pass

top_sender = max(sender_totals, key=lambda x: sender_totals[x])
print(f"Most active sender: {top_sender} ({sender_totals[top_sender]} letters)")

print()

# Step 3: Directed vs. Undirected — reflect on the data.
# Check whether any pair wrote to EACH OTHER (i.e. both (A->B) and (B->A) exist).
# Print: "<A> and <B> exchanged letters" for each mutual pair.
# Avoid printing the same pair twice.
print("Mutual correspondences:")
reported = []
for (sender, recipient) in edge_weights:
    reverse = (recipient, sender)
    if reverse in edge_weights and (recipient, sender) not in reported:
        print(f"  {sender} and {recipient} exchanged letters")
        reported.append((sender, recipient))

print()

# Step 4: Reflect on modeling choices.
# If you modeled this as an UNDIRECTED graph instead, what information would you lose?
# Make a note in your research notebook.
```

#### Expected Output
```
Weighted directed edges:
  Voltaire -> Rousseau: 3
  Rousseau -> Hume: 2
  Hume -> Voltaire: 1
  Voltaire -> Hume: 1
  Hume -> Rousseau: 1

Most active sender: Voltaire (4 letters)

Mutual correspondences:
  Rousseau and Hume exchanged letters
  Hume and Voltaire exchanged letters
```

#### Hints

1. For Step 1, use `edge_weights[edge] = edge_weights.get(edge, 0) + 1` where `edge = (sender, recipient)`.
2. For Step 2, loop through `edge_weights.items()`. For each `(sender, recipient)` key, add its weight to `sender_totals[sender]` using the same `.get()` pattern.
3. For Step 3, check `if (recipient, sender) in edge_weights` — this tells you the reverse edge exists. The `reported` list prevents printing "A and B" and then "B and A".
4. For Step 4, look at the Voltaire → Rousseau edge. Rousseau never wrote back. Would an undirected graph show you that asymmetry?

#### Solution
```python
raw_letters = [
    ("Voltaire",   "Rousseau"),
    ("Rousseau",   "Hume"),
    ("Voltaire",   "Rousseau"),
    ("Hume",       "Voltaire"),
    ("Rousseau",   "Hume"),
    ("Voltaire",   "Hume"),
    ("Hume",       "Rousseau"),
    ("Voltaire",   "Rousseau"),
]

# Step 1
edge_weights = {}
for sender, recipient in raw_letters:
    edge = (sender, recipient)
    edge_weights[edge] = edge_weights.get(edge, 0) + 1

print("Weighted directed edges:")
for edge, weight in edge_weights.items():
    print(f"  {edge[0]} -> {edge[1]}: {weight}")

print()

# Step 2
sender_totals = {}
for (sender, recipient), weight in edge_weights.items():
    sender_totals[sender] = sender_totals.get(sender, 0) + weight

top_sender = max(sender_totals, key=lambda x: sender_totals[x])
print(f"Most active sender: {top_sender} ({sender_totals[top_sender]} letters)")

print()

# Step 3
print("Mutual correspondences:")
reported = []
for (sender, recipient) in edge_weights:
    reverse = (recipient, sender)
    if reverse in edge_weights and (recipient, sender) not in reported:
        print(f"  {sender} and {recipient} exchanged letters")
        reported.append((sender, recipient))

print()
```