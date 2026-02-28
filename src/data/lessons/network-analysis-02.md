---
id: network-analysis-02
title: Creating Networks with NetworkX
moduleId: network-analysis
prerequisites:
  - network-analysis-01
estimatedTimeMinutes: 10
difficulty: beginner
learningObjectives:
  - Import and initialize the NetworkX library
  - Differentiate between Graph (undirected) and DiGraph (directed) objects
  - Programmatically add nodes and edges to a network
  - Bulk-load network data from Python lists
keywords:
  - networkx
  - add_node
  - add_edge
  - graph construction
  - digraph
---

# Creating Networks with NetworkX

  ## Analogy: Napkin vs. Database
  In the previous lesson, we represented connections as simple lists of tuples. That’s like scribbling phone numbers on a napkin. To perform serious research, you need a tool that can search, sort, and calculate complex statistics across those connections. 

  In Python, that tool is **NetworkX**. It transforms your list of names into a "Graph Object"—a mathematical structure that knows how every piece of the web is connected to every other piece.

  ---

  ## 1. Initializing the Graph
  NetworkX offers different "containers" depending on the logic of your data.

  - **`nx.Graph()`**: For **Undirected** relationships (e.g., "A and B were in the same room").
  - **`nx.DiGraph()`**: For **Directed** relationships (e.g., "A sent a letter to B").

  ```python
  import networkx as nx

  # Create a container for a social network
  G = nx.Graph()
  ```

  ---

  ## 2. Constructing the Web
  You can build a network node-by-node, but in Digital Humanities, we usually load data in "bulk" from lists or spreadsheets.

  ### Adding Nodes (The Participants)
  ```python
  G.add_node("Mary Shelley")
  G.add_nodes_from(["Percy Shelley", "Lord Byron"])
  ```

  ### Adding Edges (The Connections)
  If you add an edge between two names that don't exist yet, NetworkX is smart enough to create the nodes for you automatically.
  ```python
  # This creates the nodes AND the connection
  G.add_edge("Mary Shelley", "Percy Shelley")

  # Adding multiple connections at once
  connections = [("Mary Shelley", "Lord Byron"), ("Percy Shelley", "Lord Byron")]
  G.add_edges_from(connections)
  ```

  ---

  ## 3. Inspecting the Graph
  Once the graph is built, you can "query" it to see the scale of your network.

  ```python
  print(f"Number of people: {G.number_of_nodes()}")
  print(f"Number of connections: {G.number_of_edges()}")

  # View all nodes as a list
  print(list(G.nodes))
  ```

  ---

  ## 4. Why Use This? (The DH Use Case)
  If you are analyzing a 19th-century novel, you wouldn't manually type every character's name. You would write a loop that reads your text and calls `G.add_edge()` whenever two characters appear in the same paragraph. NetworkX will then handle the complex math of determining who the "most important" character is based on their position in the web.

  :::tip
  **Bulk Loading**: The `add_edges_from()` method is your best friend. It allows you to take a list of thousands of tuples (like the ones we made in the last lesson) and turn them into a network in a single line of code.
  :::

  :::challenge
  What kind of graph models the data correctly?
  :::

---challenges---

### Challenge: Build and Query a Correspondence Network

- id: network-analysis-02-c1
- language: python
- difficulty: beginner

#### Starter Code
```python
import networkx as nx

# Archive data: letters exchanged among Enlightenment figures.
# Each tuple is (Sender, Recipient, number_of_letters).
correspondence = [
    ("Voltaire",  "Rousseau",   3),
    ("Rousseau",  "Hume",       2),
    ("Hume",      "Voltaire",   1),
    ("Voltaire",  "Hume",       1),
    ("Hume",      "Rousseau",   1),
    ("d'Alembert","Voltaire",   4),
    ("Voltaire",  "d'Alembert", 5),
    ("d'Alembert","Rousseau",   1),
    ("Rousseau",  "d'Alembert", 1),
]

# Step 1: Should this network be a Graph or a DiGraph?
# "Voltaire wrote to Rousseau" is NOT the same as
# "Rousseau wrote to Voltaire" — direction matters here.
# Initialize the correct graph type as `G`.
G = # Your code here

# Step 2: Bulk-load the correspondence data into G.
# Each tuple has THREE values: (sender, recipient, weight).
# NetworkX's add_edges_from() accepts tuples of
# (node_a, node_b, {attribute_dict}) — but it also accepts
# plain (node_a, node_b) tuples if you strip the weight first.
#
# Loop through correspondence and add each edge WITH its weight:
#   G.add_edge(sender, recipient, weight=count)
for sender, recipient, count in correspondence:
    # Your code here
    pass

print(f"Nodes: {G.number_of_nodes()}")   # Expected: 4
print(f"Edges: {G.number_of_edges()}")   # Expected: 9

# Step 3: Query the network to answer research questions.

# 3a: How many letters did Voltaire send in total?
# In a DiGraph, G.out_edges(node, data=True) returns all edges
# leaving that node, with their attributes.
voltaire_sent = sum(data["weight"] for _, _, data in G.out_edges("Voltaire", data=True))
print(f"Letters sent by Voltaire: {voltaire_sent}")   # Expected: 9

# 3b: Did Rousseau EVER write back to Voltaire?
# Check whether the directed edge (Rousseau -> Voltaire) exists.
wrote_back = # Your code here — one line using G.has_edge()
print(f"Rousseau wrote back to Voltaire: {wrote_back}")   # Expected: False

# 3c: Find the most prolific sender overall.
# Loop through all nodes, sum their outgoing edge weights,
# and track who sent the most letters.
most_prolific = ""
most_letters  = 0
for node in G.nodes:
    total = sum(data["weight"] for _, _, data in G.out_edges(node, data=True))
    if total > most_letters:
        most_letters  = total
        most_prolific = node

print(f"Most prolific sender: {most_prolific} ({most_letters} letters)")   # Expected: d'Alembert (... wait — check your totals)

# Step 4: Reflect on the modeling choice you made in Step 1.
# If you had used an undirected Graph instead, what would
# G.has_edge("Rousseau", "Voltaire") have returned, and why
# would that have been misleading for this research question?
# Make a note in your research notebook.
```

#### Expected Output
```
Nodes: 4
Edges: 9
Letters sent by Voltaire: 9
Rousseau wrote back to Voltaire: False
Most prolific sender: Voltaire (9 letters)
```

#### Hints

1. Because direction matters (sender ≠ recipient), use `nx.DiGraph()`.
2. For Step 2, `G.add_edge(sender, recipient, weight=count)` stores the letter count as an edge attribute you can retrieve later.
3. For Step 3b, `G.has_edge("Rousseau", "Voltaire")` checks for that exact directed edge — in a DiGraph, `has_edge(A, B)` and `has_edge(B, A)` are independent questions.
4. For Step 3c, `G.out_edges(node, data=True)` yields `(source, target, attribute_dict)` triples — unpack as `_, _, data` and access `data["weight"]`.

#### Solution
```python
import networkx as nx

correspondence = [
    ("Voltaire",   "Rousseau",   3),
    ("Rousseau",   "Hume",       2),
    ("Hume",       "Voltaire",   1),
    ("Voltaire",   "Hume",       1),
    ("Hume",       "Rousseau",   1),
    ("d'Alembert", "Voltaire",   4),
    ("Voltaire",   "d'Alembert", 5),
    ("d'Alembert", "Rousseau",   1),
    ("Rousseau",   "d'Alembert", 1),
]

# Step 1: DiGraph — direction matters
G = nx.DiGraph()

# Step 2: Bulk load with weights
for sender, recipient, count in correspondence:
    G.add_edge(sender, recipient, weight=count)

print(f"Nodes: {G.number_of_nodes()}")
print(f"Edges: {G.number_of_edges()}")

# Step 3a
voltaire_sent = sum(data["weight"] for _, _, data in G.out_edges("Voltaire", data=True))
print(f"Letters sent by Voltaire: {voltaire_sent}")

# Step 3b
wrote_back = G.has_edge("Rousseau", "Voltaire")
print(f"Rousseau wrote back to Voltaire: {wrote_back}")

# Step 3c
most_prolific = ""
most_letters  = 0
for node in G.nodes:
    total = sum(data["weight"] for _, _, data in G.out_edges(node, data=True))
    if total > most_letters:
        most_letters  = total
        most_prolific = node

print(f"Most prolific sender: {most_prolific} ({most_letters} letters)")
```

