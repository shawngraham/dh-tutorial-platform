---
id: network-analysis-05
title: 'Case Study: Character Networks'
moduleId: network-analysis
prerequisites:
  - network-analysis-03
estimatedTimeMinutes: 10
difficulty: intermediate
learningObjectives:
  - Process raw interaction lists into a NetworkX Graph object
  - Use Degree Centrality to mathematically identify a protagonist
  - Use Betweenness Centrality to identify "bridge" characters or gatekeepers
  - Apply the max() function with a key argument to extract top results from dictionaries
keywords:
  - case study
  - data cleaning
  - applied analysis
  - character networks
  - protagonist
---

# Case Study: Character Networks

  ## The Digital Detective
  We are now ready to play the role of digital detectives. Imagine you have found the playbill for a lost play in an archive. Whoever had this playbill took the time to mark every time two characters spoke to each other, and the nature of the scene. 

  By modeling this as a network, we can determine the "social structure" of the play. Who is the true protagonist? Who is the "broker" who connects the palace scenes to the street scenes? Network analysis allows us to answer these questions using math rather than intuition.

  ---

  ## 1. The DH Workflow
  A typical Network Analysis project follows these four steps:
  1.  **Ingestion**: Loading raw data (like a list of dialogue interactions).
  2.  **Modeling**: Deciding if the graph is Directed (who spoke first?) or Undirected (they both spoke).
  3.  **Analysis**: Running metrics like Centrality.
  4.  **Interpretation**: Turning those numbers back into a humanistic argument.

  ---

  ## 2. Extracting the "Winner"
  Centrality functions in NetworkX return a dictionary: `{"Hamlet": 0.8, "Ophelia": 0.4}`. To find the "most important" character, we need to find the **Key** with the **Maximum Value**.

  Python has a very efficient way to do this using the `max()` function:

  ```python
  centrality = {"Hero": 10, "Villain": 8, "Sidekick": 5}

  # Find the key (name) that has the highest value (score)
  winner = max(centrality, key=centrality.get)
  print(winner) # Output: Hero
  ```

  ---

  ## 3. Handling Redundant Data
  In raw humanities data, you often see the same interaction recorded twice (e.g., "Hamlet speaks to Horatio" and later "Horatio speaks to Hamlet"). 

  If you use an **Undirected Graph** (`nx.Graph()`), NetworkX automatically handles this. It treats an edge between A and B as the same thing as an edge between B and A. It won't create two separate lines, which keeps your centrality scores accurate.

  :::tip
  **Beyond Literature**: This same workflow applies to **Citation Networks** (which scholar is the hub of a field?) and **Metadata Analysis** (which subjects are most frequently grouped together in a library catalog?).
  :::

  :::challenge
  In Challenge 1, you will find the "Protagonist" (the Hub) of a small play. In Challenge 2, you will identify the "Broker"—the character who connects two otherwise isolated communities.
  :::

---challenges---

### Challenge: Ingesting the Playbill

- id: network-analysis-05-c1
- language: python
- difficulty: intermediate

#### Starter Code
```python
import networkx as nx

# A researcher has transcribed every scene from a production of Hamlet,
# recording which characters shared the stage. The same pair may appear
# multiple times across different scenes.
raw_interactions = [
    ("Hamlet",   "Horatio"),   ("Hamlet",   "Claudius"),
    ("Hamlet",   "Gertrude"),  ("Hamlet",   "Ophelia"),
    ("Hamlet",   "Polonius"),  ("Hamlet",   "Ghost"),
    ("Hamlet",   "Laertes"),   ("Hamlet",   "Horatio"),
    ("Hamlet",   "Rosencrantz"),("Hamlet",  "Guildenstern"),
    ("Claudius", "Gertrude"),  ("Claudius", "Polonius"),
    ("Claudius", "Laertes"),   ("Claudius", "Horatio"),
    ("Claudius", "Rosencrantz"),("Claudius","Guildenstern"),
    ("Polonius", "Ophelia"),   ("Polonius", "Laertes"),
    ("Polonius", "Gertrude"),  ("Horatio",  "Ghost"),
    ("Horatio",  "Laertes"),   ("Ophelia",  "Laertes"),
    ("Ophelia",  "Gertrude"),  ("Rosencrantz","Guildenstern"),
    ("Hamlet",   "Horatio"),   ("Hamlet",   "Claudius"),  # duplicates
    ("Claudius", "Gertrude"),  ("Polonius", "Claudius"),  # from multiple scenes
]

# Step 1: Should this be a Graph or DiGraph?
# Two characters sharing a scene is a mutual relationship — neither
# "initiates" the scene. Initialize the correct type as G.
G = # Your code here

# Step 2: Bulk-load raw_interactions.
# Notice it contains duplicates — the same pair appears in multiple scenes.
# Print a note on whether this matters for an undirected graph.
G.add_edges_from(raw_interactions)

print(f"Nodes (characters): {G.number_of_nodes()}")
print(f"Edges (unique pairs): {G.number_of_edges()}")

# Step 3: Verify NetworkX deduplicated the repeated pairs automatically.
# How many times does ("Hamlet", "Horatio") appear in raw_interactions?
raw_count = sum(1 for u, v in raw_interactions if
                (u == "Hamlet" and v == "Horatio") or
                (u == "Horatio" and v == "Hamlet"))
print(f"'Hamlet-Horatio' appears {raw_count}x in raw data, "
      f"but {1 if G.has_edge('Hamlet','Horatio') else 0}x in graph")
print("Deduplication handled automatically:", raw_count > 1 and G.has_edge("Hamlet","Horatio"))
```

#### Expected Output
```
Nodes (characters): 10
Edges (unique pairs): 17
'Hamlet-Horatio' appears 3x in raw data, but 1x in graph
Deduplication handled automatically: True
```

#### Hints

1. Scene co-presence is symmetric — use `nx.Graph()`, not `nx.DiGraph()`.
2. `add_edges_from()` on an undirected graph silently ignores duplicate edges, treating `(A,B)` and `(B,A)` as the same connection.
3. For Step 3, your list comprehension should check both orderings of the pair since the raw data could list them either way.

#### Solution
```python
import networkx as nx

raw_interactions = [
    ("Hamlet",   "Horatio"),   ("Hamlet",   "Claudius"),
    ("Hamlet",   "Gertrude"),  ("Hamlet",   "Ophelia"),
    ("Hamlet",   "Polonius"),  ("Hamlet",   "Ghost"),
    ("Hamlet",   "Laertes"),   ("Hamlet",   "Horatio"),
    ("Hamlet",   "Rosencrantz"),("Hamlet",  "Guildenstern"),
    ("Claudius", "Gertrude"),  ("Claudius", "Polonius"),
    ("Claudius", "Laertes"),   ("Claudius", "Horatio"),
    ("Claudius", "Rosencrantz"),("Claudius","Guildenstern"),
    ("Polonius", "Ophelia"),   ("Polonius", "Laertes"),
    ("Polonius", "Gertrude"),  ("Horatio",  "Ghost"),
    ("Horatio",  "Laertes"),   ("Ophelia",  "Laertes"),
    ("Ophelia",  "Gertrude"),  ("Rosencrantz","Guildenstern"),
    ("Hamlet",   "Horatio"),   ("Hamlet",   "Claudius"),
    ("Claudius", "Gertrude"),  ("Polonius", "Claudius"),
]

G = nx.Graph()
G.add_edges_from(raw_interactions)

print(f"Nodes (characters): {G.number_of_nodes()}")
print(f"Edges (unique pairs): {G.number_of_edges()}")

raw_count = sum(1 for u, v in raw_interactions if
                (u == "Hamlet" and v == "Horatio") or
                (u == "Horatio" and v == "Hamlet"))
print(f"'Hamlet-Horatio' appears {raw_count}x in raw data, "
      f"but {1 if G.has_edge('Hamlet','Horatio') else 0}x in graph")
print("Deduplication handled automatically:", raw_count > 1 and G.has_edge("Hamlet","Horatio"))
```

---

### Challenge: Analysis and Visualization

- id: network-analysis-05-c2
- language: python
- difficulty: intermediate

#### Starter Code
```python
import networkx as nx
import matplotlib.pyplot as plt

plt.clf() #to clear the canvas if necessary

raw_interactions = [
    ("Hamlet",   "Horatio"),   ("Hamlet",   "Claudius"),
    ("Hamlet",   "Gertrude"),  ("Hamlet",   "Ophelia"),
    ("Hamlet",   "Polonius"),  ("Hamlet",   "Ghost"),
    ("Hamlet",   "Laertes"),   ("Hamlet",   "Horatio"),
    ("Hamlet",   "Rosencrantz"),("Hamlet",  "Guildenstern"),
    ("Claudius", "Gertrude"),  ("Claudius", "Polonius"),
    ("Claudius", "Laertes"),   ("Claudius", "Horatio"),
    ("Claudius", "Rosencrantz"),("Claudius","Guildenstern"),
    ("Polonius", "Ophelia"),   ("Polonius", "Laertes"),
    ("Polonius", "Gertrude"),  ("Horatio",  "Ghost"),
    ("Horatio",  "Laertes"),   ("Ophelia",  "Laertes"),
    ("Ophelia",  "Gertrude"),  ("Rosencrantz","Guildenstern"),
    ("Hamlet",   "Horatio"),   ("Hamlet",   "Claudius"),
    ("Claudius", "Gertrude"),  ("Polonius", "Claudius"),
]

G = nx.Graph()
G.add_edges_from(raw_interactions)

# Step 1: Calculate both centrality measures.
degree_scores      = nx.degree_centrality(G)
betweenness_scores = nx.betweenness_centrality(G)

# Step 2: Find the top character by EACH measure using max().
protagonist = max(degree_scores,      key=degree_scores.get)
broker      = max(betweenness_scores, key=betweenness_scores.get)

print(f"Protagonist (highest degree):      {protagonist} "
      f"({degree_scores[protagonist]:.3f})")
print(f"Broker (highest betweenness):      {broker} "
      f"({betweenness_scores[broker]:.3f})")
print()

# Step 3: Print the full degree ranking so we can see the hierarchy.
print("Full degree centrality ranking:")
for i, (name, score) in enumerate(
        sorted(degree_scores.items(), key=lambda x: x[1], reverse=True)):
    print(f"  {i+1}. {name}: {score:.3f}")
print()

# Step 4: Visualize — node size = degree centrality (scaled),
# draw with spring layout so clusters emerge naturally.
pos        = nx.spring_layout(G, seed=42)
node_sizes = [degree_scores[n] * 3000 for n in G.nodes()]

# Your drawing code here — use nx.draw() with:
#   pos=pos, node_size=node_sizes,
#   with_labels=True, font_size=8,
#   node_color="steelblue", edge_color="gray", alpha=0.8
# Then plt.title() and plt.show()
```

#### Expected Output
```
Protagonist (highest degree):      Hamlet (0.889)
Broker (highest betweenness):      Hamlet (0.468)

Full degree centrality ranking:
  1. Hamlet: 0.889
  2. Claudius: 0.667
  3. Horatio: 0.444
  4. Polonius: 0.444
  5. Laertes: 0.444
  6. Gertrude: 0.333
  7. Ophelia: 0.333
  8. Rosencrantz: 0.222
  9. Guildenstern: 0.222
  10. Ghost: 0.222

Matplotlib is building the font cache; this may take a moment.
```

#### Hints

1. `max(dictionary, key=dictionary.get)` returns the *key* (character name) whose value is highest — not the value itself.
2. Scale node sizes with a list comprehension: `[degree_scores[n] * 3000 for n in G.nodes()]`. The order must match `G.nodes()`.
3. `nx.draw(G, pos=pos, node_size=node_sizes, with_labels=True, font_size=8, node_color="steelblue", edge_color="gray", alpha=0.8)` then `plt.title(...)` and `plt.show()`.

#### Solution
```python
import networkx as nx
import matplotlib.pyplot as plt

raw_interactions = [
    ("Hamlet",   "Horatio"),   ("Hamlet",   "Claudius"),
    ("Hamlet",   "Gertrude"),  ("Hamlet",   "Ophelia"),
    ("Hamlet",   "Polonius"),  ("Hamlet",   "Ghost"),
    ("Hamlet",   "Laertes"),   ("Hamlet",   "Horatio"),
    ("Hamlet",   "Rosencrantz"),("Hamlet",  "Guildenstern"),
    ("Claudius", "Gertrude"),  ("Claudius", "Polonius"),
    ("Claudius", "Laertes"),   ("Claudius", "Horatio"),
    ("Claudius", "Rosencrantz"),("Claudius","Guildenstern"),
    ("Polonius", "Ophelia"),   ("Polonius", "Laertes"),
    ("Polonius", "Gertrude"),  ("Horatio",  "Ghost"),
    ("Horatio",  "Laertes"),   ("Ophelia",  "Laertes"),
    ("Ophelia",  "Gertrude"),  ("Rosencrantz","Guildenstern"),
    ("Hamlet",   "Horatio"),   ("Hamlet",   "Claudius"),
    ("Claudius", "Gertrude"),  ("Polonius", "Claudius"),
]

G = nx.Graph()
G.add_edges_from(raw_interactions)

degree_scores      = nx.degree_centrality(G)
betweenness_scores = nx.betweenness_centrality(G)

protagonist = max(degree_scores,      key=degree_scores.get)
broker      = max(betweenness_scores, key=betweenness_scores.get)

print(f"Protagonist (highest degree):      {protagonist} ({degree_scores[protagonist]:.3f})")
print(f"Broker (highest betweenness):      {broker} ({betweenness_scores[broker]:.3f})")
print()

print("Full degree centrality ranking:")
for i, (name, score) in enumerate(
        sorted(degree_scores.items(), key=lambda x: x[1], reverse=True)):
    print(f"  {i+1}. {name}: {score:.3f}")
print()

pos        = nx.spring_layout(G, seed=42)
node_sizes = [degree_scores[n] * 3000 for n in G.nodes()]

nx.draw(G, pos=pos, node_size=node_sizes, with_labels=True,
        font_size=8, node_color="steelblue", edge_color="gray", alpha=0.8)
plt.title("Hamlet Character Network — Node Size: Degree Centrality")
plt.show()
```

### Challenge: The Humanistic Argument

- id: network-analysis-05-c3
- language: python
- difficulty: intermediate

#### Starter Code
```python
import networkx as nx

raw_interactions = [
    ("Hamlet",   "Horatio"),   ("Hamlet",   "Claudius"),
    ("Hamlet",   "Gertrude"),  ("Hamlet",   "Ophelia"),
    ("Hamlet",   "Polonius"),  ("Hamlet",   "Ghost"),
    ("Hamlet",   "Laertes"),   ("Hamlet",   "Horatio"),
    ("Hamlet",   "Rosencrantz"),("Hamlet",  "Guildenstern"),
    ("Claudius", "Gertrude"),  ("Claudius", "Polonius"),
    ("Claudius", "Laertes"),   ("Claudius", "Horatio"),
    ("Claudius", "Rosencrantz"),("Claudius","Guildenstern"),
    ("Polonius", "Ophelia"),   ("Polonius", "Laertes"),
    ("Polonius", "Gertrude"),  ("Horatio",  "Ghost"),
    ("Horatio",  "Laertes"),   ("Ophelia",  "Laertes"),
    ("Ophelia",  "Gertrude"),  ("Rosencrantz","Guildenstern"),
    ("Hamlet",   "Horatio"),   ("Hamlet",   "Claudius"),
    ("Claudius", "Gertrude"),  ("Polonius", "Claudius"),
]

G = nx.Graph()
G.add_edges_from(raw_interactions)

degree_scores      = nx.degree_centrality(G)
betweenness_scores = nx.betweenness_centrality(G)

# Step 1: Find characters whose BETWEENNESS rank is significantly
# higher than their DEGREE rank — these are the "hidden brokers"
# whose structural importance isn't obvious from popularity alone.
#
# Build two ranked lists (name only, highest to lowest)
# then find characters whose betweenness rank beats their degree rank
# by more than 2 positions.

degree_rank      = [n for n, _ in sorted(degree_scores.items(),
                   key=lambda x: x[1], reverse=True)]
betweenness_rank = [n for n, _ in sorted(betweenness_scores.items(),
                   key=lambda x: x[1], reverse=True)]

print("Hidden brokers (betweenness rank beats degree rank by 3+):")
for name in G.nodes():
    d_rank = degree_rank.index(name)
    b_rank = betweenness_rank.index(name)
    if d_rank - b_rank >= 3:
        print(f"  {name}: degree rank #{d_rank+1}, betweenness rank #{b_rank+1}")

print()

# Step 2: Horatio is Hamlet's closest confidant.
# Calculate what fraction of Hamlet's connections also connect to Horatio.
# This is a simplified "local clustering" measure.
hamlet_neighbours  = set(G.neighbors("Hamlet"))
horatio_neighbours = set(G.neighbors("Horatio"))

shared = hamlet_neighbours & horatio_neighbours
fraction = len(shared) / len(hamlet_neighbours)
print(f"Characters connected to both Hamlet and Horatio: {sorted(shared)}")
print(f"Fraction of Hamlet's network shared with Horatio: {fraction:.2f}")

print()

# Step 3: Assemble the humanistic argument.
# Based on the numbers from Challenges 2 and 3, complete these sentences. Reflect in your notebook on who dominates the centrality measures and what that imght imply; think about Horatio's betweenees rank relative to his degree, and think about what the Rosencrantz-Guildenstern pair's low scores on both measures confirms.
```

#### Expected Output
```
Hidden brokers (betweenness rank beats degree rank by 3+):
  Horatio: degree rank #3, betweenness rank #1

Characters connected to both Hamlet and Horatio: ['Claudius', 'Laertes']
Fraction of Hamlet's network shared with Horatio: 0.25
```

#### Hints

1. `degree_rank.index(name)` returns the 0-based position in the sorted list — add 1 for a human-readable rank number.
2. `set(G.neighbors("Hamlet"))` gives you a Python set of all nodes directly connected to Hamlet — set intersection (`&`) finds the overlap with Horatio's neighbours.
3. For Step 3, let the numbers guide the argument: Horatio ranks #1 in betweenness but only #3 in degree — what role in the play does that pattern describe?

#### Solution
```python
import networkx as nx

raw_interactions = [
    ("Hamlet",   "Horatio"),   ("Hamlet",   "Claudius"),
    ("Hamlet",   "Gertrude"),  ("Hamlet",   "Ophelia"),
    ("Hamlet",   "Polonius"),  ("Hamlet",   "Ghost"),
    ("Hamlet",   "Laertes"),   ("Hamlet",   "Horatio"),
    ("Hamlet",   "Rosencrantz"),("Hamlet",  "Guildenstern"),
    ("Claudius", "Gertrude"),  ("Claudius", "Polonius"),
    ("Claudius", "Laertes"),   ("Claudius", "Horatio"),
    ("Claudius", "Rosencrantz"),("Claudius","Guildenstern"),
    ("Polonius", "Ophelia"),   ("Polonius", "Laertes"),
    ("Polonius", "Gertrude"),  ("Horatio",  "Ghost"),
    ("Horatio",  "Laertes"),   ("Ophelia",  "Laertes"),
    ("Ophelia",  "Gertrude"),  ("Rosencrantz","Guildenstern"),
    ("Hamlet",   "Horatio"),   ("Hamlet",   "Claudius"),
    ("Claudius", "Gertrude"),  ("Polonius", "Claudius"),
]

G = nx.Graph()
G.add_edges_from(raw_interactions)

degree_scores      = nx.degree_centrality(G)
betweenness_scores = nx.betweenness_centrality(G)

degree_rank      = [n for n, _ in sorted(degree_scores.items(),
                   key=lambda x: x[1], reverse=True)]
betweenness_rank = [n for n, _ in sorted(betweenness_scores.items(),
                   key=lambda x: x[1], reverse=True)]

print("Hidden brokers (betweenness rank beats degree rank by 3+):")
for name in G.nodes():
    d_rank = degree_rank.index(name)
    b_rank = betweenness_rank.index(name)
    if d_rank - b_rank >= 3:
        print(f"  {name}: degree rank #{d_rank+1}, betweenness rank #{b_rank+1}")

print()

hamlet_neighbours  = set(G.neighbors("Hamlet"))
horatio_neighbours = set(G.neighbors("Horatio"))
shared   = hamlet_neighbours & horatio_neighbours
fraction = len(shared) / len(hamlet_neighbours)
print(f"Characters connected to both Hamlet and Horatio: {sorted(shared)}")
print(f"Fraction of Hamlet's network shared with Horatio: {fraction:.2f}")
```

