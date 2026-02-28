---
id: network-analysis-04
title: Visualizing Networks
moduleId: network-analysis
prerequisites:
  - network-analysis-03
estimatedTimeMinutes: 10
difficulty: beginner
learningObjectives:
  - Create visual plots of graphs using the NetworkX and Matplotlib
  - Understand the role of force-directed layout algorithms (Spring Layout)
  - Map node attributes (like centrality) to visual properties (like size)
  - Identify strategies to avoid the "Hairball" problem in large visualizations
keywords:
  - visualization
  - nx.draw
  - spring_layout
  - matplotlib
  - aesthetics
---

# Visualizing Networks: Mapping the Web

  ## Analogy: The Mapmaker's Choice
  A list of numbers (centrality scores) is useful, but a visual map is often more intuitive. Just as a mapmaker must decide whether to put North at the top or how to flatten the globe onto a 2D page, a network scientist must decide how to arrange nodes on the screen. 

  This arrangement is called the **Layout**. Because a graph has no inherent "shape" in the real world, the shape we give it is a choice we make to highlight specific patterns.

  ---

  ## 1. Basic Drawing
  NetworkX uses **Matplotlib** as its drawing engine. The simplest way to see your network is using `nx.draw()`.

  ```python
  import networkx as nx
  import matplotlib.pyplot as plt

  # Create a simple triangle
  G = nx.complete_graph(3)

  # Draw it with labels
  nx.draw(G, with_labels=True)
  plt.show()
  ```

  ---

  ## 2. Layout Algorithms
  Algorithms determine the X and Y coordinates of your nodes.

  - **Spring Layout**: The "gold standard" for DH. It treats edges like springs and nodes like magnets. Connected nodes pull together; disconnected nodes push apart. This naturally reveals **communities** and clusters.
  - **Circular Layout**: Arranges everyone in a perfect circle. This is great for showing the sheer density of connections without favoring any specific node's position.

  ```python
  # Calculate positions as a dictionary of coordinates
  pos = nx.spring_layout(G)

  # Pass those positions to the drawing function
  nx.draw(G, pos=pos, node_color='skyblue', edge_color='gray')
  ```

  ---

  ## 3. Mapping Data to Aesthetics
  The real power of visualization comes from **data-driven design**. You can make a node's size represent its **Centrality** or its color represent its **Category** (e.g., blue for poets, red for novelists).

  ```python
  # Example: Making nodes larger based on a list of sizes
  node_sizes = [100, 500, 1000] 
  nx.draw(G, node_size=node_sizes)
  ```

  ---

  ## 4. The "Hairball" Problem
  In Digital Humanities, we often deal with large archives. If you try to visualize 5,000 nodes at once, you will get a "Hairball"—a messy black blob where no patterns are visible. 

  **Strategies to fix the Hairball:**
  1.  **Filter**: Only show the top 10% most connected nodes.
  2.  **Color**: Use color to separate different groups.
  3.  **Alpha**: Make edges transparent so they don't overlap into a solid mass.

  :::tip
  **EDA (Exploratory Data Analysis)**: Use visualization as a starting point, not just a final result. A spring layout might group characters together that you didn't realize were connected, prompting you to go back and "close-read" those specific chapters.
  :::

  :::challenge
  In this challenge, you will generate the layout coordinates for a small graph. Networkx, outside of this sandbox, has a 'draw' command to display the network. Here, we will use the underlying matplotlib code so you can see what's going on.
  :::

---challenges---

### Challenge: Plotting a Network with Matplotlib

- id: network-analysis-04-c1
- language: python
- difficulty: beginner

#### Starter Code
```python
import networkx as nx
import matplotlib.pyplot as plt
plt.clf() #to clear the canvas if necessary

G = nx.Graph()
G.add_edges_from([
    ("Voltaire",    "Rousseau"),
    ("Voltaire",    "d'Alembert"),
    ("Voltaire",    "Hume"),
    ("Voltaire",    "Diderot"),
    ("d'Alembert",  "Diderot"),
    ("Diderot",     "Holbach"),
    ("Hume",        "Rousseau"),
    ("Rousseau",    "Condillac"),
    ("Condillac",   "Turgot"),
])

# Step 1: Calculate spring layout positions.
# Returns {node_name: array([x, y])} for every node.
positions = nx.spring_layout(G, seed=42)

fig, ax = plt.subplots(figsize=(8, 6))

# Step 2: Draw the EDGES.
# Loop through G.edges(). For each (u, v) pair, look up both nodes'
# coordinates in `positions` and draw a line between them using ax.plot().
# Use color="gray", linewidth=1, alpha=0.5 for a clean look.
for u, v in G.edges():
    x0, y0 = positions[u]
    x1, y1 = positions[v]
    # Your code here
    pass

# Step 3: Draw the NODES.
# Extract all x-coordinates into a list `xs` and all y-coordinates into `ys`,
# following the order of G.nodes. Then call ax.scatter(xs, ys).
# Use s=300, c="steelblue", zorder=5 (zorder puts nodes on top of edges).
xs = [positions[node][0] for node in G.nodes()]
ys = # Your code here
# Your scatter call here

# Step 4: Add LABELS.
# Loop through positions.items() — each gives you (node_name, [x, y]).
# Use ax.text(x, y, node_name, fontsize=8, ha="center", va="bottom")
for node, (x, y) in positions.items():
    # Your code here
    pass

ax.set_title("Enlightenment Correspondence Network")
ax.axis("off")
plt.tight_layout()
plt.savefig("network.png", dpi=100)
print("Network saved to network.png")
print(f"Nodes drawn: {G.number_of_nodes()}")
print(f"Edges drawn: {G.number_of_edges()}")
plt.show()
```

#### Expected Output
```
Network saved to network.png
Nodes drawn: 9
Edges drawn: 9
```

#### Hints

1. For Step 2: `ax.plot([x0, x1], [y0, y1], color="gray", linewidth=1, alpha=0.5)` draws a line between two coordinate pairs.
2. For Step 3: `ys` follows the same pattern as `xs` — list comprehension over `G.nodes()`, accessing index `[1]` instead of `[0]`.
3. For Step 4: `positions.items()` yields `(name, array)` pairs — unpack the array directly as `(x, y)` in the loop.
4. `zorder=5` ensures nodes are drawn on top of edges — without it, edges can visually obscure the node dots.

#### Solution
```python
import networkx as nx
import matplotlib.pyplot as plt

plt.clf() #to clear the canvas if necessary

G = nx.Graph()
G.add_edges_from([
    ("Voltaire",    "Rousseau"),
    ("Voltaire",    "d'Alembert"),
    ("Voltaire",    "Hume"),
    ("Voltaire",    "Diderot"),
    ("d'Alembert",  "Diderot"),
    ("Diderot",     "Holbach"),
    ("Hume",        "Rousseau"),
    ("Rousseau",    "Condillac"),
    ("Condillac",   "Turgot"),
])

positions = nx.spring_layout(G, seed=42)

fig, ax = plt.subplots(figsize=(8, 6))

# Step 2: Edges
for u, v in G.edges():
    x0, y0 = positions[u]
    x1, y1 = positions[v]
    ax.plot([x0, x1], [y0, y1], color="gray", linewidth=1, alpha=0.5)

# Step 3: Nodes
xs = [positions[node][0] for node in G.nodes()]
ys = [positions[node][1] for node in G.nodes()]
ax.scatter(xs, ys, s=300, c="steelblue", zorder=5)

# Step 4: Labels
for node, (x, y) in positions.items():
    ax.text(x, y, node, fontsize=8, ha="center", va="bottom")

ax.set_title("Enlightenment Correspondence Network")
ax.axis("off")
plt.tight_layout()
plt.savefig("network.png", dpi=100)
print("Network saved to network.png")
print(f"Nodes drawn: {G.number_of_nodes()}")
print(f"Edges drawn: {G.number_of_edges()}")
plt.show()
```

### Challenge: Mapping Data to Visual Properties

- id: network-analysis-04-c2
- language: python
- difficulty: intermediate

#### Starter Code
```python
import networkx as nx
import matplotlib.pyplot as plt

plt.clf() #to clear the canvas if necessary

# Simulate a larger archive network: 20 figures, many connections
G = nx.Graph()
G.add_edges_from([
    ("Voltaire",    "Rousseau"),    ("Voltaire",   "d'Alembert"),
    ("Voltaire",    "Hume"),        ("Voltaire",   "Diderot"),
    ("Voltaire",    "Montesquieu"), ("d'Alembert", "Diderot"),
    ("d'Alembert",  "Hume"),        ("Diderot",    "Holbach"),
    ("Holbach",     "Hume"),        ("Hume",       "Rousseau"),
    ("Rousseau",    "Condillac"),   ("Condillac",  "Turgot"),
    ("Turgot",      "du_Chatelet"), ("du_Chatelet","Maupertuis"),
    ("Maupertuis",  "Euler"),       ("Euler",      "Bernoulli"),
    ("Bernoulli",   "Leibniz"),     ("Leibniz",    "Wolff"),
    ("Wolff",       "Baumgarten"),  ("Baumgarten", "Kant"),
    ("Kant",        "Herder"),      ("Herder",     "Goethe"),
    ("Goethe",      "Schiller"),    ("Schiller",   "Fichte"),
    ("Montesquieu", "Turgot"),      ("Turgot",     "Smith"),
    ("Smith",       "Hume"),        ("Smith",      "Kant"),
])

print(f"Full graph: {G.number_of_nodes()} nodes, {G.number_of_edges()} edges")
print("(Too large to read clearly — needs filtering)")
print()

# Step 1: Calculate degree centrality for all nodes.
degree_scores = nx.degree_centrality(G)

# Step 2: Find the top 8 nodes by degree centrality.
# Store just their names in a list called `top_nodes`.
top_nodes = []
# Your code here

print(f"Top 8 nodes: {top_nodes}")
print()

# Step 3: Build a filtered subgraph containing ONLY the top_nodes
# and the edges between them.
# Use G.subgraph(top_nodes) to extract it.
filtered = # Your code here

print(f"Filtered graph: {filtered.number_of_nodes()} nodes, "
      f"{filtered.number_of_edges()} edges")
print()

# Step 4: Verify the hairball fix worked — the filtered graph should
# have fewer than half the edges of the full graph.
reduction = 1 - (filtered.number_of_edges() / G.number_of_edges())
print(f"Edge reduction: {reduction:.0%}")
print(f"Hairball tamed: {filtered.number_of_edges() < G.number_of_edges() / 2}")

print()

# Step 5: Reflect — what is the cost of this filtering strategy?
# Complete this sentence:
print("By keeping only the top 8 nodes, we risk missing: ___")

nx.draw(filtered) # Here, one line draws our network!
plt.show() # to show the network that has been drawn
```

#### Expected Output
```
Full graph: 20 nodes, 28 edges

Top 8 nodes: ['Voltaire', 'Hume', 'Turgot', 'd'Alembert', 'Diderot', 'Rousseau', 'Smith', 'Montesquieu']

Filtered graph: 8 nodes, 9 edges

Edge reduction: 68%
Hairball tamed: True

By keeping only the top 8 nodes, we risk missing: low-degree figures like du_Chatelet or Kant who may be historically significant but are underrepresented in this particular archive
```

#### Hints

1. For Step 2, sort `degree_scores.items()` by value descending, slice to `[:8]`, and extract just the names: `[name for name, _ in ...]`.
2. `G.subgraph(top_nodes)` returns a *view* of G containing only those nodes and any edges that run between them — NetworkX automatically excludes edges to nodes outside the list.
3. For Step 5, think about which figures land *just outside* the top 8 and whether their absence from the visualisation is neutral or misleading.

#### Solution
```python
import networkx as nx
import matplotlib.pyplot as plt

plt.clf() #to clear the canvas if necessary


G = nx.Graph()
G.add_edges_from([
    ("Voltaire",    "Rousseau"),    ("Voltaire",   "d'Alembert"),
    ("Voltaire",    "Hume"),        ("Voltaire",   "Diderot"),
    ("Voltaire",    "Montesquieu"), ("d'Alembert", "Diderot"),
    ("d'Alembert",  "Hume"),        ("Diderot",    "Holbach"),
    ("Holbach",     "Hume"),        ("Hume",       "Rousseau"),
    ("Rousseau",    "Condillac"),   ("Condillac",  "Turgot"),
    ("Turgot",      "du_Chatelet"), ("du_Chatelet","Maupertuis"),
    ("Maupertuis",  "Euler"),       ("Euler",      "Bernoulli"),
    ("Bernoulli",   "Leibniz"),     ("Leibniz",    "Wolff"),
    ("Wolff",       "Baumgarten"),  ("Baumgarten", "Kant"),
    ("Kant",        "Herder"),      ("Herder",     "Goethe"),
    ("Goethe",      "Schiller"),    ("Schiller",   "Fichte"),
    ("Montesquieu", "Turgot"),      ("Turgot",     "Smith"),
    ("Smith",       "Hume"),        ("Smith",      "Kant"),
])

print(f"Full graph: {G.number_of_nodes()} nodes, {G.number_of_edges()} edges")
print("(Too large to read clearly — needs filtering)")
print()

degree_scores = nx.degree_centrality(G)

top_nodes = [name for name, _ in
             sorted(degree_scores.items(), key=lambda x: x[1], reverse=True)[:8]]

print(f"Top 8 nodes: {top_nodes}")
print()

filtered = G.subgraph(top_nodes)

print(f"Filtered graph: {filtered.number_of_nodes()} nodes, "
      f"{filtered.number_of_edges()} edges")
print()

reduction = 1 - (filtered.number_of_edges() / G.number_of_edges())
print(f"Edge reduction: {reduction:.0%}")
print(f"Hairball tamed: {filtered.number_of_edges() < G.number_of_edges() / 2}")

print()
print("By keeping only the top 8 nodes, we risk missing: low-degree figures like du_Chatelet or Kant who may be historically significant but are underrepresented in this particular archive")
nx.draw(filtered)
plt.show()
```